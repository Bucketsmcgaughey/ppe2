import { getDb } from '../../utils/db'

export default eventHandler(async (event) => {
    const resident = await readBody(event)
    const db = getDb()
    db.prepare('UPDATE residents SET surname = ?, email = ?, hausnummer = ?, floor = ?, klingel = ? WHERE email = ?')
        .run(resident.surname, resident.email, resident.hausnummer, resident.floor, resident.klingel, resident.email)
    const updated = db.prepare('SELECT * FROM residents WHERE email = ?').get(resident.email)
    db.close()
    return updated
})
