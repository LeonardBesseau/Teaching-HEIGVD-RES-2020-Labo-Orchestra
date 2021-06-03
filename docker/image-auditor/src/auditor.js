/**
 * @abstract Simulates someone who listens to the orchestra.
 * This application has two responsibilities:
 * Firstly, it must listen to Musicians and keep track of **active** musicians. A musician is active if it has
 * played a sound during the last 5 seconds.
 *
 * Secondly, it must make this information available to you.
 * Concretely, this means that it should implement a very simple TCP-based protocol
 *
 * @author Besseau Léonard
 * @author Ogi Nicolas
 */

const protocol = require('./common/protocol');
const dgram = require('dgram');
const net = require('net');

const socket = dgram.createSocket('udp4');
const server = new net.Server();

const sound = require('./instrumentBasedOnSound').sound
const musician = new Map();


socket.bind(protocol.PROTOCOL_PORT, () => {
    console.log("UDP Multicast Started");
    socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});


function udpHandler(msg, source) {
    const input = JSON.parse(msg);
    if (!input.sound || !input.uid) {
        console.log("Invalid message received");
    } else {
        const instrument = sound.get(input.sound);
        if (!instrument) {
            console.log("One musician is playing an unrecognised instrument.")
        } else {
            let data = musician.get(input.uid);
            if (data) {
                data.lastMessage = new Date();
            } else {
                data = {instrument: instrument, activeSince: new Date(), lastMessage: new Date()};
            }
            musician.set(input.uid, data)
            console.log("Data has arrived:", msg.toString(), ". Source port:", source.port);
        }
    }
}

function generateList(){
    let output = [];
    musician.forEach((value, key, map) => {
        output.push({...value, uid: key})
    });
    return output;
}

// UDP Management
socket.on('message', function (msg, source) {
    udpHandler(msg, source);
});

server.listen(protocol.TCP_PORT, function() {
    console.log("Server listening for connection requests on socket localhost:", protocol.TCP_PORT);
});

// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on('connection', function(socket) {
    console.log('A new connection has been established.');

    let output = [];


    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.
    socket.write('Hello, client.');

    // The server can also receive data from the client by reading from its socket.
    socket.on('data', function(chunk) {
        console.log("Data received from client: ",chunk.toString());
    });

    socket.on('end', function() {
        console.log('Closing connection with the client');
    });

    socket.on('error', function(err) {
        console.log("TCP Server error:", err);
    });
});


setInterval(() =>{
    const time = Date.now()
    musician.forEach((value, key, map) => {
        const delta = Math.floor((time- value.lastMessage)/1000);
        if (delta >= 5){
            map.delete(key);
        }
    });
    console.log(generateList())
}, 5000)

// TODO add tcp connection



