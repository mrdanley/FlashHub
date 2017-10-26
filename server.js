var analytics = "";

 function runAPI(post){
   var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
   var natural_language_understanding = new NaturalLanguageUnderstandingV1({
     'username': '6a94dba3-2dfc-4ebd-9061-14321e40b4f3',
     'password': 'KlGVUtjP5Nb8',
     'version_date': '2017-02-27'
   });

   var parameters = {
     'url': "https://www.firerescue1.com/volunteer/articles/347275018-Fire-chief-wants-fewer-volunteer-firefighters-more-paid-ones/",
     'features': {
       'emotion': {},
       'sentiment' : {}
     }
   }
   natural_language_understanding.analyze(parameters, function(err, response) {
     if (err)
       analytics = 'error:'+ err;
     else
       analytics = "Score: "+response['sentiment']['document']['score']+'<br>'+
                    "Label: "+response['sentiment']['document']['label']+'<br>'+
                    "Sadness: "+response['emotion']['document']['emotion']['sadness']+'<br>'+
                    "Joy: "+response['emotion']['document']['emotion']['joy']+'<br>'+
                    "Fear: "+response['emotion']['document']['emotion']['fear']+'<br>'+
                    "Disgust: "+response['emotion']['document']['emotion']['disgust']+'<br>'+
                    "Anger: "+response['emotion']['document']['emotion']['anger']+'<br>';
   });
   console.log(analytics);
 }


 var http = require('http'),
      fs = require('fs'),
     url = require('url'),
     qs = require('querystring');

 http.createServer(function(request, response)
 {
   var path = url.parse(request.url).pathname;
   if(path=="/getstring"){
      response.writeHead(200, {"Content-Type": "text/plain", 'Access-Control-Allow-Origin' : '*'});
      response.end(analytics);
    }else if(path=="/poststring"){
      var body = '';

        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            var post = qs.parse(body);
            console.log(post);
            runAPI(post);
        });
    }else{
      fs.readFile('./index.html', function(err, file) {
          if(err) {
              console.log("err: ",err);
              return;
          }
          response.writeHead(200, { 'Content-Type': 'text/html' });
          response.end(file, "utf-8");
      });
    }
}).listen(8001);
console.log('server running...');
