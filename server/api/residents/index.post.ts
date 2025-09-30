import { getDb } from '../../utils/db'

export default eventHandler(async (event) => {
  const resident = await readBody(event)
  const db = getDb()
  db.prepare(
    'INSERT INTO residents (date_created, email, surname, hausnummer, floor, klingel) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(
    new Date().toISOString(),
    resident.email,
    resident.surname,
    resident.hausnummer,
    resident.floor,
    resident.klingel
  )
  const updated = db.prepare('SELECT * FROM residents WHERE email = ?').get(resident.email)
  db.close()
  return updated
})