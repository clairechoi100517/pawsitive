const express = require('express');
const router = express.Router();
const Account = require('../models/Account'); // Changed to Account model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the account already exists
    let account = await Account.findOne({ email });
    if (account) {
      return res.status(400).json({ message: "Account already exists" });
    }

    // Derive username from the email
    const username = email.split('@')[0];

    // Hash the password before saving the account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  

    // Create a new account with username, email, hashed password, and userId
    account = new Account({
      username,
      email,
      password: hashedPassword,  // Save hashed password
      userId
    });

    // Save the account in the database
    await account.save();
    console.log('Account saved:', account); // Debug log to verify saving
    res.status(201).json({ message: "Account registered successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Use a strong, securely stored secret key
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecretkey'; // Replace with an environment variable

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find account by email
    const account = await Account.findOne({ email });
    if (!account) {
      console.log("Account not found for email:", email); // Debug log
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password with hashed password in the database
    const isMatch = await bcrypt.compare(password, account.password);
    console.log("Password match:", isMatch); // Debug log
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT Token
    const token = jwt.sign({ id: account._id }, JWT_SECRET, { expiresIn: '1h' });

    // Return the token to the frontend
    res.json({ token, userId: account._id, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error.message); // More specific error logging
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
