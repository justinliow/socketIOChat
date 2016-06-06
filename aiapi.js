var app=require('express')();
var http=require('http').Server(app);
var io=require('socket.io')(http);
var httpp=require("https");
app.get('/', function(req, res){
	res.sendFile(__dirname +'/index.html');
});
//var clients=[];
io.on('connection', function(socket){
	console.log('a user connected on port '+socket.id);
	//clients.push(socket.id);
	//console.log(clients);
});
io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		var temp=msg;
		io.sockets.connected[socket.id].emit('chat message', msg);
		var options = {
			"method": "GET",
			"hostname": "api.api.ai",
			"path": "/v1/query?lang=EN&query="+encodeURI(temp),
			"headers":{
				"authorization": "Bearer c22c6346a7f74815b8602506e9fd1933"

			}
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
				io.sockets.connected[socket.id].emit('chat message', obj.result.speech);
		});	

	});
	reques.end();


});
});
http.listen(3000, function(){
	console.log('listening on *:3000');
});

