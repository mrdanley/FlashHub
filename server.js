//analytics array
var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    feed = require('rss-to-json');

//access ibm watson nlu api
var NaturalLanguageUnderstandingV1,
    natural_language_understanding,
    analytics = {};

//convert search to rss and convert to json
function rss2json(searchString){
  var rss = 'https://news.google.com/news/rss/search/section/q/'+searchString+'/'+searchString+'?hl=en&gl=US&ned=us';
  console.log("Converting rss, "+rss+"...");
  feed.load(rss,function(err,json){
      console.log("Converted json...");
      useNLU(json);
  });
  //callback();
}
//get sentiment and emotions for first 10 articles
function useNLU(jsonItem){
  var parameters;
  NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
  natural_language_understanding = new NaturalLanguageUnderstandingV1({
    'username': '6a94dba3-2dfc-4ebd-9061-14321e40b4f3',
    'password': 'KlGVUtjP5Nb8',
    'version_date': '2017-02-27'
  });
  var apiIndex = 0;
  var titleIndices = [];
  for(var i=0, apiIndex = 0; i<jsonItem["items"].length; i++){
    parameters = {
      'url': jsonItem["items"][i]["url"],
      'features': {
        'metadata': {},
        'emotion': {},
        'sentiment': {}
      }
    };
    natural_language_understanding.analyze(parameters, function(err, response) {
      if (err){
        console.log("error: "+err);
      }
      else{
        analytics[apiIndex] = JSON.stringify(response);
        console.log(analytics[apiIndex]);
        apiIndex++;
      }
    });
  }
}

//communicate with client-side javascript file
 http.createServer(function(request, response){
   var path = url.parse(request.url).pathname;
   if(path=="/poststring"){
       var requestData = '';

       request.on('data', function (data) {
           requestData += data;
           if (requestData.length > 1e6)
               request.connection.destroy();
       });

       request.on('end', function () {
          console.log('Request data sent: ', requestData);
          rss2json(requestData);
       });
    }else if(path=="/getstring"){
       response.writeHead(200, {"Content-Type": "text/plain", 'Access-Control-Allow-Origin' : '*'});
       response.end(JSON.stringify(analytics));
    }else{
      fs.readFile('./index.html', function(err, file) {
          if(err) {
              console.log(err);
              return;
          }
          response.writeHead(200, { 'Content-Type': 'text/html' });
          response.end(file, "utf-8");
      });
    }
}).listen(8001);
console.log('server running...');
