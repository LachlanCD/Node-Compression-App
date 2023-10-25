const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.get('/compress', (req, res) => {
  // Define the command to run, e.g., compressing a file using bzip2
  const command = 'bzip2 ./public/test.txt';

  // Use the exec function to run the command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return res.status(500).send('Compression failed');
    }
    
    // Compression successful
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    
    res.send('Compression successful');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});