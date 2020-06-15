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

router.get('/:lessonId', (req, res, next) => {
  // Todo: Code for getting all lesson pictures
});

// @router PATCH /images/:lessonId
// @desc Stores an image file in static/images
//       Adds filename to for lessons lessonImages field.
router.patch('/:lessonId', upload.single('file'), (req, res, next) => {
  // Todo: Code for adding picture to storage
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
  // Todo: Code for deleting a picture
});


module.exports = router;