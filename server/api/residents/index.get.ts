import { getDb } from '../../utils/db'

export default eventHandler(async (event) => {
  const db = getDb()
  const query = getQuery(event)
  if (query.inclusive === 'false') {
    const rows = db.prepare('SELECT * FROM residents WHERE email != ? ORDER BY surname').all(query.email)
    db.close()
    return rows
  } else {
    const result = db.prepare('SELECT * FROM residents WHERE email = ? ORDER BY surname').get(query.email)
    db.close()
    return result
  }
})