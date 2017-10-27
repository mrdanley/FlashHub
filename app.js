//wait for events from html interaction
document.addEventListener('DOMContentLoaded',function() {
	var divs = document.querySelectorAll('div');
	document.getElementById("submitButton").addEventListener("click", runSearch);
});

function runSearch(){
  var search = document.getElementById('search').value;

  xmlhttp = new XMLHttpRequest();

  xmlhttp.open("POST","http://localhost:8001/poststring", true);
  xmlhttp.send(search);
	xmlhttp.open("GET","http://localhost:8001/getstring", true);
  xmlhttp.onreadystatechange=function(){
     if (xmlhttp.readyState==4 && xmlhttp.status==200){
       document.getElementById('results').innerHTML = xmlhttp.responseText;
     }
  }
  xmlhttp.send();
}
