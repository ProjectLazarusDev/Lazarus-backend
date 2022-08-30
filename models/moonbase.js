const mongoose = require('mongoose')

const metaSchema = new mongoose.Schema({
    metamaskId: {
        type: String,
        required: true
    },
    data: {
        type: JSON,
        required: false
    }
})

module.exports = mongoose.model('MoonBase', metaSchema);