const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/run-python', (req, res) => {
  const { code } = req.body;

  const pythonProcess = spawn('python', ['-c', code]);

  let output = '';
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    output += `Error: ${data.toString()}`;
  });

  pythonProcess.on('close', () => {
    res.json({ output });
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
