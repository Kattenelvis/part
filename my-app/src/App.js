import React, { useState, useEffect } from 'react'
import Note from './Note.js'
import axios from 'axios'
import './index.css'
import noteService from './services/notes'
import error from './services/error'

//npx json-server --port 3001 --watch db.json
//npm start

const Footer = error.Footer
const Notification = error.Notification

const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('Some error happened...') 

  useEffect(() =>{
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  //useEffect()

  const notesToShow = showAll ? notes : notes.filter(note => note.important)  

  const toggleImportanceOf = id =>{
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}

    noteService
      .update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
        )
        setTimeout(() =>{
          setErrorMessage(null)
        }, 5000)
            
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  const deleteNote = id =>{
    noteService.deleteNote(id)        
    .then(response=>{ axios.delete(`${noteService.baseUrl}/${id}`)
    console.log("Target eliminated")
    setNotes(notes.filter(note => note.id === id ? false : true))})
  }

  const rows = () => notesToShow.map(note =>
      <Note
      key={note.id}
      note={note}
      toggleImportance={() => toggleImportanceOf(note.id)}
      deleteNote={() => deleteNote(note.id)}
      />
  )

  const handleNoteChange = (event) => {
      setNewNote(event.target.value)
  }

  const highestID = () =>{
    let currentHighestID = 0;
    notes.forEach(note => {
      if (note.id > currentHighestID) currentHighestID = note.id
    })
    return currentHighestID
  }
  let newID = highestID() + 1

  const addNote = (event) => {
      event.preventDefault()
      
      const noteObject = {
          id: highestID() + 1,
          content: newNote,
          date: new Date().toISOString(),
          important: Math.random() > 0.5,
      }

      noteService
      .create(noteObject)
      .then(returnedNote =>{
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  return (
    <div>
        <main>
        <div className="contentWrap">
          <h1>Notes</h1>

          <Notification message={errorMessage}/>

          <ul>
            {rows()}
          </ul>
          <form onSubmit={addNote} className="addNoteForm">
            <h1>Add Note</h1>
            <input
              value={newNote} 
              onChange={handleNoteChange}
            />
            <button type="submit" className="btn">save</button>

          </form>
        <button onClick={() => setShowAll(!showAll)} className="btn">
          show {showAll ? 'important' : 'all'}
        </button>
                
        </div>
      </main>
      <Footer />
    </div>

  )
}

export default App 