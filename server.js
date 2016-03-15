var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


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

server.listen(3000, function() {
  console.log('Server is listening on port 3000');

});

io.on('connection', function (socket) {
	console.log("it worked")
  socket.emit('news', { hello: 'world' });
  socket.emit('my other event', function (data) {
    console.log(data);
  });
});
