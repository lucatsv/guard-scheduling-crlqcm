const mongoose = require('mongoose')

const GuardSchema = mongoose.Schema({
    _id : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required: true
    },
    fireArmLicense : {
        type : Boolean,
        default : false
    }
})

module.exports = mongoose.model('Guards', GuardSchema)