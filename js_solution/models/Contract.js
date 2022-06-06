const mongoose = require('mongoose')

const ContractSchema = mongoose.Schema({
    _id : {
        type : String,
        required : false
    },
    name : {
        type : String,
        required: true
    },
    daysOfWeek : {
        type: Array,
        of: String,
        required: true
    },
    requireArmedGuard : {
        type : Boolean,
        default : false
    }
})

module.exports = mongoose.model('Contracts', ContractSchema)