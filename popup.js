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

 chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
     var activeTab = arrayOfTabs[0];	//Only one active tab in existence
     var activeTabId = activeTab.id; 
     document.getElementById("demo").innerHTML = activeTab.url;


  });

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