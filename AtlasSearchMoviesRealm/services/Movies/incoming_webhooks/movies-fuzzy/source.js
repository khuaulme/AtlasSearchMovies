exports = function(payload){
  
  // THIS FUNCTION WILL FUZZY MATCH FOR ALL ARGUMENT TERMS IN THE TITLE, FULLPLOT, AND PLOT FIELDS
  // BECAUSE THIS IS SOMETHING CURRENTLY NOT SUPPORTED, I BROKE UP THE ARG INTO AN ARRAY OR TERMS ("MOT"). --- LINE 56
  // THEN CREATED A  "NEWTERM" OBJECT WITH THE "MOT" --- LINE 58
  // FINALLY I PUSHED THE "NEWTERM" OBJECT ONTO THE "$searchBeta.compound.should" ARRAY IN THE ORIGINAL (FOR 1 TERM) AGGREGATION PIPELINE 'calledAggregation' --- LINE 63
  
  let arg = payload.query.arg;
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
        compound: {
          should: [
          	 { text: { 
                  path: ['plot', 'fullplot','title'], 
                  query: arg,
                  fuzzy: {maxEdits: 1.0}
                }}   
  	      ]
  	      ,must:[],
  	   },        
        highlight: {  path: ['plot', 'fullplot'] }      // changed from path: fullplot
      }},
    {
      $project: {
        title: 1, 
        _id: 0, 
        genres:1,
        runtime:1,
        'imdb.rating':1,
        released: 1,
        year: 1, 
        fullplot: 1, 
        plot:1,
        poster:1,
        score: {  $meta: 'searchScore'}, 
        highlight: {  $meta: 'searchHighlights'}
      }},
    { $limit: 9  }
    ];
  
 
  
  if (start) {
    if (end){
      let releaseStage = {
        "range": {
            "path": "released",
            "gte":  new Date(start),
            "lte":  new Date(end)
        }};
        calledAggregation[0].$search.compound.must.push(releaseStage);
 
    }
  }
 // END START
 if (genre){
      console.log("GENRE: " + genre);
      let genreStage = {
          "term": {
              "query": genre,
              "path": "genres"
          }};
      calledAggregation[0].$search.compound.must.push(genreStage);
    }  
  
  if (runtime){
    
    console.log("RUNTIME: " + runtime);
      
    let runtimeStage = {
        "range": {
          "path": "runtime",  
          "gte": 0,
          "lte": runtime
          }};
      calledAggregation[0].$search.compound.must.push(runtimeStage);
    }
    
    if (rating){
    
      console.log("rating: " + rating);
        
      let ratingStage = {
          "range": {
            "path": "imdb.rating",  
            "gte": rating,
            "lte": 10
            }};
        calledAggregation[0].$search.compound.must.push(ratingStage);
    }
    
    // for ( let j = 0; j < argArray.length; j++) {
    //   mot = argArray[j];
    
    //   let newTerm = { text: {  
    //         	        path: ['fullplot','plot', 'title'], 
    //         	        query:mot, 
    //         	        fuzzy: {maxEdits: 1.0}           
    //         	        }};
    //   calledAggregation[0].$search.compound.should.push(newTerm);
    //   console.log("PUSHED: "+ mot);
    // }
    console.log(JSON.stringify(calledAggregation));
  
  return collection.aggregate(calledAggregation).toArray();
  

};

