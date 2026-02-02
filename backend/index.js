require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
  
const authRoutes = require('./routes/auth.routes');
const requestRoutes = require('./routes/requests.routes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is working');
});

// Routes
app.use('/auth', authRoutes);
app.use('/requests', requestRoutes);

const PORT = process.env.PORT; // localhost:5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
