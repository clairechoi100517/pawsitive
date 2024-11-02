const mongoose = require('mongoose');
const config = require('config'); // For loading configurations (optional)
const db = process.env.MONGO_URI || 'mongodb://localhost:27017/PetService';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
