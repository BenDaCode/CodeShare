var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var content="";
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  
  io.emit('codecontent', content);

  socket.on('codecontent', function(code){
      content=code;
      io.emit('codecontent', code);
      console.log(content);
  });
});

http.listen(3000, function(){
  console.log('Code Share is running on port:3000');
});