const express = require('express')
const Contract = require('../models/Contract')
const router = express.Router()
const logger = require('../util/logger')

router.get('/', async (req, res) => {
    try {
        const listOfContracts = await Contract.find()
        res.status(200).json(listOfContracts)
    } catch(error) {
        logger.error(error)
        res.status(500).json({ "error" : 'Internal error'})
    }
})

router.post('/', async (req, res) => {

    const contract = new Contract({
        name : req.body.name,
        daysOfWeek : req.body.daysOfWeek,
        requireArmedGuard : req.body.requireArmedGuard
    }) 

    try {
        const savedContract = await contract.save()
        res.status(200).json(savedContract)
    } catch(error) {
        logger.error(error)
        res.status(500).json({ "error" : 'Internal error'})
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const removedContract = await Contract.remove({_id : req.params.id})
        res.status(200).json(removedContract)
    } catch(error) {
        logger.error(error)
        res.status(500).json({ "error" : 'Internal error'})
    }
})

router.get('/:id', async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id)
        res.status(200).json(contract)
    } catch(error) {
        logger.error(error)
        res.status(500).json({ "error" : 'Internal error'})
    }
})


module.exports = router