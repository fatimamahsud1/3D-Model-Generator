const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

let cachedData = null; // Variable to store cached data

app.use(bodyParser.json());

app.post('/receive-description', (req, res) => {
  const { imageDescription } = req.body;
  console.log('Received image description:', imageDescription);

  
  const newData = { exampleData: 'some data' };

  
  cachedData = newData;

  res.send('Image description received successfully');
});

app.get('/get-cached-data', (req, res) => {
  // Respond with the cached data (if available)
  if (cachedData) {
    res.json(cachedData);
  } else {
    res.status(404).send('Cached data not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
