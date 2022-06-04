const express = require('express')
const Contract = require('../models/Contract')
const Guard = require('../models/Guard')
const PTO = require('../models/PTO')
const router = express.Router()

router.get('/', async (req, res) => {
    try {

        const fromDate = req.body.fromDate
        const toDate = req.body.toDate
        const contractId = req.body.contractId

        const contract = await Contract.findById(contractId)

        // find guards that meet the contract requirement
        const eligibleGuards = await Guard.find({ fireArmLicense : contract.requireArmedGuard })
        const eligibleGuardsId = eligibleGuards.map(eg => eg._id)
        
        // get a list of eligibleGuards in PTO
        const guardsInPTO = await PTO.find({ guardId : eligibleGuardsId })
  
        const guardsInPTODuringTheSchedule = guardsInPTO.filter( g => 
                                                                    fromDate >= g.date &&
                                                                    toDate <= g.date
                                                                )

        const contractDaysOfWeek = contract.daysOfWeek.map(d => )


    } catch(error) {
        res.status(500).json({ "error" : error})
    }
})


const dayOfWeekToInteger = (dayOfWeek) => {
    const normalizedDayOfWeek = dayOfWeek.toUpperCase()
    if(normalizedDayOfWeek === "SUNDAY") {
        return 0
    }  
    else if(normalizedDayOfWeek === "MONDAY") {
        return 1
    }
    else if(normalizedDayOfWeek === "TUESDAY") {
        return 2
    }
    else if(normalizedDayOfWeek === "WEDNESDAY") {
        return 3
    }
    else if(normalizedDayOfWeek === "THURSDAY") {
        return 4
    }
    else if(normalizedDayOfWeek === "FRIDAY") {
        return 5
    }
    else if(normalizedDayOfWeek === "SATURDAY") {
        return 6
    }
    
}
module.exports = router