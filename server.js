const express = require('express');
const fs = require('fs');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
const json = require('./db/json');

// Setup data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

// On the back end, the application should include a db.json file that will be used to store and retrieve notes using the fs module.
// The following HTML routes should be created:
// GET /notes should return the notes.html file.
// GET * should return the index.html file.

// GET request for notes
app.get('/api/notes', (req, res) => {
    console.info(`GET /api/notes`);
    res.sendFile(path.join(__dirname, '/public/index.html'))
});


// The following API routes should be created:
// GET /api/notes should read the db.json file and return all saved notes as JSON.
// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).

app.get('/api/notes', (req, res) => {
    console.info('POST /api/notes');
    // Read the db.json file and return all saved notes as JSON.
    res.json(notes);
})

app.get('/notes', (req, res) =>
// Display notes.html when /notes is accessed
res.sendFile(path.join(__dirname, "../public/notes.html"));
)

// Setup the /api/notes post route
app.post("/api/notes:id", function(req, res) {
    const { id } = req.params;
    // Receives a new note, adds it to db.json, then returns the new note
  let newNote = req.body;
  notes.push(newNote);
  updateDb();
  return console.log("Added new note: "+newNote.title);
});


// Function to read data from a given a file and append some content
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

// Setup listener
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});  

// TODO: Bonus
// DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete. In order to delete a note,
// you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the 
// notes to the db.json file.