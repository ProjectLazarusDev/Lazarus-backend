const mongoose = require('mongoose')

const metaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Meta', metaSchema);