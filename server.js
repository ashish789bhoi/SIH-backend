import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import db from './config/db.js'; // Import the databaseconnection



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',  // Allow the frontend origin
  methods: 'GET,POST',             // Allow specific HTTP methods
  credentials: true                // Allow cookies to be sent with requests
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.post('/api/login', (req, res) => {
  const { username, password, dropdown } = req.body;

  if (!username || !password) {
    return res.status(400).send({ error: 'Username and password are required' });
  }

  const query = `
     SELECT 
    users.user_id AS userId, 
    users.role, 
    users.district_id AS districtId, 
    districts.district_name AS district_name,
    users.subdivision_id AS subdivisionId, 
    subdivisions.subdivision_name AS subdivision_name,
    users.block_id AS blockId,
    blocks.block_name AS block_name
FROM 
    users
LEFT JOIN 
    districts ON users.district_id = districts.district_id
LEFT JOIN 
    subdivisions ON users.subdivision_id = subdivisions.subdivision_id
LEFT JOIN 
    blocks ON users.block_id = blocks.block_id
WHERE 
    users.username = ? AND users.password_hash = ?;
  `;

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).send({ error: 'Database query failed' });
    } else if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    } else {
      const user = results[0];

      if (user.role === dropdown) {
        console.log('Login successful');
        console.log('User Data:', user);
        const userData = {
          userId: user.userId,
          role: user.role,
          district_name: user.district_name,
          districtId: user.districtId,
          subdivisionId: user.subdivisionId,
          subdivision_name: user.subdivision_name,
          blockId: user.blockId,
          block_name: user.block_name
        };
        return res.status(200).json({
          
          success: true,
          message: 'Login successful',
          userData: userData,
        });
      } else {
        return res.status(400).json({ success: false, message: 'Role mismatch' });
      }
    }
  });
});

// District level api

app.get('/api/subdivisions', (req, res) => {
  const districtId = req.query.districtId;
  if (!districtId) {
    return res.status(400).json({ error: "districtId is required" });
  }
  console.log("districtId:", districtId);

  const query = `
    SELECT
      subdivisions.subdivision_id,
      subdivisions.subdivision_name
    FROM
      subdivisions
    WHERE
      subdivisions.district_id = ?`;

  db.query(query, [districtId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching subdivisions from database" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No subdivisions found for the given districtId" });
    }
    res.json({ subdivisionList: results });
  });
});

app.get('/api/blocks', (req, res) => {
  const subdivisionId = req.query.subdivisionId;
  if (!subdivisionId) {
    return res.status(400).json({ error: "subdivisionId is required" });
  }
  console.log("subdivisionId:", subdivisionId);

  const query = `
    SELECT
      blocks.block_id,
      blocks.block_name
    FROM
      blocks
    WHERE
      blocks.subdivision_id = ?`;

  db.query(query, [subdivisionId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching blocks from database" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No blocks found for the given subdivisionId" });
    }
    console.log("results contian blocklist", results);
    res.json({ blockList: results });
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
