const express = require('express');
const mongoose = require('mongoose');

const app = express();


app.use(express.json());


mongoose.connect('mongodb://localhost:27017/quotesDB', {
    
   
})
.then(() => console.log('MongoDB connected...'))
.catch(err => {
    console.error(err.message);
    process.exit(1);
});


const quoteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: String, required: true }
});

const Quote = mongoose.model('Quote', quoteSchema);
app.get('/', (req, res) => {
    res.send('Hello to API World . Use /api/quotes to interact with the API.');
});


app.post('/api/quotes', async (req, res) => {
    try {
        const { text, author } = req.body;
        const newQuote = new Quote({ text, author });
        await newQuote.save();
        res.status(201).json(newQuote);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


app.get('/api/quotes', async (req, res) => {
    try {
        const quotes = await Quote.find();
        res.json(quotes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


app.put('/api/quotes/:id', async (req, res) => {
    try {
        const quote = await Quote.findByIdAndUpdate(
            req.params.id,
            { text: req.body.text, author: req.body.author },
            { new: true }
        );
        res.json(quote);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


app.delete('/api/quotes/:id', async (req, res) => {
    try {
        await Quote.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Quote removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


app.get('/api/quotes/random', async (req, res) => {
    try {
        const quotes = await Quote.find();
        const randomIndex = Math.floor(Math.random() * quotes.length);
        res.json(quotes[randomIndex]);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
