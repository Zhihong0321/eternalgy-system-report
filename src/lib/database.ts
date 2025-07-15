import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'eternalgy-system.db');
const db = new Database(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    uid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS user_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_uid TEXT NOT NULL,
    user_department TEXT NOT NULL,
    system_section TEXT NOT NULL,
    system_function TEXT NOT NULL,
    session_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    record_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_uid) REFERENCES users(uid)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS daily_user_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    user_uid TEXT NOT NULL,
    user_department TEXT NOT NULL,
    system_section TEXT NOT NULL,
    total_interactions INTEGER DEFAULT 0,
    unique_functions_used INTEGER DEFAULT 0,
    most_used_function TEXT,
    first_interaction_time TIME,
    last_interaction_time TIME,
    UNIQUE(date, user_uid, system_section)
  )
`);

// Create indexes for better performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_user_interactions_user_uid ON user_interactions(user_uid);
  CREATE INDEX IF NOT EXISTS idx_user_interactions_date ON user_interactions(record_date);
  CREATE INDEX IF NOT EXISTS idx_user_interactions_system_section ON user_interactions(system_section);
  CREATE INDEX IF NOT EXISTS idx_user_interactions_department ON user_interactions(user_department);
  CREATE INDEX IF NOT EXISTS idx_daily_stats_date_user ON daily_user_stats(date, user_uid);
`);

// Database utility functions
export const dbUtils = {
  // Insert user interaction
  insertInteraction: db.prepare(`
    INSERT INTO user_interactions (user_uid, user_department, system_section, system_function, session_id, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),

  // Sync user data
  upsertUser: db.prepare(`
    INSERT OR REPLACE INTO users (uid, name, department, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `),

  // Get user interactions by date range
  getInteractionsByDateRange: db.prepare(`
    SELECT * FROM user_interactions 
    WHERE record_date >= ? AND record_date <= ?
    ORDER BY record_date DESC
  `),

  // Get user activity stats
  getUserStats: db.prepare(`
    SELECT 
      user_uid,
      user_department,
      COUNT(*) as total_interactions,
      COUNT(DISTINCT system_function) as unique_functions_used,
      DATE(record_date) as date
    FROM user_interactions
    WHERE DATE(record_date) = ?
    GROUP BY user_uid, user_department, DATE(record_date)
  `),

  // Get department activity
  getDepartmentStats: db.prepare(`
    SELECT 
      user_department,
      COUNT(*) as total_interactions,
      COUNT(DISTINCT user_uid) as active_users,
      DATE(record_date) as date
    FROM user_interactions
    WHERE DATE(record_date) = ?
    GROUP BY user_department, DATE(record_date)
  `),

  // Get system section usage
  getSystemSectionStats: db.prepare(`
    SELECT 
      system_section,
      COUNT(*) as total_interactions,
      COUNT(DISTINCT user_uid) as unique_users,
      DATE(record_date) as date
    FROM user_interactions
    WHERE DATE(record_date) = ?
    GROUP BY system_section, DATE(record_date)
  `),

  // Get function usage stats
  getFunctionStats: db.prepare(`
    SELECT 
      system_function,
      system_section,
      COUNT(*) as usage_count,
      COUNT(DISTINCT user_uid) as unique_users,
      DATE(record_date) as date
    FROM user_interactions
    WHERE DATE(record_date) = ?
    GROUP BY system_function, system_section, DATE(record_date)
    ORDER BY usage_count DESC
  `),

  // Get all users
  getAllUsers: db.prepare('SELECT * FROM users ORDER BY name'),

  // Get recent interactions
  getRecentInteractions: db.prepare(`
    SELECT ui.*, u.name as user_name
    FROM user_interactions ui
    LEFT JOIN users u ON ui.user_uid = u.uid
    ORDER BY ui.record_date DESC
    LIMIT ?
  `),

  // Get user productivity (for sales team)
  getUserProductivity: db.prepare(`
    SELECT 
      ui.user_uid,
      u.name as user_name,
      ui.user_department,
      COUNT(CASE WHEN ui.system_function LIKE '%quotation%' OR ui.system_function LIKE '%proposal%' THEN 1 END) as quotations_generated,
      COUNT(CASE WHEN ui.system_function LIKE '%report%' THEN 1 END) as reports_written,
      COUNT(*) as total_interactions,
      DATE(ui.record_date) as date
    FROM user_interactions ui
    LEFT JOIN users u ON ui.user_uid = u.uid
    WHERE DATE(ui.record_date) = ?
    GROUP BY ui.user_uid, ui.user_department, DATE(ui.record_date)
    ORDER BY total_interactions DESC
  `),

  // Get hourly activity pattern
  getHourlyActivity: db.prepare(`
    SELECT 
      strftime('%H', record_date) as hour,
      COUNT(*) as interaction_count
    FROM user_interactions
    WHERE DATE(record_date) = ?
    GROUP BY strftime('%H', record_date)
    ORDER BY hour
  `)
};

export default db;
