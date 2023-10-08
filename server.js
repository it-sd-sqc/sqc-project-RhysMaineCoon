// Dependencies ////////////////////////////////////////////
import 'dotenv/config'
import express from 'express'
import pkg from 'pg'
import { Pool } from 'pkg';

// Configuration ///////////////////////////////////////////
const PORT = process.env.PORT || 5163
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
    });

// Web server setup ////////////////////////////////////////
const app = express()
app.use(express.static('public'))

// Ready for browsers to connect ///////////////////////////
const displayPort = function () {
  console.log('Listening on ' + PORT)
};

// Routes //////////////////////////////////////////////////
app.get('/', function (req, res) {
  res.render('pages/index')
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

app.listen(PORT, displayPort);
