import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'interview.db')

// 确保 data 目录存在
import fs from 'node:fs'
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

const db = new Database(DB_PATH, { verbose: undefined })

// WAL 模式提升并发性能
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// ==================== 建表 ====================

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar TEXT DEFAULT '',
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS answer_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    question_id INTEGER NOT NULL,
    question_title TEXT NOT NULL,
    user_answer TEXT DEFAULT '',
    correct_answer TEXT NOT NULL,
    is_correct INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, company_id, session_id, question_id)
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    question_id INTEGER NOT NULL,
    language TEXT NOT NULL DEFAULT 'cpp',
    code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
      CHECK(status IN ('pending','running','accepted','wrong_answer','time_limit','memory_limit','runtime_error','compile_error','system_error')),
    test_results TEXT DEFAULT '[]',
    llm_review TEXT DEFAULT '',
    llm_score INTEGER DEFAULT NULL,
    execution_time_ms INTEGER DEFAULT NULL,
    memory_kb INTEGER DEFAULT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS user_questions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('choice', 'coding')),
    choices TEXT DEFAULT '[]',
    answer TEXT DEFAULT '',
    note TEXT DEFAULT '',
    difficulty TEXT DEFAULT 'Medium' CHECK(difficulty IN ('Easy', 'Medium', 'Hard')),
    tags TEXT DEFAULT '[]',
    is_public INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_records_user ON answer_records(user_id);
  CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
  CREATE INDEX IF NOT EXISTS idx_user_questions_user ON user_questions(user_id);

  -- ==================== 成长路线图 ====================
  CREATE TABLE IF NOT EXISTS growth_roadmaps (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    milestones TEXT NOT NULL DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, id)
  );

  CREATE TABLE IF NOT EXISTS growth_notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    roadmap_id TEXT DEFAULT '',
    milestone_id TEXT DEFAULT '',
    folder TEXT DEFAULT '',
    source TEXT DEFAULT 'manual',
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_roadmaps_user ON growth_roadmaps(user_id);
  CREATE INDEX IF NOT EXISTS idx_notes_user ON growth_notes(user_id);

  CREATE TABLE IF NOT EXISTS question_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    status TEXT DEFAULT 'unseen' CHECK(status IN ('unseen','learning','confused','mastered')),
    my_answer TEXT DEFAULT '',
    note TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, question_id)
  );
  CREATE INDEX IF NOT EXISTS idx_progress_user ON question_progress(user_id);
`)

// ==================== 种子用户 ====================
import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'

const seedUser = db.prepare('SELECT id FROM users WHERE email = ?').get('2710007824@qq.com')
if (!seedUser) {
  const id = uuid()
  const hash = bcrypt.hashSync('2710007824@qq.com', 10)
  db.prepare('INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)').run(id, '2710007824@qq.com', '2710007824@qq.com', hash)
  console.log('[DB] 种子用户已创建: 2710007824@qq.com')
}

export default db
