const express = require('express');
const app = express();
const port = 3000;

const uploadController = require('./routes/upload');
const downloadController = require('./routes/download');

app.use(express.json());

// Use the uploadController as middleware
app.use('/upload', uploadController);
app.use('/download', downloadController);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});