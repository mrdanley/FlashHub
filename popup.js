function click(e){
	chrome.tabs.executeScript(null,
	{code:"document.body.style.backgroundImage='url(" +images[e.target.id]
	+ "'"});
	window.close();
}

document.addEventListener('DOMContentLoaded',function() {
	var divs = document.querySelectorAll('div');
	for (var i = 0; i < divs.length; i++){
		divs[i].addEventListener('click', click);
	}
});

var images = {
	doggo: 'https://i.ytimg.com/vi/vjzpLahk1ns/maxresdefault.jpg',
	pupper: 'https://i.ytimg.com/vi/vjzpLahk1ns/maxresdefault.jpg',
	puggo: 'https://i.ytimg.com/vi/vjzpLahk1ns/maxresdefault.jpg'
	
}