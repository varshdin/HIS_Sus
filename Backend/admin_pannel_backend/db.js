// db.js
const { Pool } = require('pg');
const express = require('express');
const router = express.Router();

const pool = new Pool({
  user: 'fuas',
  host: 'sustainability.cvnuvcym0gmh.eu-central-1.rds.amazonaws.com',
  database: 'Sustainability',
  password: 'fuas2022!',
  port: 5432,
});

module.exports = pool;
