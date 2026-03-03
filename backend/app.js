require('dotenv').config();
const connectDB = require("./config/db");
const express = require('express');
const cors = require("cors");

const apiRoutes = require('./routes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is working');
});

// Routes (aggregated under /api)
app.use('/api', apiRoutes);

module.exports = app;