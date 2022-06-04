const mongoose = require('mongoose')

const ContractSchema = mongoose.Schema({
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