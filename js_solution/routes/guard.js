const express = require('express')
const Guard = require('../models/Guard')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const listOfGuards = await Guard.find()
        res.status(200).json(listOfGuards)
    } catch(error) {
        res.status(500).json({ "error" : error})
    }
})

router.post('/', async (req, res) => {

    const guard = new Guard({
        name : req.body.name,
        fireArmLicense : req.body.fireArmLicense
    }) 

    try {
        const savedGuard = await guard.save()
        res.status(200).json(savedGuard)
    } catch(error) {
        res.status(500).json({ "error" : error})
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const removedGuard = await Guard.remove({_id : req.params.id})
        res.status(200).json(removedGuard)
    } catch(error) {
        res.status(500).json({ "error" : error})
    }
})

router.get('/:id', async (req, res) => {
    try {
        const guard = await Guard.findById(req.params.id)
        res.status(200).json(guard)
    } catch(error) {
        res.status(500).json({ "error" : error})
    }
})


module.exports = router