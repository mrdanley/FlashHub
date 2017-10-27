var analytics = "",
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    feed = require('rss-to-json');


//communicate with client-side javascript file
 http.createServer(function(request, response)
 {
   var path = url.parse(request.url).pathname;
   if(path=="/poststring"){
       var requestData = '';

       request.on('data', function (data) {
           requestData += data;
           if (requestData.length > 1e6)
               request.connection.destroy();
       });

       request.on('end', function () {
           useNLU(requestData);
       });
    }else if(path=="/getstring"){
       response.writeHead(200, {"Content-Type": "text/plain", 'Access-Control-Allow-Origin' : '*'});
       response.end(analytics);
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

//access ibm watson nlu api
function useNLU(searchString){
  var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
  var natural_language_understanding = new NaturalLanguageUnderstandingV1({
    'username': '6a94dba3-2dfc-4ebd-9061-14321e40b4f3',
    'password': 'KlGVUtjP5Nb8',
    'version_date': '2017-02-27'
  });
  //convert search to rss and convert to json
  var json = rss2json(searchString);
  console.log('json: ',json);
  //get sentiment and emotions for first 10 articles
  var analytics = [];
  for(var i=0;i<1;i++){
    var parameters = {
      'url': json["items"][i]["url"],
      'features': {
        'emotion': {},
        'sentiment' : {}
      }
    }
    natural_language_understanding.analyze(parameters, function(err, response) {
      if (err)
        analytics[i] = 'error: '+ err;
      else
        analytics[i] =  json["items"][i]["title"]+'<br><br>'+
                     "Score: "+response['sentiment']['document']['score']+'<br>'+
                     "Label: "+response['sentiment']['document']['label']+'<br><br>'+
                     "Sadness: "+response['emotion']['document']['emotion']['sadness']+'<br>'+
                     "Joy: "+response['emotion']['document']['emotion']['joy']+'<br>'+
                     "Fear: "+response['emotion']['document']['emotion']['fear']+'<br>'+
                     "Disgust: "+response['emotion']['document']['emotion']['disgust']+'<br>'+
                     "Anger: "+response['emotion']['document']['emotion']['anger']+'<br><br>';
    });
  }
}

function rss2json(searchString){
  var rss = 'https://news.google.com/news?q='+searchString+'&output=rss';
  feed.load(rss,function(err,json){
      return json;
  });
}
