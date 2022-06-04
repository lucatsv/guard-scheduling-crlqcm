const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const guardRoute = require('./routes/guard' )
const contractRoute = require('./routes/contract' )
const ptoRoute = require('./routes/pto' )

require('dotenv/config')

const app = express()

app.use(bodyParser.json())

// routes configuration
app.use('/guard', guardRoute)
app.use('/contract', contractRoute)
app.use('/pto', ptoRoute)

app.get('/health', async (req, res) => {
    try {
        await connectToDB()
        res.status(200).json({ message : "it works!" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
})

const connectToDB = async () => {
    return await mongoose.connect(process.env.DB_CONNECTION_STRING)
}

connectToDB().then(() => {
    console.log("All good! Connected to DB successfuly")
}).catch((error) => {
    console.error(`Error! ${ error }`)
})

app.listen(3000)