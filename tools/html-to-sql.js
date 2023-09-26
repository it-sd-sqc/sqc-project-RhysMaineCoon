/***********************************************************
NOTE: If Git reports a fatal error saying either "LF will be
replaced by CRLF" or "CRLF would be replaced by LF", then
the line endings in the specified file (such as
"data/book.html") don't match your local Git repository.
You'll need to change the line endings in the specified file
to CRLF (carriage-return \r, line feed \n) or LF (line feed,
\n) in your text editor and resave the file.

This happens because Windows uses CRLF and macOS/Linux use
LF to indicate the end of the file, and Git doesn't want to
accidentally corrupt a binary file mislabelled as a text
file.
***********************************************************/

// Dependencies ////////////////////////////////////////////
const fs = import('fs');
const { parse } = import('node-html-parser');

// Define the srcPath variable for the input HTML eBook file
const srcPath = './Tales_of_Old_Japan_by_Algernon_Bertram_Freeman-Mitford_eBook.html';

// Read the HTML content from the file
const htmlContent = fs.readFileSync(srcPath, 'utf8');

// Parse the HTML content using node-html-parser
const root = parse(htmlContent);

// Initialize an array to store chapters
const chapters = [
  'KAZUMA\'S REVENGE',  // Story 1
  'THE TONGUE-CUT SPARROW',  // Fairytale 1
  'THE FOXES\' WEDDING'  // Fairytale 2
];

// Extract chapters using CSS selectors (adjust the selectors based on your HTML structure)
root.querySelectorAll('h2').forEach((h2Element, index) => {
  const chapterTitle = h2Element.text;
  const chapterContent = h2Element.nextElementSibling.text;
  chapters.push({
    id: index + 1,
    title: chapterTitle,
    content: chapterContent,
  });
});

// Generate SQL statements
const sqlStatements = `DROP TABLE IF EXISTS STORY;
DROP TABLE IF EXISTS CATEGORY;

CREATE TABLE CATEGORY (
  category_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE STORY (
  story_id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id INT NOT NULL REFERENCES CATEGORY(category_id)
);`;

// Populate tables
chapters.forEach((chapter) => {
  sqlStatements += `INSERT INTO chapters (id, title, content) VALUES (${chapter.id}, '${chapter.title.replace(/'/g, "''")}', '${chapter.content.replace(/'/g, "''")}');\n`;
});

// Save the SQL statements to a file
fs.writeFileSync('./docs/generated-schema.sql', sqlStatements);

console.log('SQL schema generated successfully!');