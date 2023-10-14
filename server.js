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
  /*
  export const getChapter = async function () {
    const data = await query('SELECT chapter_id, title, number FROM section;')
    const table = {}
    data.forEach((row) => {
      if (row.number === 0) {
        table[row.chapter_id] = {}
      }
      table[row.chapter_id][row.number] = row.title
    })
  
    return table
  }
  */
  
  export const getChapters = async function (id) {
    const sql = `SELECT section.title, section.number AS sect_num, element.section_id, element.content, element.index, element.element_type_id AS type
    FROM section RIGHT JOIN element ON section.id = element.section_id
    WHERE section.chapter_id = ${number}
    ORDER BY section_id ASC, index ASC;`
    return await query(sql)
  }

// Configure web server & Express Routes////////////////////////////////
  express()
  .use(express.static('public'))
  .set('views', 'views')
  .set('view engine', 'ejs')

  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .get('/', function (req, res) {
    res.render('pages/index')
  })
  .get('/about', function (req, res) {
    res.render('pages/about')
  })

// Web server setup ////////////////////////////////////////
const app = express()
app.use(express.static('public'))

// Ready for browsers to connect ///////////////////////////
const displayPort = function () {
  console.log('Listening on ' + PORT)
};

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
