// models/Blog.js
const mongoose = require('mongoose');

// Schema for image metadata
const imageSchema = new mongoose.Schema({
    name: String,
    path: String,
    size: Number,
    mimeType: String
});

// Schema for individual replies
const replySchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() }, // Unique identifier for the reply
    replyName: String,     // Name of the person who replied
    replyText: String,     // Text content of the reply
    timestamp: { type: Date, default: Date.now } // Timestamp for the reply
});

// Blog schema
const blogSchema = new mongoose.Schema({
    threadName: String,
    threadTopic: String,
    threadDescription: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, // Ensure this is correct
    images: [imageSchema], // Array of image metadata
    replies: [] // Array of replies
});

module.exports = mongoose.model('Blog', blogSchema);
