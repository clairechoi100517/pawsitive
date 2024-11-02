// routes/upload.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Adjust the path to be two levels higher
const uploadsPath = path.join(__dirname, '../../uploads');

// Configure multer storage with the adjusted path
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = req.query.folder || '';
        const fullPath = path.join(uploadsPath, folder);

        // Ensure the folder exists, create if it doesn't
        fs.mkdirSync(fullPath, { recursive: true });
        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique file names
    }
});

const upload = multer({ storage: storage });

// Handle the image upload route for multiple files
router.post('/upload', upload.array('images'), (req, res) => {
    console.log("Upload route hit");
    if (req.files && req.files.length > 0) {
        res.json({ message: 'Images uploaded successfully!', files: req.files });
    } else {
        res.status(400).json({ message: 'Image upload failed!' });
    }
});

module.exports = router;
