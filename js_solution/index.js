const express = require('express')

const mongoose = require('mongoose')

const bodyParser = require('body-parser')

require('dotenv/config')

const app = express()

app.use(bodyParser.json())

app.get('/', async (req, res) => {
    try {
        const connection = await mongoose.connect(process.env.DB_CONNECTION_STRING)
        res.status(200).json({ message : "it works!" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
})


app.listen(3000)