var request = require('request'),
	cheerio = require('cheerio'),
	urls = [];
	
//var url = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Fnews%3Fq%3Dnike%26output%3Drss';
//loadJSON(url, getData);

function myData(getData){
	console.log(getData.feed.title);
}	
request('https://www.google.com/search?biw=1920&bih=908&tbm=nws&q=nike', function(err,resp, body){
	if(!err && resp.statusCode == 200){
		var $ = cheerio.load(body);
		$('div.st','#ires').each(function(){
			var mytext = $(this).html();
			//var finalt = mytext.text();
			urls.push(mytext);
			});
		console.log(urls);
	}
});