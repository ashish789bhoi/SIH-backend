import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import db from './config/db.js'; // Import the database connection

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample GET request to fetch a user's name by person_id
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

// Sample POST request to handle login
app.post('/api/login', (req, res) => {
  const { username, password, dropdown } = req.body;

  if (!username || !password) {
    return res.status(400).send({ error: 'Username and password are required' });
  }

  // Query to fetch the username and hashed password from the database
  const query = 'SELECT * FROM users WHERE username = ? AND password_hash = ?';
  
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).send({ error: 'Database query failed' });
    } else if (results.length === 0) {
      // No matching user found
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    } else {
      const user = results[0]; // Get the first matching user

      // Check if the user's role matches the dropdown selection
      if (user.role === dropdown) {
        // Return successful login response with role
        console.log("Login successful");
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          role: user.role
        });
      } else {
        // Return error if role doesn't match
        return res.status(400).json({
          success: false,
          message: 'Role mismatch',
        });
      }
    }
  });});


// Test endpoint to authenticate a user (used for debugging)
app.get('/test', (req, res) => {
  const username = "Faridabad_spm";
  const password = "Faridabad@123";

  if (!username || !password) {
    return res.status(400).send({ error: 'Username and password are required' });
  }

  const query = 'SELECT username, password_hash FROM users WHERE username = ? AND password_hash = ?'; // Query to fetch username and password
  
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).send({ error: 'Database query failed' });
    } else if (results.length === 0) {
      res.status(404).send({ message: 'Invalid username or password' });
    } else {
      res.send({ message: 'User authenticated successfully', user: results[0] });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
