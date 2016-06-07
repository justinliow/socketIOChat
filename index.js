var app=require('express')();
var http=require('http').Server(app);
var io=require('socket.io')(http);
var httpp=require("http");
app.get('/', function(req, res){
	res.sendFile(__dirname +'/index.html');
});
//var clients=[];
io.on('connection', function(socket){
	console.log('a user connected on'+socket.id);
	//clients.push(socket.id);
	//console.log(clients);
	socket.on('disconnect', function(){
		console.log('a user disconnected');

	});
});
var result='boop';
io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		var temp=msg;
		io.sockets.connected[socket.id].emit('chat message', msg);
		var options = {
			"method": "GET",
			"hostname": "localhost",
			"port": "8080",
			"path": "/greeting?name="+temp
		};
		//console.log(options);
		var reques=httpp.request(options, function(rest){
			//console.log("inside");
			var chunks=[];
			rest.on("data", function(chunk){
				chunks.push(chunk);
			});
			rest.on("end", function(){
				var body=Buffer.concat(chunks);
				var obj=JSON.parse(body);
				//console.log(obj.content);
				io.sockets.connected[socket.id].emit('chat message', obj.content);
		});	

	});
	reques.end();


});
});
http.listen(3000, function(){
	console.log('listening on *:3000');
});

