exports = function(payload) {
  const collection = context.services.get("mongodb-atlas").db("sample").collection("movies");
  
  let arg = payload.query.arg;
  
  let argArray = arg.split(' ');
  	const valuesToRemove = ['the', 'The', 'A','and', 'those', 'a', 'an', 'these', 'to', 'of', 'in', 'for'];
  
  	for( var j = 0; j < valuesToRemove.length; j++){
    		for( var i = 0; i < argArray.length; i++){ 
        		if ( argArray[i] === valuesToRemove[j]) 
          			argArray.splice(i, 1); 
   		 }
  	}
  	 
  arg = argArray.join(' ');


  return collection.aggregate([
  {
    '$search': {
      'text': {
        'query': arg, 
        'path': 'fullplot'
      }, 
      'highlight': {
        'path': [
          'fullplot', 'plot'
        ]
      }
    }
  }, {
    '$project': {
      'title': 1, 
      'fullplot': 1,
      'year':1,
      'plot': 1, 
      'score': {
        '$meta': 'searchScore'
      }, 
      'highlights': {
        '$meta': 'searchHighlights'
      }
    }
  }, {
    '$limit': 9
  }
]).toArray();
};
