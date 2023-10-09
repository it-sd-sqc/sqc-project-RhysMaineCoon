// Dependencies ////////////////////////////////////////////
import 'dotenv/config'
import dotenv from 'dotenv';
import express from 'express'
import pkg from 'pg'
import { Pool } from 'pg';


// Configuration ///////////////////////////////////////////
const PORT = process.env.PORT || 5163
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

/*
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  

require('dotenv').config();
*/

// Query functions /////////////////////////////////////////
export const query = async function (sql, params) {
    let client
    let results = []
    try {
      client = await pool.connect()
      const response = client.query(sql, params)
      if (response && response.rows) {
        results = response.rows
      }
    } catch (err) {
      console.error(err)
    }
    if (client) client.release()
    return results
  }
  
  export const queryChapter = async function (id) {
    const sql = `SELECT *, (SELECT COUNT(*) FROM chapters) AS total
      FROM chapters
      WHERE id = $1;`
    const results = await query(sql, [id])
    return results.length === 1 ? results[0] : []
  }
  
  export const queryChapters = async function (id) {
    const sql = 'SELECT id, title FROM chapters;'
    const results = await query(sql)
    return results
  }

// Configure the web server ////////////////////////////////
  express()
  .use(express.static('public'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))

  .set('views', 'views')
  .set('view engine', 'ejs')



// Routes //////////////////////////////////////////////////
app.get('/', function (req, res) {
    res.render('pages/index')
  })
  .get('/about', function (req, res) {
    res.render('pages/about', { title: 'About' })
  })
.get('/index', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM chapters');
        res.render('pages/chapters', { chapters: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
})
.get('/index/:ch', async (req, res) => {
    const chapterId = req.params.ch;
    try {
        const result = await pool.query('SELECT * FROM chapters WHERE id = $1', [chapterId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Chapter not found');
        }
        res.render('pages/chapter', { chapter: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Web server setup ////////////////////////////////////////
const app = express()
app.use(express.static('public'))

// Ready for browsers to connect ///////////////////////////
const displayPort = function () {
  console.log('Listening on ' + PORT)
};
//app.listen(PORT, displayPort);
app.listen(PORT, () => console.log(`Listening on ${PORT}`))
