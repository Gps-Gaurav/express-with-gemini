const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Google Generative AI Setup
const genAI = new GoogleGenerativeAI("AIzaSyAlU06lSQ8CfPuh6ry0WnJjL6MdYTfRvoE");
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const generate = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error(err);
    }
};

// API route for content generation
app.post('/api/content', async (req, res) => {
    try {
        const data = req.body.question;
        if (!data) {
            return res.status(400).send({ error: 'Question is required' });
        }
        const result = await generate(data);
        res.status(200).send({ result });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
