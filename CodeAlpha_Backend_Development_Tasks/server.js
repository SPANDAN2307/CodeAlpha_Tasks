const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Generate a random string for the short code
function generateShortCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// POST /api/shorten
app.post('/api/shorten', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Try to ensure it has http/https
    let longUrl = url;
    if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
        longUrl = 'http://' + longUrl;
    }

    const shortCode = generateShortCode();

    const sql = `INSERT INTO urls (long_url, short_code) VALUES (?, ?)`;
    db.run(sql, [longUrl, shortCode], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
        res.json({
            original_url: longUrl,
            short_code: shortCode,
            short_url: shortUrl
        });
    });
});

// GET /:code
app.get('/:code', (req, res) => {
    const { code } = req.params;

    const sql = `SELECT long_url FROM urls WHERE short_code = ?`;
    db.get(sql, [code], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal server error');
        }

        if (row) {
            return res.redirect(row.long_url);
        } else {
            return res.status(404).send('URL not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
