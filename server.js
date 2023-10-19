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
})

// Query functions /////////////////////////////////////////
export const query = async function (sql, params) {
  const client = await pool.connect()
  try {
    const response = await client.query(sql, params)
    return response.rows || []
  } catch (err) {
    console.error(err)
    return []
  } finally {
    client.release()
  }
}

export const getChapters = async function (id) {
  const sql = `SELECT section.title, section.number AS sect_num, element.section_id, 
               element.content, element.index, element.element_type_id AS type
               FROM section RIGHT JOIN element ON section.id = element.section_id
               WHERE section.chapter_id = $1
               ORDER BY section_id ASC, index ASC;`
  return await query(sql, [id])
}

// Initialize Express App /////////////////////////////////
const app = express()
app.use(express.static('./public/'))
app.set('views', 'views')
app.set('view engine', 'ejs')

// Routes /////////////////////////////////////////////////
app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/about', (req, res) => {
  res.render('pages/about')
})

// Route to display a single chapter by ID
app.get('/chapter/:chapterId', async (req, res) => {
  try {
    const { chapterId } = parseInt(req.params.chapterId);
    const chapterData = await query('SELECT * FROM chapters WHERE id = $1', [chapterId]);

    if (chapterData.length === 0) {
      return res.status(404).send('Chapter not found');
    }

    res.render('pages/chapterPage', { chapter: chapterData[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to display all chapters
app.get('/chapters', async (req, res) => {
  try {
    const allChapters = await query('SELECT * FROM chapters');
    res.render('pages/chaptersPage', { chapters: allChapters });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to display all chapters on a single page
app.get('/all-chapters', async (req, res) => {
  try {
    const allChapters = await query('SELECT * FROM chapters');
    res.render('pages/allChaptersPage', { chapters: allChapters });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});




// Start Server ///////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
