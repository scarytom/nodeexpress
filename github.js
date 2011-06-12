(function() {
	"use strict";
	var http = require("http");
	
	module.exports.search = function(userRepo, handler) {
		var options = {
		        host: "github.com",
		        port: 80,
		        path: "/api/v2/json/commits/list/" + userRepo + "/master?page=1"
		    };
		
		http.get(options, function(res) {
			var content = "";
	        res.on("data", function(data) {
	            content += data;
	        });
	        res.on("end", function() {
	        	handler(JSON.parse(content));
	        });
	    }).on("error", function(e) {
	        console.log("Got error: " + e.message);
	    });
	};
})();