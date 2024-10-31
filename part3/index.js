const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

app.use(express.static('dist'))

const morgan = require('morgan')
const cors = require('cors')


app.use(express.json())

app.use(cors())




morgan.token('post-data', (request) => {
  if (request.method === 'POST') {
    const { ...rest } = request.body
    return JSON.stringify(rest)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))


app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    const requesttime = new Date().toString()
    response.send(`
      <div>
        <p>The phonebook has ${count} people</p>
        <p>${requesttime}</p>
      </div>
    `)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    if (!result) {
      const error = new Error('Person not found')
      error.status = 404
      throw error
    }
    response.status(204).end()
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true, context: 'query' }).then(updatedPerson => {
    if (updatedPerson) {
      response.json(updatedPerson)
    } else {
      response.status(404).send({ error: `${request.body.name} has already been removed` })
    }
  }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})