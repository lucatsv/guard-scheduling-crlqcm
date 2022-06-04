const mongoose = require('mongoose')

const ScheduleSchema = mongoose.Schema({
    contractId : {        
        type : String,
        required: true
    },
    guardId : {
        type : String,
        required: true
    },
    date : {
        type : Date,
        required: true
    }
})

module.exports = mongoose.model('Schedules', ScheduleSchema)