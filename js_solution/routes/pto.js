const express = require('express')
const PTO = require('../models/PTO')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const listOfPTOs = await PTO.find()
        res.status(200).json(listOfPTOs)
    } catch(error) {
        res.status(500).json({ "error" : error})
    }
})

router.put('/', async (req, res) => {
    const pto = new PTO({
        guardId : req.body.guardId,
        date : req.body.date
    }) 

    try {
        const existingPTO = await PTO.findOne({ guardId : pto.guardId })
        existingPTO
        console.log( { existingPTO } )
        let guardPTO = {}
        if(existingPTO) {
            guardPTO = await PTO.updateOne({ guardId : pto.guardId }, { $set : { 
                guardId : pto.guardId,
                date : pto.date
            } })
        } else {
            guardPTO = await pto.save()
        }
        res.status(200).json(guardPTO)
    } catch(error) {
        res.status(500).json({ "error" : error})
    }

})


module.exports = router