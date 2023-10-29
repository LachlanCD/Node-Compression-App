const express = require('express');
const app = express();
const port = 3000;

const uploadController = require('./routes/upload');

app.use(express.json());

// Use the uploadController as middleware
app.use('/', uploadController);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});