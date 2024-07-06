const express = require('express');
//const pool =require('pg')
const pool= require ('./db.js')
const app = express();
const cors= require('cors'); //cross_Origin Resource Sharing
const bodyParser=require('body-parser');
const port = 3000;

// Middleware to parse JSON request bodies
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// Route to get all Sector
app.get('/sector', async (req, res) => {
    try {
      const result = await pool.query('SELECT nace_lev2_id FROM sector');
      const data = result.rows.map(ele => ele.nace_lev2_id)
      res.json(data || []);
    } catch (err) {
      console.error(err);
      res.status(500).send('Something went wrong!');
    }
  });

//Get all Companies
app.get('/view/companies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM companies');
    const data = result.rows; 
    res.json(data || []);
  } catch  {
    console.error("Backend ApI May be Not Working");
    //res.status(500).send('Something went wrong!');
  }
});
  
// POST endpoint to insert company data
app.post('/add/companies', (req, res) => {
  const { company_name, company_alias, nace_lev2_id, nace_lev1_desc, company_url, sustainability_url, logo_link, company_description } = req.body;

  pool.query('INSERT INTO companies (company_name, company_alias, nace_lev2_id, nace_lev1_desc, company_url,sustainability_url, logo_link, company_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [company_name, company_alias, nace_lev2_id, nace_lev1_desc, company_url, sustainability_url, logo_link, company_description],
      (err, result) => {
          if (err) {
              console.error('Error executing query', err);
              res.status(500).json({ error: 'Error inserting company data' });
          } else {
              res.status(201).json(result.rows[0]);
          }
      });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
