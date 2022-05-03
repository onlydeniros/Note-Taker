const express = require('express');
const path = require('path');
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = require('./db/db.json')

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    res.json(notes)
});

app.post('/api/notes', (req, res) => {
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    let newNote = req.body
    newNote.id = uuidv4();
    let noteArray = [...notes, newNote]
    fs.writeFileSync('./db/db.json', JSON.stringify(noteArray))
    res.json(noteArray);
});

app.delete('/api/notes/:id', (req, res) => {
    let deleteNote = req.params.id
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    let updatedNotes = notes.filter((note) => note.id !== deleteNote)
    fs.writeFileSync('./db/db.json', JSON.stringify(updatedNotes))
    res.json(updatedNotes);
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, ''))
})


app.listen(PORT, () => {
    console.log(`Server is now on port: ${PORT}`)
})