var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs')

app.use(express.static("build"));

console.log("TEST", process.env.NODE_ENV);

app.get('/', function(req,res) {
	console.log("within", process.env.NODE_ENV);
	if(process.env.NODE_ENV!="DEVELOPMENT"){
		console.log("env", process.env.NODE_ENV);
		res.sendFile(__dirname + '/index.html');
		
	} else{
		console.log("dev", process.env.NODE_ENV);
		res.sendFile(__dirname + '/index-dev.html');
	}
});

app.listen(3000, function() {
  console.log('Server is listening on port 3000');

});
