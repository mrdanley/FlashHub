function nlu_call(){
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js);
//allows user access to api
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': '6a94dba3-2dfc-4ebd-9061-14321e40b4f3',
  'password': 'KlGVUtjP5Nb8',
  'version_date': '2017-02-27'
});
//create parameters for nlu to user in intepretation
var parameters = {
  //'url': 'http://www.rollingstone.com/glixel/news/league-of-legends-developers-are-working-on-a-new-game-w508720',
 'text': "asdasdasdawd dadadad asdasd adsasd",
  'features': {
    'emotion': {},
    'sentiment' : {},
    'keywords' : {
      'emotion' : true,
      'sentiment' : true,
      'limit' : 5
    }
  }
}
var output = "";
natural_language_understanding.analyze(parameters, function(err, response) {
  if (err)
    output = ('API error:'+err);
  else{
    output = ("Score: "+response['sentiment']['document']['score']+'\n'+
               "Label: "+response['sentiment']['document']['label']+'\n\n'+
               "Sadness: "+response['emotion']['document']['emotion']['sadness']+'\n'+
               "Joy: "+response['emotion']['document']['emotion']['joy']+'\n'+
               "Fear: "+response['emotion']['document']['emotion']['fear']+'\n'+
               "Disgust: "+response['emotion']['document']['emotion']['disgust']+'\n'+
               "Anger: "+response['emotion']['document']['emotion']['anger']+'\n');
   }
});
return output;

}
