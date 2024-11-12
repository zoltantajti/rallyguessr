const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
const users = {};
const clients = {};
const matches = {};

/*custom funcs*/
const reply = (mt, message, socket) => {
    socket.send(JSON.stringify({mt: mt, msg: message}));
}
server.broadcast = function broadcast(msg){
    server.clients.forEach(function each(client) {
        console.log(client);
    });
}

server.on('connection', (socket) => {
    let userID;
    socket.on('message', (message) => {
        message = message.toString();
        console.log(message);
        const data = JSON.parse(message);
        if(data.type === "onConnect" && data.userID){ 
            users[data.userID] = data.userID; 
            clients[data.userID] = socket;
            reply('onConnect', `Szia ${data.userID}!`, socket); 
        };
        if(data.type === "onDisconnect" && data.userID){ 
            delete(users[data.userID]); 
            delete(clients[data.userID]);
            reply('onDisconnect', `Viszlát ${data.userID}!`, socket); 
        };
        if(data.type === "onSelectEnemy"){
            const enemySocket = clients[data.enemyID];
            if(enemySocket){
                enemySocket.send(JSON.stringify({ type: 'onEnemySelected', enemy: data.userID}));
                socket.send(JSON.stringify({ type: 'onEnemyFound', enemy: data.enemyID}));
            }else{
                console.log(data.enemyID + " nem található!");
            };            
        }
    });
    socket.on('close', () => {
        if(userID) delete[userID];
    });
});

console.log("started at 8080");