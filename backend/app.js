require('dotenv').config();
const connectDB = require("./config/db");
const express = require('express');
const cors = require("cors");

const locationsRoutes = require('./routes/locationsRouter');
const authRoutes = require('./routes/authRouter');
const postsRoutes = require('./routes/postsRouter');
const aiRoutes = require('./routes/aiRouter');
const profileRoutes = require('./routes/profileRouter');
const chatRoutes = require('./routes/chatRouter');
const path = require("path");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(express.static('view'));  

app.get('/', (req, res) => {
  res.send('Backend is working');
});

// Routes
app.use('/api', locationsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/chat', chatRoutes);

app.use((req, res) => {
  res.sendFile(__dirname + '/view/index.html');
});

module.exports = app;