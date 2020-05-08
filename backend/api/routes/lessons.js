const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const write = require('../../utils/writeToFile');
const gitPush = require('../../utils/handleGit');


const Lesson = require('../models/lesson');

// @route GET /
// @desc Get all saved lessons in JSON format
router.get('/', (req, res, next) => {
  Lesson.find()
      .select('level license tags title author translator language markdown')
      .exec()
      .then(lessons => {
        res.status(200).json({
          count: lessons.length,
          lessons: lessons.map(lesson => {
            return {
              lesson: docFromDbToClient(lesson)
            }
          })
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      });
});

// @route POST /submit
// @desc Submit a lesson to Github
router.post('/submit', (req, res, next) => {
  write(req.body);
  gitPush(req.body.yaml.title);
  res.status(200).json({
    message: 'Handling POST request to /lessons/submit'
  });
});

// @route POST /save
// @desc Initial storage of a new lesson to DB
router.post('/save', (req, res, next) => {
  const lesson = new Lesson({
    _id: mongoose.Types.ObjectId(),
    level: req.body.yml.level,
    license: req.body.yml.license,
    tags: req.body.yml.tags,
    title: req.body.yaml.title,
    author: req.body.yaml.author,
    translator: req.body.yaml.translator,
    language: req.body.yaml.language,
    markdown: req.body.markdown
  });
  lesson.save().then(result => {
    res.status(201).json({
      message: 'Saved lesson successfully',
      savedLesson: docFromDbToClient(result)
    })
  }).catch(err => {
    res.status(500).json({
      error: err
    });
  })
});

// @route Patch /save/:lessonId
// @desc Store changes to a lesson with _id=lessonId
router.patch('/save/:lessonId', (req, res, next) => {
  const id = req.params.lessonId;
  const updateOps = docFromClientToDb(req.body);
  Lesson.update( { _id: id }, { $set: updateOps})
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'Lesson updated'
        });
      })
      .catch( err => {
        res.status(500).json({
          error: err
        })
      });
});

// @route GET /load/:lessonId
// @desc Load a lesson with _id=lessonId from DB
router.get('/load/:lessonId', (req, res, next) => {
  Lesson.findById(req.params.lessonId)
      .exec()
      .then(lesson => {
        if (!lesson) {
          return res.status(404).json({
            message: 'Lesson not found'
          })
        }
        res.status(200).json({
          lesson: lesson
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
});

// @route DELETE /:lessonId
// @desc Delete a lesson with _id=lessonId from the DB
router.delete('/:lessonId', (req, res, next) => {
  Lesson.remove({_id: req.params.lessonId})
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'Lesson deleted'
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })
});

// @route GET /edit/lessonName
// @desc Get a lesson from DB with title=lessonName and language=req.query.language
router.get('/edit/:lessonName', (req, res, next) => {
  Lesson.find( {title: req.params.lessonName, language: req.query.language})
      .select('_id level license tags title author translator language markdown')
      .exec()
      .then(result => {
        console.log(result);
          if (result.length === 0) {
            res.status(404).json({
              message: 'Lesson Not Found'
            })
          } else if (result.length > 1) {
            res.status(500).json({
              message: 'Internal Server Error'
            })
          } else {
              res.status(200).json({
                lesson: docFromDbToClient(result[0])
              })
            }
          })
      .catch( err => {
        res.status(500).json({
          error: err
        })
      });
});

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