const express = require('express')
const Guard = require('../models/Guard')
const router = express.Router()
const logger = require('../util/logger')
const crypto = require('crypto');

router.get('/', async (req, res) => {
    try {
        const listOfGuards = await Guard.find()
        res.status(200).json(listOfGuards)
    } catch(error) {
        logger.error(error.message)
        res.status(500).json({ "error" : 'Internal error'})
    }
})

router.post('/', async (req, res) => {

    const guard = new Guard({
        _id: crypto.randomUUID(),
        name : req.body.name,
        fireArmLicense : req.body.fireArmLicense
    }) 

    try {
        const savedGuard = await guard.save()
        res.status(201).json(savedGuard)
    } catch(error) {
        logger.error(error.message)
        res.status(500).json({ "error" : 'Internal error'})
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const removedGuard = await Guard.remove({_id : req.params.id})
        res.status(200).json(removedGuard)
    } catch(error) {
        logger.error(error.message)
        res.status(500).json({ "error" : 'Internal error'})
    }
})

router.get('/:id', async (req, res) => {
    try {
        const guard = await Guard.findById(req.params.id)
        res.status(200).json(guard)
    } catch(error) {
        logger.error(error.message)
        res.status(500).json({ "error" : 'Internal error'})
    }
})

module.exports = router