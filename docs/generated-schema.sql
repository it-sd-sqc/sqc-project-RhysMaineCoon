DROP TABLE IF EXISTS chapters;

CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL
);

INSERT INTO chapters (title, body) VALUES
('', ''),
('', ''),
('', '');

