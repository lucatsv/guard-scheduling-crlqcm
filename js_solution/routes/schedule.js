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
  
        const guardsInPTODuringTheSchedule = guardsInPTO.filter(g => fromDate >= g.date &&
                                                                    toDate <= g.date)
        const guardPto = {}

        guardsInPTO.forEach(g => {
            guardPto[g.guardId].push() 
        })

        const contractDaysOfWeek = contract.daysOfWeek.map(d => daysOfWeekToInteger(d))


    } catch(error) {
        res.status(500).json({ "error" : error})
    }
})



module.exports = router