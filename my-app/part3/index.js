const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())

let notes = [  {    
    id: 1,    
    content: "HTML is easy",    
    date: "2019-05-30T17:30:31.098Z",    
    important: true  
    },  
    {    
        id: 2,    
        content: "Browser can execute only Javascript",    
        date: "2019-05-30T18:39:34.091Z",    
        important: false  
    },  
    {    
        id: 3,    
        content: "GET and POST are the most important methods of HTTP protocol",    
        date: "2019-05-30T19:20:14.298Z",    
        important: true  }]

app.get('/', (req, res) =>{
    res.send('<h1>Hi Hello wooöööörld!!!!!!!!</h1>')
})

app.get('/notes', (req,res)=>{
    res.json(notes)
})

app.get('/notes/:id', (req, res) =>{
    
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)

    if (note){
        res.json(note)
    }
    else{
        res.status(404).end()
    }
})

app.delete('/notes/:id', (req, res) =>{
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})

const generateId = () =>{
    const maxID = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
    
    return maxID + 1
}

app.post('/notes', (req, res) =>{

    const body = req.body

    if (!body.content){
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note ={
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    notes = notes.concat(note)

    res.json(note)
})

const port = process.env.PORT || 3003
app.listen(port)
console.log(`Server is running on port ${port}`)