"user strict";
var express = require("express"),
    twitter = require("./twitter"),
    github = require("./github"),
    gitAccts = [];
    app = module.exports = express.createServer();

app.configure(function(){
  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + "/public"));
});

app.configure("development", function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure("production", function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get("/", function(req, res){
  res.render("index", {
    title: "Express"
  });
});

app.get("/:search/results.json", function(req, res) {
	twitter.search(req.params.search, function(data) {
		var tweets = data.results;
		    responseText = "";
		for (var index in tweets) {
			responseText += tweets[index].text;
		}
		res.send(responseText);
	});
});

app.get("/:name/:repo/github.json", function(req, res) {
	github.search(req.params.name, req.params.repo, function(data) {
		res.send(data);
	});
});

function pollGithub() {
	for(var index in gitAccts) {
		github.search(gitAccts[index], function(data) {
			if (data.error) {
				return;
			}
			console.log(gitAccts[index] + " " + data.commits.length);
		});
	}
}

function pollTwitter() {
	twitter.search("%23spa2011%20%23github", function(data) {
		var tweets = data.results,
		    index,
		    text,
		    hubindex;
		
		console.log("twitter " + data);
		
		for (index in tweets) {
			text = tweets[index].text;
			hubindex = text.indexOf("#github");
			if (hubindex <= 0) {
				continue;
			}
			console.log("adding git account/repo of " + text.substring(hubindex + 8));
			gitAccts.push(text.substring(hubindex + 8));
		}
	});
}

setInterval(pollGithub, 2000);
setInterval(pollTwitter, 10000);

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);
