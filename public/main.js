document.addEventListener('DOMContentLoaded', () => {
    (function (){
        var socket = io.connect("http://localhost:8080", {
            'forceNew': true,
            autoConnect: false
        });
        console.log(socket);
        var user = document.querySelector('#user_value');
        var form = document.querySelector('#send_message');
        var userdisco = document.querySelector('#des_user');
        var value = prompt('Ingrese su nombre', "");
        var userName = value;
        var users = [];

        if(value != null && value !== ""){
            user.textContent = value;
            socket.connect();
        }

        form.addEventListener('click', function(){
            debugger;
            var user = document.getElementById('user').value;
            var message = document.getElementById('message').value;

            let user_id = getUser(user).user_id;
            if(user_id != null){
                socket.emit('message_user', {
                    user: user_id,
                    name: userName,
                    message: message
                });
            }else{
                console.log('el usuario no se ha conectado');
            }
        });

        userdisco.addEventListener('click', function(){
            socket.disconnect();
        });

        var getUser = function(user) {
            var user_id = null;
            users.forEach(function(e, i){
                if(user == e.name){
                    user_id = e.id;
                    return;
                }
            });
            return {
                user_id: user_id
            };
        }

        //socket events

        socket.on('connect', function(socke) {
            console.log('dummy user connected');
            console.log(socket.id);
            socket.emit('user_conect', {
                id: socket.id,
                name: value
            })
        });

        //socket desconect
        socket.on('disconnect', function() {
            console.log("me he desconectado");
        });

        socket.on('new_user', function(data) {
            console.log('alguien se ha conectado');
            users.push(data);
            console.log(users);
        });

        socket.on('message_user', function(data){
            console.log(data.message + " desde: " + data.name);
        });
        
        socket.on('defaultUserConect', function(userDfa) {
            if(userDfa.userlist.length > 0){
                userDfa.userlist.forEach(function(e, i) {
                    users.push(e);
                });
            }
            console.log(userDfa.userCount);
            console.log(users);
        });

        socket.on('user_disconect', function(socketId){
            var name = "";
            users.forEach(function(e,i){
                if(socketId == e.id){
                    name = e.name;
                    users.splice(i, 1);
                    return;
                }
            });
            console.log("se ha desconectado un usuario: ", name);
            console.log(users);
        });

    })();    
});

