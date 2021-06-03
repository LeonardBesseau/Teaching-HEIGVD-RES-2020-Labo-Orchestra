const INSTRUMENT = require('./common/instrument')
const sound = new Map();


for (const soundElement of Object.keys(INSTRUMENT)) {
    sound.set(INSTRUMENT[soundElement], soundElement)
}

exports.sound = sound