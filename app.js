//wait for events from html interaction
document.addEventListener('DOMContentLoaded',function() {
	var divs = document.querySelectorAll('div');
	document.getElementById("submitButton").addEventListener("click", runSearch);
});

function runSearch(){
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

	//emotion variables
	var sadness, joy, fear, disgust, anger;
	//sample values
	sadness = 20;
	joy = 20;
	fear = 20;
	disgust = 20;
	anger = 20;
  graphLoad(sadness,joy,fear,disgust,anger);
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
				document.getElementById("results").innerHTML = xmlhttp.responseText;
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

//create emotion graph
function graphLoad(sadness,joy,disgust,fear,anger) {
	 var chart = new CanvasJS.Chart("chartContainer",
	 {
		 title:{
			 text: "Emotions"
		 },
		 data: [
		 		{
					type: "doughnut",
					dataPoints: [
						{  y: sadness, indexLabel: "Sadness" },
						{  y: joy, indexLabel: "Joy" },
						{  y: disgust, indexLabel: "Disgust" },
						{  y: fear, indexLabel: "Fear" },
						{  y: anger, indexLabel: "Anger" }
					]
				}
			]
	});
	document.getElementById("chartContainer").style.height="300px";
	 chart.render();
 }
