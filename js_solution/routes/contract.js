const express = require('express')

const router = express.Router()

const crypto = require('crypto')

const Contract = require('../models/Contract')
const logger = require('../util/logger')

router.get('/', async (req, res) => {
    try {
        const listOfContracts = await Contract.find()
        res.status(200).json(listOfContracts)
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal error' })
    }
})

router.post('/', async (req, res) => {
    const contract = new Contract({
        _id: crypto.randomUUID(),
        name: req.body.name,
        daysOfWeek: req.body.daysOfWeek,
        requireArmedGuard: req.body.requireArmedGuard,
    })

    try {
        const savedContract = await contract.save()
        res.status(201).json(savedContract)
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ error: 'Internal error' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const removedContract = await Contract.deleteOne({ _id: req.params.id })
        res.status(200).json(removedContract)
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal error' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id)
        res.status(200).json(contract)
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal error' })
    }
})

module.exports = router
