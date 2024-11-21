const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Serve static files (your frontend assets like JS, CSS, images)
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));


// app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// API routes (if needed)
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// SPA fallback to serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});