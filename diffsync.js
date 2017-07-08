// setting up express and socket.io 
  var app = require('express')();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);
 
  // setting up diffsync's DataAdapter 
  var diffSync    = require('diffsync');
  var dataAdapter = new diffSync.InMemoryDataAdapter();
 
  // setting up the diffsync server 
  var diffSyncServer = new diffSync.Server(dataAdapter, io);
 
  // starting the http server 
  http.listen(4000, function(){
    console.log('ready to go');
  });