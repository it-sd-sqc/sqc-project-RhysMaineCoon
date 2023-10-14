// Dependencies ////////////////////////////////////////////
import 'dotenv/config'
import express from 'express'
import pkg from 'pg'
const { Pool } = pkg


// Configuration ///////////////////////////////////////////
const PORT = process.env.PORT || 5163
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

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
  
  export const getChapter = async function () {
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

// Web server setup ////////////////////////////////////////
const app = express()
app.use(express.static('public'))

// Ready for browsers to connect ///////////////////////////
const displayPort = function () {
  console.log('Listening on ' + PORT)
};

// Express Routes/////////////////////////////////////////////////
express()
  .use(express.static('./public/'))
  .set('views', 'views')
  .set('view engine', 'ejs')
  .get('/', function (req, res) {
    res.render('pages/index')
  })
  .get('/about', function (req, res) {
    res.render('pages/about')
  })
  
//app.listen(PORT, displayPort);
app.listen(PORT, () => console.log(`Listening on ${PORT}`))
