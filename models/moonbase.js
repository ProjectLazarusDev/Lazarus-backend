const mongoose = require('mongoose')

const metaSchema = new mongoose.Schema({
    metamaskAddress: {
        type: String,
        required: true
    },
    data: {
        type: JSON,
        required: false
    },
    nonce: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('MoonBase', metaSchema);