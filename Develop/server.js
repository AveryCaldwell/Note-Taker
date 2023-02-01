const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
// Helper method for generating unique ids
const uuid = require('uuid');
// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Setup data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// a db.json file will be used to store and retrieve notes using the fs module.
app.get('/api/notes', (req, res) => {
    console.info('GET /api/notes');
    let notes = JSON.parse(fs.readFileSync('./db/db.json'));
    res.json(notes);
});

// Display notes.html when /notes is accessed
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

// Setup the /api/notes post route
app.post('/api/notes', function (req, res) {
    console.info('POST /api/notes');
    // Receives a new note, adds it to db.json, then returns the new note
    let body = req.body;
    body.id = uuid.v4();
    readAndAppend(body, './db/db.json');
    res.send('Successfully Wrote Item ' + body.id);
});

// DELETE /api/notes/:id receives a query parameter containing the id of a note to delete, reads all notes from the db.json file, removes the note with the given id property, and then rewrites the notes to the db.json file.
app.delete('/api/notes/:id', function (req, res) {
    console.info('DELETE /api/notes');
    const id = req.params.id;
    readAndDeleteById(id, './db/db.json');
    res.send('Successfully Deleted ' + id);
});
// Function to read data from a given a file and append some content
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            let output = JSON.stringify(parsedData);
            fs.writeFile(file, output, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    });
};

const readAndDeleteById = (id, file) => {
    let success;
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let index;
            const parsedData = JSON.parse(data);
            for (let i = 0; i < parsedData.length; i++) {
                if (parsedData[i].id === id) {
                    index = i;
                    break;
                }
            }
            parsedData.splice(index, 1); // 2nd parameter means remove one item only
            let output = JSON.stringify(parsedData);
            fs.writeFile(file, output, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    });
    return success;
};

// Setup listener
app.listen(process.env.PORT, function () {
    console.log('App listening on PORT: ' + PORT);
});
