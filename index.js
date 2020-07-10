const http = require('http')
const express = require('express')
const { response } = require('express')
const morgan = require('morgan')
const morganBody = require("morgan-body")
const bodyParser = require("body-parser")
const cors = require("cors")
const Person = require("./mongo")
const mongoose = require('mongoose')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan("combined"))
app.use(bodyParser.json())
morganBody(app)



app.get("/api/persons", (req, res, next) => {
  Person.find({}).then((people) => {
    res.json(people)
  })
  .catch(error => next(error))
})

app.get("/info", (req, res, next) => {
  const length = persons.length;
  const date = req.get('Date');
  res.send(`<p>there are ${length} persons in the phone book </p>\n<p>${date}</p>`)
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id).then((person) => {
    if (person) {
      res.json(person)
    }
    else {
      response.status(404).end()
    }
  })
  .catch(error => {
    next(error)
  })
  
})


const check = (name, arr) => {
  const find = arr.filter(x => x.name === name)
  if (find.length === 0) {
    return false
  }
  else {
    return true
  }
}

app.post("/api/persons", (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      "error": 'content missing'
    })
  }
  Person.find({name: body.name}).then((person) => {
    if (check(body.name, person)) {
      return res.status(400).json({
      "error": 'name must be unique'
    })
    }
    else {
      const per = new Person({
        "name": body.name,
        "number": body.number
      })
      per.save().then((person) => {
        res.json(person)
      })
      .catch(error => next(error))
      
    }
  })
  .catch(error => next(error))

})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id).then(() => {
    res.status(204).end()
  })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body
  const person = {
    "name": body.name,
    "number": body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, {new: true}).then((person) => {
    res.json(person)
  })
    .catch(error => next(error))
})


const errorHandler = (error, req, res, next) => {
  console.log(error);

  if (error.name === 'CastError') {
    return res.status(400).send({error: "malformatted id"})
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message})
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})
