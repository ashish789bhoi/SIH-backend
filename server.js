require('dotenv').config();
const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT; // Fallback to 5000 if PORT is not set

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  const query = 'SELECT full_name FROM people WHERE person_id = "P1"'; // Fetch the name of the person with person_id P1
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching name:', err);
      res.status(500).send({ error: 'Database query failed' });
    } else if (results.length === 0) {
      res.status(404).send({ message: 'No records found for person_id P1 in the database' });
    } else {
      const name = results[0].full_name; // Access the full_name field from the result
      res.send({ message: `Hello from ${name}!` });
    }
  });
});


app.get('/test', (req, res) => {
  const query = 'SELECT * FROM people'; // Fetch all records from the people table
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching people:', err);
      res.status(500).send({ error: 'Database query failed' });
    } else if (results.length === 0) {
      res.status(404).send({ message: 'No records found in the people table' });
    } else {
      const peopleNames = results.map((person) => person.full_name); // Extract the full_name field from each result
      res.send({ people: peopleNames });
    }
  });
});





app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
