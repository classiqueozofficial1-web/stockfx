#!/usr/bin/env node
require('dotenv').config();

const port = process.env.PORT || 3000;

const express = require('express');
const { json } = require('body-parser');

const app = express();
app.use(json());

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Simple registration endpoint (mock)
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, firstName } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Mock response
  res.status(201).json({
    id: 1,
    email,
    username,
    message: 'Verification email sent. Please check your inbox.'
  });
});

app.listen(port, () => {
  console.log(`✅ Backend server is running on http://localhost:${port}`);
  console.log(`📚 Health check: http://localhost:${port}/health`);
  console.log(`📝 API endpoint: http://localhost:${port}/api/auth/register`);
});
