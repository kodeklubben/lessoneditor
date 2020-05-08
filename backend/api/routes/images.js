const express = require('express');
const router = express.Router();
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'static/images/')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') +
        crypto.randomBytes(16).toString('hex') + '.' + file.mimetype.split('/')[1]);
  }
});

const fileFilter = (req, file, cb) => {
  (file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ?
      cb(null, true) : cb(null, false));
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const Lesson = require('../models/lesson');


router.get('/:lessonId', (req, res, next) => {

});

// @router PATCH /images/:lessonId
// @desc Stores an image file in static/images
//       Adds filename to for lessons lessonImages field.
router.patch('/:lessonId', upload.single('file'), (req, res, next) => {
  Lesson.update({ _id: req.params.lessonId }, {$push: {lessonImages: req.file.filename}})
      .exec()
      .then( result => {
        res.status(200).json({
          message: 'Image added to lesson'
        })
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })
});

// @router DELETE /images/:lessonId
// @desc Deletes an uploaded image and removes connection to lesson.
router.delete('/:lessonId', (req, res, next) => {
  const filename = req.body.filename;
  if(fs.lstatSync(`static/images/${filename}`).isFile()){
    fs.unlink(`static/images/${filename}`, (err) => {
      if (err) throw err;
      console.log(`static/images/${filename} was deleted.`)
    })
  }
  Lesson.update({ _id: req.params.lessonId }, {$pull: {lessonImages: filename}})
      .exec()
      .then(result => {
        res.status(200).json({
          message: `Deleted picture: ${filename}`
        })
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      });
});


module.exports = router;