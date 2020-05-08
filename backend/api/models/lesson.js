const mongoose = require('mongoose');

const lessonSchema = {
  _id: mongoose.Schema.Types.ObjectId,
  level: {type: Number, required: true},
  license: {type: String, required: true},
  tags: {
    topics: {type: Array},
    subjects: {type: Array},
    grades: {type: Array}
    },
  title: {type: String, required: true},
  author: {type: String, required: true},
  translator: {type: String},
  language: {type: String, required: true},
  lessonImages: {type: Array},
  markdown: {type: String}
};

module.exports = mongoose.model('Lesson', lessonSchema);