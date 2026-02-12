require('dotenv').config();
const connectDB = require("./config/db");
const express = require('express');
const cors = require("cors");
const locationsRouter = require('./routes/locationsRouter');
const authRoutes = require('./routes/authRouter');
const postsRouter = require('./routes/postsRouter');
const aiRouter = require('./routes/aiRouter');
const profileRoutes = require('./routes/profileRouter');

const app = express();

connectDB();

app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is working');
});

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postsRouter);
app.use('/ai', aiRouter);
app.use('/api', locationsRouter);
app.use('/users/profile', profileRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
