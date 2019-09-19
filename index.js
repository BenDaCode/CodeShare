var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var rooms={};


app.set('view engine', 'ejs');
app.use(express.static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/rooms/:room', function(req, res){
  var room = req.params.room; 
  res.render('room', {
    room: room
  })
});

io.sockets.on('connection', function(socket) {

  socket.on('room', function(room) {
      socket.join(room);
    
      if(typeof rooms[room] !== "undefined"){
        var content= rooms[room].content;
        io.sockets.in(room).emit('updateCode', content);
      }else{
        rooms[room]={};
      }
      socket.on('updateCode', function(code){
        rooms[room].content=code;
        io.sockets.in(room).emit('updateCode', code);
      });
  });

  io.sockets.emit('getRooms', rooms);

});

http.listen(3000, function(){
  console.log('Code Share is running on port:3000');
});