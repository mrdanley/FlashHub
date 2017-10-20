var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': '6a94dba3-2dfc-4ebd-9061-14321e40b4f3',
  'password': 'KlGVUtjP5Nb8',
  'version_date': '2017-02-27'
});

var parameters = {
  'url': 'http://www.rollingstone.com/glixel/news/league-of-legends-developers-are-working-on-a-new-game-w508720',
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

natural_language_understanding.analyze(parameters, function(err, response) {
  if (err)
    console.log('error:', err);
  else
    console.log(JSON.stringify(response,null,2));
  /*
    console.log("Score: "+response['sentiment']['document']['score']);
    console.log("Label: "+response['sentiment']['document']['label']+'\n');
    console.log("Sadness: "+response['emotion']['document']['emotion']['sadness']);
    console.log("Joy: "+response['emotion']['document']['emotion']['joy']);
    console.log("Fear: "+response['emotion']['document']['emotion']['fear']);
    console.log("Disgust: "+response['emotion']['document']['emotion']['disgust']);
    console.log("Anger: "+response['emotion']['document']['emotion']['anger']);
    */
});
