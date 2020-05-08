const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const lessonRoutes = require('./api/routes/lessons');
const imageRoutes = require('./api/routes/images');

const mongoDB = `mongodb+srv://admin:${process.env.MONGO_ATLAS_PW}@node-rest-shop-qt3hc.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/static/images', express.static('static/images'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Allow headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/lessons', lessonRoutes);
app.use('/images', imageRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;