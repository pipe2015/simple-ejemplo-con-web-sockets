var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.status(200).send("hola mundo");
});
var userCount = 0;
var users = [];
io.on('connection', function(socket) {
    console.log('alguien se ha conectado');

    //cuando un usuario se conecta le notifico a los demas
    //que estoy conectado
    socket.on('user_conect', function(user) {
        var listUser = [];
        if(userCount > 0){
            //agrego al cliente los otros usuarios
            listUser = users.map(function(e, i){
                if(e.id != user.id){
                    return e;
                }
            });
            socket.broadcast.emit('new_user', user);
            socket.emit('defaultUserConect', {
                userlist: listUser,
                userCount: userCount + 1
            });
        }

        if(!users.length){
            socket.emit('defaultUserConect', {
                userlist: [],
                userCount: userCount + 1
            });
        }
        
        users.push(user);
        userCount++;
    });

    socket.on('disconnect', function(){
        userCount--;
        users.forEach(function(e,i){
            if(e.id == socket.id){
                delete users[i];
                users.splice(i, 1);
                return;
            }
        });
        socket.broadcast.emit('user_disconect', socket.id);
        console.log('usuario desconectado', socket.id);
    });

    socket.on('message_user', function(data){
        console.log(data);
        io.sockets.connected[data.user].emit('message_user', {
            message: data.message,
            name: data.name
        });
        //io.to(data.user.user_id).emit('message_user', {message: data.message});
        //socket.broadcast.to(data.user.user_id).emit('message_user', {message: data.message});
    }); 

    socket.on('message_all', function(data) {

    });
})

server.listen(8080, function(){
    console.log("Servidor corriendo en http://localhost:8080");
});