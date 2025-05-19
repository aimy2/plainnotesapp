require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Note Schema
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  created: { 
    type: Date, 
    default: Date.now 
  }
}, {
  collection: 'notes' // Explicit collection name
});

const Note = mongoose.model('Note', noteSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ created: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notes', async (req, res) => {
  console.log('Received new note:', req.body);
  try {
    const newNote = new Note({
      title: req.body.title,
      content: req.body.content
    });
    await newNote.save();
    console.log('Note saved:', newNote);
    res.json(newNote);
  } catch (err) {
    console.error('Error saving note:', err);
    res.status(400).json({ error: err.message });
  }
});


app.delete('/api/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));