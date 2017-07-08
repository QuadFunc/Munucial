var http = require('http');

var fs = require('fs');


// Loading the file index.html displayed to the client

var server = http.createServer(function(req, res) {

    fs.readFile('./index.html', 'utf-8', function(error, content) {

        res.writeHead(200, {"Content-Type": "text/html"});

        res.end(content);

    });
	// Loading socket.io

var io = require('socket.io').listen(server);

io.sockets.setMaxListeners(0);
io.sockets.on('connection', function (socket) {
//emitter.setMaxListeners(10);
    // When the client connects, they are sent a message
if (req.url == "/update") {
	io.emit('message', 'Youa are sdsdconnected!');
};
    // The other clients are told that someone new has arrived

    //socket.broadcast.emit('message', 'Another client has just connected!');


    // As soon as the username is received, it's stored as a session variable

    


    // When a "message" is received (click on the button), it's logged in the console

    //socket.on('message', function (message) {

        // The username of the person who clicked is retrieved from the session variables

        //console.log(' is speaking to me! They\'re saying: ' + message);

    //}); 

});



});



server.listen(8080);

