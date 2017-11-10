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
	setTimeout(function() { get(xmlhttp); },14000);
        graphLoad();
       
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
				document.getElementById('results').innerHTML = xmlhttp.responseText;
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


 function graphLoad() {
    var chart = new CanvasJS.Chart("chartContainer",
    {
      title:{
        text: "Analazing results from Watson"
      },
      data: [
      {
       type: "doughnut",
       dataPoints: [
       {  y: 2, indexLabel: "Android" },
       {  y: 35.0, indexLabel: "Apple iOS" },
       {  y: 7, indexLabel: "Blackberry" },
       {  y: 2, indexLabel: "Windows Phone" },
       {  y: 5, indexLabel: "Others" }
       ]
     }
     ]
   });

    chart.render();
     document.getElementById("chartContainer").innerHTML=chart;
       
  }