require('dotenv').config();
const connectDB = require("./config/db");
const express = require('express');
const cors = require("cors");
const locationsRouter = require('./routes/locations.routes');
const authRoutes = require('./routes/auth.routes');
const requestRoutes = require('./routes/requests.routes');

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
app.use('/api/locations', locationsRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
