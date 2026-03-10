const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = 3000;

// Initialize the Google Gen AI SDK
// Pass an empty object or explicitly pass the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'missing_key' });

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Tiny Web API!' });
});

// A simple parameterized endpoint
app.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  res.json({ message: `Hello there, ${name}!` });
});

// A POST endpoint to echo data
app.post('/echo', (req, res) => {
  const data = req.body;
  res.json({ echoedData: data });
});

// Add two numbers
app.get('/add/:a/:b', (req, res) => {
  const a = parseFloat(req.params.a);
  const b = parseFloat(req.params.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Both parameters must be numbers.' });
  }
  res.json({ operation: 'addition', a, b, result: a + b });
});

// Multiply two numbers
app.get('/multiply/:a/:b', (req, res) => {
  const a = parseFloat(req.params.a);
  const b = parseFloat(req.params.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Both parameters must be numbers.' });
  }
  res.json({ operation: 'multiplication', a, b, result: a * b });
});

// Ask Gemini a question
app.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Please provide a "question" in the request body.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
    });

    // Return the response as plain text so newlines render correctly in the terminal
    res.setHeader('Content-Type', 'text/plain');
    res.send(response.text + '\n');
  } catch (error) {
    console.error('Error calling Gemini:', error);
    res.status(500).json({ error: 'Failed to communicate with Gemini. Check your server logs.' });
  }
});

app.listen(port, () => {
  console.log(`Tiny Web API listening at http://localhost:${port}`);
});
