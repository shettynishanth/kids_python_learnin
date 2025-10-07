import Database from 'better-sqlite3';

const db = new Database('database/progress.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    lessonId INTEGER NOT NULL,
    score INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);


export default db;
