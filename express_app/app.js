const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const uploadController = require('./routes/upload');
const downloadController = require('./routes/download');
const cacheDataController = require('./routes/cacheData')

app.use(express.json());

// Use the uploadController as middleware
app.use('/upload', uploadController);
app.use('/download', downloadController);
app.use('/getCacheData', cacheDataController);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});