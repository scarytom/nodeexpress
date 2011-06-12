"user strict";
var express = require("express"),
    twitter = require("./twitter"),
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

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);
