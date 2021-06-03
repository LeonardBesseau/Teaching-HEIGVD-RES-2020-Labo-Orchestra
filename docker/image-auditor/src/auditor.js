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

const socket = dgram.createSocket('udp4');
const musician = new Map();
const sound = require('./instrumentBasedOnSound').sound
console.log(sound)


socket.bind(protocol.PROTOCOL_PORT, () => {
    console.log("Listening");
    socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});


socket.on('message', function (msg, source) {
    // TODO manage list
    const input = JSON.parse(msg);
    if (!input.sound || !input.uid) {
        console.log("Invalid message received");
    } else {
        const instrument = sound.get(input.sound);
        if (!instrument){
            console.log("One musician is playing an unrecognised instrument.")
        }else{
            let data = musician.get(input.uid);
            if (data){
                data.lastMessage = new Date();
            }else{
                data = {instrument: instrument, uid: input.uid, activeSince: new Date(), lastMessage:new Date()};
            }
            musician.set(input.uid, data)
            console.log("Data has arrived:", msg.toString(), ". Source port:", source.port);
        }
    }

});


setInterval(() =>{
    console.log(musician)
    const time = Date.now()
    musician.forEach((value, key, map) => {
        const delta = Math.floor((time- value.lastMessage)/1000);
        if (delta >= 5){
            map.delete(key);
        }
    });
}, 5000)

// TODO add tcp connection



