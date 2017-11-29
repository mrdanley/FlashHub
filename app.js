//wait for events from html interaction
document.addEventListener('DOMContentLoaded',function() {
	var divs = document.querySelectorAll('div');
	document.getElementById("submitButton").addEventListener("click", runSearch);
});

function runSearch(){
	//disabling submit button
	document.getElementById('submitButton').disabled = true;
	document.getElementById('submitButton').innerHTML = "Wait";

	resetExtensionResults();

  var search = document.getElementById('search').value;
	var searchParts = search.split(' ');
	if(searchParts.length>1){
		search = combineMultipleWords(searchParts);
	}

	var xmlhttp = new XMLHttpRequest();
	post(xmlhttp,search);

	//data analytics timer countdown
	var seconds_left = 0;
	var messages = [
		"Request data sent...",
		"Converting html to rss...",
		"Converting rss to json...",
		"Fetching news URLs...",
		"Utilizing IBM Watson NLU API...",
		"Analyzing data..."
	];
	var interval = setInterval(function() {
  	if (seconds_left < 6){
    	document.getElementById('results').innerHTML += messages[seconds_left]+"<br>";
			++seconds_left;
		}
 	}, 1000);

	//countdown before taking results from server
	//making button active again
	setTimeout(function() {
		get(xmlhttp);
		document.getElementById('submitButton').disabled = false;
		document.getElementById('submitButton').innerHTML = "Submit";
	},7000);
}

function combineMultipleWords(searchParts){
	var combinedSearch = "";
	for(var i=0;i<searchParts.length;i++){
		combinedSearch+=searchParts[i];
		if(i<searchParts.length-1){
			combinedSearch+='+';
		}
	}
	return combinedSearch;
}

function resetExtensionResults(){
	//clearing results message
	document.getElementById('results').innerHTML = "";
	//hide and reset sentiment graph
	document.getElementById('sentimentGraph').style.display="none";
	sentimentGraph(0,0);
	//hide and reset emotion graph
	document.getElementById('emotionGraph').style.display="none";
  emotionGraph(0,0,0,0,0);
	//hide and reset newspaper image
	document.getElementById('newspaperImage').style.display="none";
	//clear newspaper newspaperCaption
	document.getElementById('newspaperCaption').innerHTML="";
}

function post(xmlhttp,search) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    xmlhttp.open('POST', "http://localhost:8001/poststring", true);

    // Handle network errors
    xmlhttp.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    xmlhttp.send(search);
  });
}

function get(xmlhttp) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    xmlhttp.open('GET', "http://localhost:8001/getstring", true);
    xmlhttp.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (xmlhttp.readyState==4 && xmlhttp.status == 200) {
				//convert responseText to json
				var x = xmlhttp.responseText;
				x = x.replace(/\"{/g,"{");
				x = x.replace(/}\"/g,"}");
				x = x.replace(/\\"/g,'"');
				x = JSON.parse(x);
				analyzeReturnData(x);

        resolve(xmlhttp.response);
      }
      else {
        reject(Error(xmlhttp.statusText));
      }
    };

    // Handle network errors
    xmlhttp.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    xmlhttp.send();
  });
}

