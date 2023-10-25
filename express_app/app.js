const express = require('express');
const { exec } = require('child_process');
const multer = require('multer');

const app = express();
const port = 3000;

// Define a storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads'); // Define the directory where uploaded files will be stored
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname); // Keep the original filename
  },
});

const upload = multer({ storage: storage });

app.get('/showCompressedFiles', (req, res) => {
  const command = `ls ./uploads`

  // Use the exec function to run the command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return res.status(500).send('Compression failed');
    }
    
    // Compression successful
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    
    res.send(stdout);
  });
});

app.post('/upload', upload.single('file'), async (req, res) => {
  
  if (!req.file) return res.status(400).send('No file uploaded.');

  try {
    compress(`./uploads/${req.file.originalname}`)
  } catch (error) {
    res.status(error.status).send(error.send);
  }

  res.status(200).send('File uploaded successfully.');
});


function compress (fileLocation){
  const command = `bzip2 ${fileLocation}`;

  // Use the exec function to run the command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      throw {status:500, message:'Compression failed'};
    }
    
    // Compression successful
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});