
// backend/models/Flashcard.js
const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  title: String,
  description: String,
  todos: [
    {
      term: String,
      definition: String,
    },
  ],
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
