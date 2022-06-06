const express = require('express')
const Contract = require('../models/Contract')
const Guard = require('../models/Guard')
const PTO = require('../models/PTO')
const { getScheduleOptions, getScheduleOptionsPerContract, createSchedule, createScheduleForAllContracts } = require('../core/schedulling')

const router = express.Router()

router.get('/:contractId', async (req, res) => {
    try {
        const {fromDate, toDate} = req.query

        const contractId = req.params.contractId

        const contractPromise = Contract.findById(contractId)
        const guardsPromise = Guard.find()
        const ptosPromise = PTO.find()
        const [contract, guards, ptos] = await Promise.all([contractPromise, guardsPromise, ptosPromise])

        const options = getScheduleOptions(contract, guards, ptos, new Date(fromDate.split('-')[0],fromDate.split('-')[1] - 1,fromDate.split('-')[2]), new Date(toDate.split('-')[0],toDate.split('-')[1] - 1,toDate.split('-')[2]))

        const schedule = createSchedule(options)

        res.status(200).json({ schedule })
    } catch(error) {
        res.status(500).json({ error })
    }
})


router.get('/', async (req, res) => {
    try {
        const {fromDate, toDate} = req.query
        const contractsPromise = Contract.find()
        const guardsPromise = Guard.find()
        const ptosPromise = PTO.find()
        const [contracts, guards, ptos] = await Promise.all([contractsPromise, guardsPromise, ptosPromise])

        const contractsScheduleOptions = getScheduleOptionsPerContract(contracts, guards, ptos, fromDate, toDate)

        console.log( { contractsScheduleOptions })

        const schedule = createScheduleForAllContracts(contractsScheduleOptions)

        console.log( { schedule })

        res.status(200).json(schedule)

    } catch(error) {
        res.status(500).json(error)
    }
})


module.exports = router