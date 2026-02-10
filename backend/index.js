require('dotenv').config();
const connectDB = require("./config/db");
const express = require('express');
const cors = require("cors");
const locationsRouter = require('./routes/locationsRouter');
const authRoutes = require('./routes/authRouter');
const requestRoutes = require('./routes/requestsRouter');

const app = express();

connectDB();

app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is working');
});

// Routes
app.use('/auth', authRoutes);
app.use('/requests', requestRoutes);
app.use('/api', locationsRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
