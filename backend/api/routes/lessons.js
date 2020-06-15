const express = require('express');
const router = express.Router();


// @route GET /
// @desc Get all saved lessons in JSON format
router.get('/', (req, res, next) => {
  // Todo: Code for fetching all saved lessons (For development)
  res.status(200).json({
    message: 'Handling GET Request to /'
  });
});


// @route POST /submit
// @desc Submit a lesson to Github
router.post('/submit', (req, res, next) => {
  // Todo: Code for Lesson submit
  res.status(200).json({
    message: 'Handling POST request to /lessons/submit'
  });
});


// @route POST /save
// @desc Initial storage of a new lesson to DB
router.post('/save', (req, res, next) => { // Rename Path to something more appropriate
    // Todo: Code for temporary storing lessons
    res.status(200).json({
      message: 'Handling Storage of lessons'
    });
});


// @route Patch /save/:lessonId
// @desc Store changes to a lesson with _id=lessonId
router.patch('/save/:lessonId', (req, res, next) => {
  // Todo: Code for updating a temporary stored lesson
  res.status(200).json({
    error: 'Handling Lesson storage update'
  })
});


// @route GET /load/:lessonId
// @desc Load a lesson with _id=lessonId from DB
router.get('/load/:lessonId', (req, res, next) => {
  // Todo: Code for retrieving a specific lesson
  res.status(200).json({
    error: 'Handling fetch of specific lesson'
  });
});


// @route DELETE /:lessonId
// @desc Delete a lesson with _id=lessonId from the DB
router.delete('/:lessonId', (req, res, next) => {
  // Todo: code for deleting a specific lesson
  res.status(200).json({
    error: 'Handling deletion of specific lesson'
  })
});


// Not sure if we still need this request??
// @route GET /edit/lessonName
// @desc Get a lesson from DB with title=lessonName and language=req.query.language
router.get('/edit/:lessonName', (req, res, next) => {
  res.status(200).json({
    message: 'Handling lesson fetch based on title and language'
  })
});


// Might not be needed if frontend sends data in proper format!
// @desc Translate doc from DB to JSON.
const docFromDbToClient = (doc) => {
  return {
    yml: {
      level: doc.level,
      license: doc.license,
      tags: doc.tags
    },
    yaml: {
      title: doc.title,
      author: doc.author,
      translator: doc.translator,
      language: doc.language
    },
    lessonImages: doc.lessonImages,
    markdown: doc.markdown,
    _id: doc._id
  }
};


// Might not be needed if frontend sends data in proper format!
// @desc Find fields that should be updated in DB
// Todo: Find a better way to generate this.
const docFromClientToDb = (doc) => {
  const updateOps = {};
  if (doc.yml) {
    for (const ops in doc.yml) {
      updateOps[ops] = doc.yml[ops];
    }
  }
  if (doc.yaml) {
    for (const ops in doc.yaml) {
      updateOps[ops] = doc.yaml[ops];
    }
  }
  if (doc.markdown) {
    updateOps['markdown'] = doc.markdown;
  }
  return updateOps;
};

module.exports = router;