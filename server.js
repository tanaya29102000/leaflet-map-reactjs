const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());

// Proxy request to Nominatim API
app.get('/api/geocode', async (req, res) => {
  const location = req.query.location;
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coordinates.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
