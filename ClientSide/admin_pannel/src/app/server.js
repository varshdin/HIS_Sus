const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Allow CORS
app.use(cors());

// PostgreSQL client setup
const pool = new Pool({
    user: 'fuas',
    host: 'sustainability.cvnuvcym0gmh.eu-central-1.rds.amazonaws.com',
    database: 'Sustainability',
    password: 'fuas2022!',
    port: 5432,
});

// Endpoint to get options
app.get('/api/sector', async (req, res) => {
    try {
        const result = await pool.query('SELECT nace_lev2_id FROM sector');
        res.json(result.rows);
        console.log("Connection Done!");
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, 'dist/my-angular-app')));

// All other routes should be handled by Angular
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/my-angular-app/index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
