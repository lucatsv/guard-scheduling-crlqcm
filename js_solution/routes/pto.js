const express = require('express')
const PTO = require('../models/PTO')
const logger = require('../util/logger')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const listOfPTOs = await PTO.find()
        res.status(200).json(listOfPTOs)
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ error: 'Internal error' })
    }
})

router.put('/', async (req, res) => {
    const pto = new PTO({
        guardId: req.body.guardId,
        date: req.body.date,
    })

    try {
        const existingPTO = await PTO.findOne({ guardId: pto.guardId, date: pto.date })
        let guardPTO = existingPTO
        if (!existingPTO) {
            guardPTO = await pto.save()
            res.status(201).json(guardPTO)
        } else {
            res.status(204).json(guardPTO)
        }
    } catch (error) {
        const errorID = crypto.randomUUID9()
        logger.error(`${errorID} - ${error.message}`)
        res.status(500).json({ error: `Internal error ${errorID}` })
    }
})

module.exports = router
