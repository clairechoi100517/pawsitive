// routes/blogdata.js
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Route to handle GET request for fetching all blog threads
router.get('/threads', async (req, res) => {
    try {
        const threads = await Blog.find(); // Fetch all threads from the database
        res.json(threads); // Send threads as a JSON response
    } catch (error) {
        console.error('Error fetching threads:', error);
        res.status(500).json({ message: 'Error fetching threads' });
    }
});

// Route to handle POST request for saving blog data
router.post('/blogdata', async (req, res) => {
    const { threadName, threadTopic, threadDescription, userId, images } = req.body;

    try {
        // Create a new blog post object
        const blogPost = new Blog({
            threadName,
            threadTopic,
            threadDescription,
            userId, 
            images
        });

        // Save the blog post to the database
        await blogPost.save();

        // Respond with a success message
        res.json({ message: 'Blog data and images saved successfully!' });
    } catch (error) {
        console.error('Error saving blog data:', error);
        // Send an error response if something goes wrong
        res.status(500).json({ message: 'Error saving blog data' });
    }
});

// Route to handle DELETE request for deleting a blog post
router.delete('/threads/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Blog.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Thread not found' });
        }
        res.json({ message: 'Thread deleted successfully' });
    } catch (error) {
        console.error('Error deleting thread:', error);
        res.status(500).json({ message: 'Error deleting thread' });
    }
});


module.exports = router;
