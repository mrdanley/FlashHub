function click(e){
	chrome.tabs.executeScript(null,
	{code:"document.body.style.backgroundImage='url(" +images[e.target.id]
	+ "'"});
	window.close();
}

document.addEventListener('DOMContentLoaded',function() {
	var divs = document.querySelectorAll('div');

	document.getElementById("click1").addEventListener("click", myFunction);
});


function myFunction() {
	    document.getElementById("demo").innerHTML = "Hello World";
	    alert("Whoa");
	}

function onClick() {
	    document.getElementById("demo")
	//window.location.href = "http://stackoverflow.com";

	    alert("Whoa");
	}

var images = {
	doggo: 'https://i.ytimg.com/vi/vjzpLahk1ns/maxresdefault.jpg',
	pupper: 'https://i.ytimg.com/vi/vjzpLahk1ns/maxresdefault.jpg',
	puggo: 'https://i.ytimg.com/vi/vjzpLahk1ns/maxresdefault.jpg'
	
}