import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/chat', (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ response: 'No message provided' });
  }

  const botResponse = `Bot: You said, '${userMessage}'`;
  res.json({ response: botResponse });
});

app.listen(5001, () => {
  console.log('Backend running on http://localhost:5001');
});
