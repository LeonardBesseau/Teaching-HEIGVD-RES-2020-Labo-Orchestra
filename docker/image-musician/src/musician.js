/**
 * @abstract simulates someone who plays an instrument in an orchestra.
 *
 * When the app is started, it is assigned an instrument (piano, flute, etc.).
 * As long as it is running, every second it will emit a sound, the sound depends on the instrument.
 *
 * @author Besseau Léonard
 * @author Ogi Nicolas
 */

const PROTOCOL = require('./common/protocol');
const INSTRUMENT = require('./common/instrument');
const {v4: uuidv4} = require('uuid');
const dgram = require('dgram');

function sendSound(sound) {
    const output = {sound: sound, uid}
    const payload = JSON.stringify(output)
    const message = Buffer.from(payload);
    socket.send(message, 0, message.length, PROTOCOL.PROTOCOL_PORT, PROTOCOL.PROTOCOL_MULTICAST_ADDRESS, function (err, bytes) {
        console.log("Sending payload:", payload, "via port", socket.address().port);
    });
}

const uid = uuidv4();
const socket = dgram.createSocket('udp4');

if (process.argv.length < 3 || !process.argv[2]) {
    console.log("You need to define an instrument to play");
    process.exit(9);
}

const instrument = process.argv[2];
const sound = INSTRUMENT[instrument];
if (!sound) {
    console.log("Instrument ", instrument, " is not playable. Exiting")
    process.exit(9);
}
console.log("Musician", uid, "will now start playing", instrument, ".")
setInterval(sendSound, 500, sound);
