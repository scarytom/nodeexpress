(function() {
	"user strict";
	var http = require("http");
	    
	
	module.exports.search = function(queryString, handler) {
		var options = {
		        host: "search.twitter.com",
		        port: 80,
		        path: "/search.json?q=" + queryString
		    };
		
		http.get(options, function(res) {
		    console.log("Got response: " + res.statusCode);
	        res.on('data', function(data) {
	            handler(data);
	        });
	    }).on('error', function(e) {
	        console.log("Got error: " + e.message);
	    });
	};
})();