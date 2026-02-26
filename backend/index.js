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

const app = express();

connectDB();

app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is working');
});

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);
app.use('/ai', aiRoutes);
app.use('/api', locationsRoutes);
app.use('/users', profileRoutes);
app.use('/chat', chatRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