function analyzeReturnData(json){
	var positiveSum=0,
			negativeSum=0,
			sadnessSum=0,
			joySum=0,
			fearSum=0,
			disgustSum=0,
			angerSum=0,
			jsonLength=Object.keys(json).length;
	for(var i=0;i<jsonLength;i++){
		if(json[i]["sentiment"]["document"]["label"] == "negative"){
			negativeSum += json[i]["sentiment"]["document"]["score"];
		}else{
			positiveSum += json[i]["sentiment"]["document"]["score"];
		}

		sadnessSum += json[i]["emotion"]["document"]["emotion"]["sadness"];
		joySum += json[i]["emotion"]["document"]["emotion"]["joy"];
		fearSum += json[i]["emotion"]["document"]["emotion"]["fear"];
		disgustSum += json[i]["emotion"]["document"]["emotion"]["disgust"];
		angerSum += json[i]["emotion"]["document"]["emotion"]["anger"];
	}

	if(positiveSum>Math.abs(negativeSum)){
		if(positiveSum-Math.abs(negativeSum) > 0.75){
			document.getElementById('results').innerHTML = "Overall Extremely Positive";
		}else if(positiveSum-Math.abs(negativeSum) > 0.5){
			document.getElementById('results').innerHTML = "Overall Positive";
		}else if(positiveSum-Math.abs(negativeSum) > 0.25){
			document.getElementById('results').innerHTML = "Overall Slightly Positive";
		}else{
			document.getElementById('results').innerHTML = "Overall Neutrally Positive";
		}
	}else{
		if(negativeSum/Math.abs(positiveSum) > 0.75){
			document.getElementById('results').innerHTML = "Overall Extremely Negative";
		}else if(negativeSum-Math.abs(positiveSum) > 0.5){
			document.getElementById('results').innerHTML = "Overall Negative";
		}else if(negativeSum-Math.abs(positiveSum) > 0.25){
			document.getElementById('results').innerHTML = "Overall Slightly Negative";
		}else{
			document.getElementById('results').innerHTML = "Overall Neutrally Negative";
		}
	}

	//sentiment variables
	var positive, negative;
	//sample values
	positive=positiveSum/jsonLength;
	negative=negativeSum/jsonLength;
	//show sentiment graph
	document.getElementById('sentimentGraph').style.display="block";
	sentimentGraph(positive, negative);

	//emotion variables
	var sadness, joy, fear, disgust, anger;
	//sample values
	sadness = sadnessSum/jsonLength;
	joy = joySum/jsonLength;
	fear = fearSum/jsonLength;
	disgust = disgustSum/jsonLength;
	anger = angerSum/jsonLength;
	//show emotion graph
	document.getElementById('emotionGraph').style.display="block";
  emotionGraph(sadness,joy,fear,disgust,anger);

	//adding links to newspaper image
	document.getElementById('link1').href = json[0]["retrieved_url"];
	document.getElementById('link2').href = json[1]["retrieved_url"];
	document.getElementById('link3').href = json[2]["retrieved_url"];
	document.getElementById('link4').href = json[3]["retrieved_url"];
	if(json[0]["warnings"]){
		document.getElementById('link1').title = json[0]["retrieved_url"];
	}else{
		document.getElementById('link1').title = json[0]["metadata"]["title"];
	}
	if(json[1]["warnings"]){
		document.getElementById('link2').title = json[1]["retrieved_url"];
	}else{
		document.getElementById('link2').title = json[1]["metadata"]["title"];
	}
	if(json[2]["warnings"]){
		document.getElementById('link3').title = json[2]["retrieved_url"];
	}else{
		document.getElementById('link3').title = json[2]["metadata"]["title"];
	}
	if(json[3]["warnings"]){
		document.getElementById('link4').title = json[3]["retrieved_url"];
	}else{
		document.getElementById('link4').title = json[3]["metadata"]["title"];
	}
	//show newspaper image
	document.getElementById('newspaperImage').style.display="block";
	document.getElementById('newspaperCaption').innerHTML="Click on paragraphs to see news articles";
}

//create emotion graph
function emotionGraph(sadness,joy,disgust,fear,anger) {
	 var chart = new CanvasJS.Chart(
		 "emotionGraph",
	 	{
    	exportEnabled: true,
      animationEnabled: true,
      theme:"theme2",
      backgroundColor: "#f0f5f5",
		 	title:{
				text: "Emotions"
		 	},
			axisX:{
				labelFontSize: 0
			},
      axisY:{
				labelFontSize: 0
      },
		 	data: [
				{
					type: "column",
					dataPoints: [
						{  y: sadness, indexLabel: "Sadness" },
						{  y: joy, indexLabel: "Joy" },
						{  y: disgust, indexLabel: "Disgust" },
						{  y: fear, indexLabel: "Fear" },
						{  y: anger, indexLabel: "Anger" }
					]
				}
			]
		}
	);
	chart.render();
}

//create sentiment graph
function sentimentGraph(positive, negative) {
	var chart2 = new CanvasJS.Chart("sentimentGraph",
    {
			exportEnabled: true,
      animationEnabled: true,
      theme:"theme2",
      backgroundColor: "#f0f5f5",
      title:{
        text: "Sentiment"
      },
      data: [
      	{
        	type: "pie",
					showInLegend: true,
          dataPoints: [
          	{ y: positive, name: "Positive", color: "blue"},
            { y: negative, name: "Negative", color: "red"}
          ]
      	}
      ]
    }
	);
	chart2.render();
}
