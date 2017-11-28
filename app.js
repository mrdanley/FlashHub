//wait for events from html interaction
document.addEventListener('DOMContentLoaded',function() {
	var divs = document.querySelectorAll('div');
	document.getElementById("submitButton").addEventListener("click", runSearch);
});

function runSearch(){
	document.getElementById('results').innerHTML = "";
  var search = document.getElementById('search').value;
	var xmlhttp = new XMLHttpRequest();
	post(xmlhttp,search);

	//data analytics timer countdown
	var seconds_left = 14;
	var interval = setInterval(function() {
  	if (seconds_left > 0){
        document.getElementById('results').innerHTML = "Analyzing search..."+(--seconds_left);
     }
 	}, 1000);

	setTimeout(function() { get(xmlhttp); },14000);
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
		document.getElementById('results').innerHTML = "Overall Positive";
	}else{
		document.getElementById('results').innerHTML = "Overall Negative";
	}

	//sentiment variables
	var positive, negative;
	//sample values
	positive=positiveSum/jsonLength;
	negative=negativeSum/jsonLength;
	//show sentiment graph
	document.getElementById('sentimentGraph').style.height="300px";
	document.getElementById('sentimentGraph').style.width="340px";
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
	document.getElementById('emotionGraph').style.height="300px";
	document.getElementById('emotionGraph').style.width="340px";
  emotionGraph(sadness,joy,fear,disgust,anger);

	//show newspaper image
	document.getElementById('newspaperImage').style.height="100%";
	document.getElementById('newspaperImage').style.width="100%";
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
      axisY:{
      	labelFontSize: 30,
        labelFontColor: "blue"
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
			showInLegend: true,
      data: [
      	{
        	type: "pie",
          dataPoints: [
          	{ y: positive, label: "positive"},
            { y: negative, label: "negative"},
          ]
      	}
      ]
    }
	);
	chart2.render();
}
