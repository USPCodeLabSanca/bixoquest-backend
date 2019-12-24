const express = require('express')
const mongoose = require('mongoose')
const process = require('process')

const app = express()
const port = process.env.PORT || 3000

mongoose.connect(
  'mongodb+srv://admin:1234567890@cluster0-xcndn.mongodb.net/test?retryWrites=true&w=majority',
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
