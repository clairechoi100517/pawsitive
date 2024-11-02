const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const uploadRouter = require('./routes/upload');
const blogDataRouter = require('./routes/blogdata');
const sessionRouter = require('./routes/session'); // Import session route

const app = express();
const PORT = 5000; // Hardcoded port number
const MONGO_URI = 'mongodb://localhost:27017/PetService'; // Hardcoded MongoDB connection string

// MongoDB connection
mongoose.connect(MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB PetService database'))
.catch(error => console.error('MongoDB connection error:', error));

// Middleware
app.use(cors());
app.use(express.json());

// Register session (login/register) routes
app.use('/api', sessionRouter); // Ensure './routes/session' file exists and exports a router

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the upload and blog data routes, prefixing them under '/api' for clarity
app.use('/api', uploadRouter);
app.use('/api', blogDataRouter); // Correctly used

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
    res.status(500).send('Something broke!'); // Respond with a 500 status and a message
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
