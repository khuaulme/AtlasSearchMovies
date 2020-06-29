exports = function(payload){
  
  
  let arg = payload.query.arg || ' ';
  let runtime = parseInt(payload.query.runtime);
  
  let rating = parseInt(payload.query.rating);
  let start = payload.query.start;
  let end = payload.query.end;
  let genre = payload.query.genre;
  
  const collection = context.services.get("mongodb-atlas").db("sample").collection("movies");
  
  //aggregation array
  let calledAggregation = [
  {
    $search: {
      index: 'TitlesAC', 
      autocomplete: {
        query: arg, 
        path: 'title', 
        tokenOrder: 'any', 
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


let movieTitles = collection.aggregate(calledAggregation).toArray()
  .then(results => results.map(r => r.title.toString()));
   console.log("MOVIE TITLES IS OF TYPE :" + typeof(movieTitles));
  return movieTitles;

};

