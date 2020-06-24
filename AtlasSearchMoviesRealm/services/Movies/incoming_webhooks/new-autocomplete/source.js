exports = function(payload){
  
  // THIS FUNCTION WILL FUZZY MATCH FOR ALL ARGUMENT TERMS IN THE TITLE, FULLPLOT, AND PLOT FIELDS
  // BECAUSE THIS IS SOMETHING CURRENTLY NOT SUPPORTED, I BROKE UP THE ARG INTO AN ARRAY OR TERMS ("MOT"). --- LINE 56
  // THEN CREATED A  "NEWTERM" OBJECT WITH THE "MOT" --- LINE 58
  // FINALLY I PUSHED THE "NEWTERM" OBJECT ONTO THE "$searchBeta.compound.should" ARRAY IN THE ORIGINAL (FOR 1 TERM) AGGREGATION PIPELINE 'calledAggregation' --- LINE 63
  
  let arg = payload.query.arg || ' ';
  let runtime = parseInt(payload.query.runtime);
  
  let rating = parseInt(payload.query.rating);
  let start = payload.query.start;
  let end = payload.query.end;
  let genre = payload.query.genre;

  
  const collection = context.services.get("mongodb-atlas").db("sample").collection("movies");
  
  let argArray = arg.split(' ');
  const valuesToRemove = ['the', 'The', 'A','and', 'those', 'a', 'an', 'in','these', 'to', 'of', 'for'];
  
// These loops remove the STOP WORDS listed in valuesToRemove from the argument array 'argArray' 
  for( var j = 0; j < valuesToRemove.length; j++){
    for( var i = 0; i < argArray.length; i++){ 
        if ( argArray[i] === valuesToRemove[j]) 
          argArray.splice(i, 1); 
    }
  }
  
    console.log(argArray);
  arg = argArray.join(' ');
  console.log("Argument is " + arg);
  console.log("argArray is " + argArray);
  // argArray is array of the valid words in the searchText box
  let mot = "";
  
  //aggregation array
  let calledAggregation = [
  {
    $search: {
      index: 'TitlesAC', 
      autocomplete: {
        query: arg, 
        path: 'title', 
        tokenOrder: 'sequential', 
        fuzzy: {
          prefixLength: 8
        }
      }
    }
  }, {
    $project: {
      title: 1
    }
  }, {
    $limit: 15
  }
];

//return collection.aggregate(calledAggregation).toArray();

let movieTitles = collection.aggregate(calledAggregation).toArray()
  .then(results => results.map(r => r.title.toString()));
   console.log("MOVIE TITLES IS OF TYPE :" + typeof(movieTitles));
  return movieTitles;

};
