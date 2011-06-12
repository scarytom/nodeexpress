(function() {
	"use strict";
	var http = require("http");
	
	module.exports.search = function(queryString, handler) {
		var options = {
		        host: "search.twitter.com",
		        port: 80,
		        path: "/search.json?q=" + queryString
		    };
		
		http.get(options, function(res) {
			var content = "";
	        res.on('data', function(data) {
	            content += data;
	        });
	        res.on('end', function() {
	        	handler(JSON.parse(content));
	        });
	    }).on('error', function(e) {
	        console.log("Got error: " + e.message);
	    });
	};
})();