const mongoose = require('mongoose')

mongoose.connect(
  'mongodb+srv://admin:1234567890@cluster0-xcndn.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
)

mongoose.connection.on('error', (e) => {
  console.error('Error connecting to the server!')
  console.error(e)
})

mongoose.connection.on('open', () => {
  console.log('Connected successfuly to the server!')
})
