document.addEventListener('DOMContentLoaded',function() { //Big brother is always listening
	var divs = document.querySelectorAll('div');
	document.getElementById("click1").addEventListener("click", myFunction);
});


// function click(e){
// 	chrome.tabs.executeScript(null,
// 	{code:"document.body.style.backgroundImage='url(" +images[e.target.id]
// 	+ "'"});
// 	window.close();
// }

function myFunction() {
	 //alert(x);
	 chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
     var activeTab = arrayOfTabs[0];	//Only one active tab in existence
     var activeTabId = activeTab.id;
     var user_input = document.getElementById("search").value;

		 //Will return the URL of the current active tab.
		 document.getElementById("url").innerHTML = "You are currently at: " + activeTab.url;
		 document.getElementById("demo").innerHTML = NLU_API(user_input);
  });
}

function NLU_API(input){
	//create variable to use api
	var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

	//allows user access to api
	var natural_language_understanding = new NaturalLanguageUnderstandingV1({
		'username': '6a94dba3-2dfc-4ebd-9061-14321e40b4f3',
		'password': 'KlGVUtjP5Nb8',
		'version_date': '2017-02-27'
	});
	//create parameters for nlu to user in intepretation
	var parameters = {
		//'url': 'http://www.rollingstone.com/glixel/news/league-of-legends-developers-are-working-on-a-new-game-w508720',
	 'text': input,
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
	var output = "before test";	//api output variable
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

chrome.tabs.getCurrent(function(tab){
 	document.getElementById("demo").innerHTML = tab.url;
        console.log(tab.url);
    }
);

var images = {
	doggo: 'https://i.ytimg.com/vi/vjzpLahk1ns/maxresdefault.jpg',
	pupper: 'https://i.ytimg.com/vi/vjzpLahk1ns/maxresdefault.jpg',
	puggo: 'https://i.ytimg.com/vi/vjzpLahk1ns/maxresdefault.jpg'

}
