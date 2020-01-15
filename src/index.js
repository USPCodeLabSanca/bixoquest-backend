const express = require('express')
const mongoose = require('mongoose')
const process = require('process')
const cors = require('cors')

const Routes = require('./routes')

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())
app.use(cors({
  exposedHeaders: ['authorization'],
  origin: '*'
}))
app.use(Routes)

app.get('/', (req, res) => {
  return res.send('Bem-Vind@ a API do BixoQuest')
})

// Local Url
// const backendUrl = "mongodb://localhost:27017/BixoQuest";

// Docker Url
// const backendUrl = "mongodb://mongo:27017/BixoQuest";

// MongoAtlas Url
const backendUrl = "mongodb+srv://admin:1234567890@cluster0-xcndn.mongodb.net/BixoQuest?retryWrites=true&w=majority";

mongoose.connect(
  backendUrl,
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
