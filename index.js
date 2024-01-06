const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const person = require('./models/person')


const app = express()

morgan.token('body', req => JSON.stringify(req.body))

// virheidenkäsittelijä
const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if(error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}



//--------------------------middlewares--------------------------------
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
//---------------------------------------------------------------------

/*
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "0404-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendick",
        "number": "39-23-6423122"
    }
]

const idGenerator = ()=>{
    const id = Math.random() * 10000
    return id
}
*/

app.get('/info', (req,res, next) => {
  const date = new Date()
  Person.find({})
    .then(n => {
      res.send(`<p>Phonebook has info for ${n.length} people <br> ${date}</p> `)
    })
    .catch(error => next(error) )
})

app.get('/api/persons', (req,res) => {
  Person.find({}).then(n => {
    res.json(n)
  })
})

app.post('/api/persons', (req, res, next) => {
  const newPerson = req.body

  /*if(!newPerson.name || !newPerson.number) {
        return res.status(400).json({
            error: 'Some Data missing'
        })
    } */
  const person = new Person({
    name: newPerson.name,
    number: newPerson.number,
  })
  person.save()
    .then(saved => {
      res.json(saved)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updated => {
      response.json(updated)
    })
    .catch(error => next(error))
})





app.get('/api/persons/:id', (req,res, next) => {
  Person.findById(req.params.id).then(n => {
    if(n) {
      res.json(n)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (req,res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))


  res.status(204).end()
})

app.use(errorHandler)







const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})