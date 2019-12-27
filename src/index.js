const express = require('express')
const mongoose = require('mongoose')
const process = require('process')
const cors = require('cors')

const Routes = require('./routes')

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
app.use(Routes)

mongoose.connect(
  'mongodb+srv://admin:1234567890@cluster0-xcndn.mongodb.net/BixoQuest?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
)

mongoose.connection.on('error', (e) => {
  console.error('Error connecting to MongoDB!')
  console.error(e)
})

mongoose.connection.on('open', () => {
  console.log('Connected successfuly to MongoDB!')
  app.listen(port, () => {
    console.log(`Now listening at port ${port} for requests!`)
  })
})
