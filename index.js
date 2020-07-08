const http = require('http')
const express = require('express')
const { response } = require('express')
const morgan = require('morgan')
const morganBody = require("morgan-body")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan("combined"))
app.use(bodyParser.json())
morganBody(app)

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "lol-pallo",
      "number": "1",
      "id": 6
    },
    {
      "name": "Juha",
      "number": "123123",
      "id": 8
    }
  
]

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

app.get("/info", (req,res) => {
  const length = persons.length;
  const date = req.get('Date');
  res.send(`<p>there are ${length} persons in the phone book </p>\n<p>${date}</p>`)
})

app.get("/api/persons/:id", (req,res) => {
  const id = Number(req.params.id)
  const result = persons.find(person => person.id === id)
  if (result) {
    res.json(result)
  }
  else {
    res.status(404).end()
  }
})


const idGen = () => {
  
  while (true) {
    var random = Math.floor(Math.random() * Math.floor(1000));
    let array = persons.filter(x => x.id === random)
    if (array.length === 0) {
      break;
    }
  }
  return random
}

const check = (name, arr) => {
  const find = arr.filter(x => x.name === name)
  if (find.length === 0) {
    return false
  }
  else {
    return true
  }
}

app.post("/api/persons", (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      "error": 'content missing'
    })
  }
  if (check(body.name, persons)) {
    return res.status(400).json({
      "error": 'name must be unique'
    })
  }
  const id = idGen()
  const person = {
    "name": body.name,
    "number": body.number,
    "id": id
  }
  persons = persons.concat(person)

  res.json(person)
  morgan('tiny')
  morgan(':method :url :status :res.body - :response-time ms')
})

app.delete("/api/persons/:id", (req,res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})
