const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI


mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error.message )
  })


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function(v)  {
        return v.includes('-') && v.indexOf('-') === 2 || v.indexOf('-') === 3
      },
      message: 'Invalid format'
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

//------------------------------------------------------------------



