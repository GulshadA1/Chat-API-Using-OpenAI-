const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ,
});

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        // console.log(prompt);
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required in the request body' });
        }
        
        const completion = await openai.chat.completions.create({
            messages: [{ "role": "system", "content": "You are a helpful assistant." },
                            { "role": "user", "content": prompt }],
            model: "gpt-3.5-turbo",
        });
        const botMessage = completion.choices[0].message.content;
        // console.log(botMessage);
        res.json({
            message: botMessage,
        });
    } catch (error) {
        console.error('OpenAI error:', error);

        // Handle specific OpenAI API error
        if (error.response && error.response.data && error.response.data.error) {
            res.status(500).json({ error: error.response.data.error });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.listen(port, () => {
    console.log(`Chat API listening on port ${port}`);
});
