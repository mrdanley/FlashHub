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
		 document.getElementById("demo").innerHTML = user_input;
  });
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
