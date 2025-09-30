import { getDb } from '../../utils/db'

export default eventHandler(async (event) => {
  const db = getDb()
  const query = getQuery(event)
  const rows = db.prepare('SELECT * FROM parcels WHERE intended_recipient = ? AND is_collected_yet = ? ORDER BY date_created DESC').all(query.email, query.is_collected_yet)
  db.close()
  return rows
})