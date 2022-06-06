const mongoose = require('mongoose')

const PTOSchema = mongoose.Schema({
    guardId: { // it's better establish the PTO x Guard relationship through a UUID
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('PTOs', PTOSchema)
