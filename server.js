const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); // to handle cross origin requests
const dataRoutes = require('./routes/data'); // Import the data routes

const app = express();

// Connect to MongoDB
connectDB();

// Initialize Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/data', dataRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
