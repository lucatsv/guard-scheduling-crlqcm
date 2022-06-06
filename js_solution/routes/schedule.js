const express = require('express')
const Contract = require('../models/Contract')
const Guard = require('../models/Guard')
const PTO = require('../models/PTO')
const {
    getScheduleOptionsPerContract,
    createScheduleForAllContracts,
} = require('../core/schedulling')
const logger = require('../util/logger')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const { fromDate, toDate } = req.query
        if (fromDate === null || toDate === null) {
            res.status(400).json({ error: 'fromDate and toDate are required parameters' })
            return
        }
        const contractsPromise = Contract.find()
        const guardsPromise = Guard.find()
        const ptosPromise = PTO.find()
        const [contracts, guards, ptos] = await Promise.all([contractsPromise,
            guardsPromise,
            ptosPromise])

        const contractsScheduleOptions = getScheduleOptionsPerContract(
            contracts,
            guards,
            ptos,
            fromDate,
            toDate,
        )

        const schedule = createScheduleForAllContracts(contracts, contractsScheduleOptions)

        res.status(200).json(schedule)
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ error: 'Internal error' })
    }
})

module.exports = router
