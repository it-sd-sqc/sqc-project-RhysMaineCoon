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
import { closeSync, openSync, readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'node-html-parser';

// Configuration ///////////////////////////////////////////
const srcPath = 'data/book.html';
const dstPath = 'docs/generated-schema.sql';

const sqlHeader = `DROP TABLE IF EXISTS chapters;

CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL
);

INSERT INTO chapters (title, body) VALUES
`;

// Utility functions ///////////////////////////////////////
const extractTitle = function (root, id) {
  const titleNode = root.querySelector(`#${id} h2 span.titlefont`);
  return titleNode ? titleNode.text : '';
};

const extractBody = function (root, id) {
  const bodyNode = root.querySelector(`#${id}`);
  let bodyText = '';
  if (bodyNode) {
    bodyNode.querySelectorAll('p').forEach(p => {
      bodyText += p.text + '\n';
    });
  }
  return bodyText.trim();
};

// Conversion ///////////////////////////////////////////////
const src = readFileSync(srcPath, 'utf8');
const domRoot = parse(src);

// Extract chapters /////////////////////////////////////////
const chapters = [
  { id: 'I_HAVE_EATEN_OF_THE_FURNACE_OF_HADES', title: 'I Have Eaten of the Furnace of Hades' },
  { id: 'THE_IDEALS_OF_A_SAMURAI', title: 'The Ideals of a Samurai' },
  { id: 'THE_END_OF_THE_TRAIL', title: 'The End of the Trail' }
];

chapters.forEach(chapter => {
  chapter.title = extractTitle(domRoot, chapter.id);
  chapter.body = extractBody(domRoot, chapter.id);
});

// Output the data as SQL ///////////////////////////////////
const fd = openSync(dstPath, 'w');
writeFileSync(fd, sqlHeader);
writeFileSync(fd, `('${chapters[0].title}', '${chapters[0].body}')`);
chapters.slice(1).forEach((data) => {
  const value = `,\n('${data.title}', '${data.body}')`;
  writeFileSync(fd, value);
});
writeFileSync(fd, ';\n\n');
closeSync(fd);
