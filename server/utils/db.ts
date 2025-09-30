import Database from 'better-sqlite3'

export function getDb() {
    const db = new Database('./data/ppe.db')
    db.pragma('journal_mode = WAL')
    db.exec(`CREATE TABLE IF NOT EXISTS residents (
    id INTEGER PRIMARY KEY,
    date_created TEXT,
    email TEXT,
    surname TEXT,
    hausnummer TEXT,
    floor TEXT,
    klingel TEXT
  )`)

    db.exec(`CREATE TABLE IF NOT EXISTS parcels (
    id INTEGER PRIMARY KEY, 
    date_created TEXT, 
    intended_recipient TEXT, 
    current_holder TEXT, 
    is_collected_yet NUMERIC, 
    collection_date TEXT, 
    notes TEXT
)`)
    return db
}