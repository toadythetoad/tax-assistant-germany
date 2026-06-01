import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import path from 'path';
import { app } from 'electron';
import log from 'electron-log';
import fs from 'fs';

let db: SqlJsDatabase | null = null;
let dbPath = '';

export async function initDatabase() {
  try {
    const userDataPath = app.getPath('userData');
    dbPath = path.join(userDataPath, 'steuer2.db');
    log.info('Database path:', dbPath);

    const SQL = await initSqlJs();
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }

    db.run(`
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY,
        data TEXT NOT NULL,
        updatedAt TEXT
      );
      CREATE TABLE IF NOT EXISTS tax_returns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        state TEXT,
        data TEXT NOT NULL,
        status TEXT DEFAULT 'draft',
        createdAt TEXT
      );
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        type TEXT,
        data TEXT,
        taxReturnYear INTEGER,
        createdAt TEXT
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
    log.info('Database initialized');
  } catch (error) {
    log.error('Database init error:', error);
    throw error;
  }
}

export function getDatabase(): SqlJsDatabase {
  if (!db) throw new Error('Database not initialized');
  return db;
}
