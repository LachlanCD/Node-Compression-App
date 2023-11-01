const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const uploadController = require('./routes/upload');
const downloadController = require('./routes/download');
const cacheDataController = require('./routes/cacheData');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// set routes
app.use('/upload', uploadController);
app.use('/download', downloadController);
app.use('/getCacheData', cacheDataController);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // Log the error for debugging
  console.error(err.stack);

  // return error message
  res.status(err.status || 500);
  res.send({ error: true, message: err.message || 'Internal Server Error'});
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;