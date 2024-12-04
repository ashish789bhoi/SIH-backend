require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT; // Fallback to 5000 if PORT is not set

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.send({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
