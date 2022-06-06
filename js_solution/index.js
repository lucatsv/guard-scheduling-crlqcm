const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const guardRoute = require('./routes/guard' )
const contractRoute = require('./routes/contract' )
const ptoRoute = require('./routes/pto' )
const scheduleRoute = require('./routes/schedule' )
const logger = require('./util/logger')
require('dotenv/config')

const app = express()

app.use(bodyParser.json())

// routes configuration
app.use('/guard', guardRoute)
app.use('/contract', contractRoute)
app.use('/pto', ptoRoute)
app.use('/schedule', scheduleRoute)

app.get('/health', async (req, res) => {
    try {
        await connectToDB()
        res.status(200).json({ message : "it works!" })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error : "Could not connect to the DB!" })
    }
})

mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
    logger.info("All good! Connected to DB successfuly")
}).catch((error) => {
    logger.error(`Error! ${ error }`)
})

app.listen(3000)