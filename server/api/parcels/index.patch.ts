import { getDb } from '../../utils/db'

export default eventHandler(async (event) => {
    const parcel = await readBody(event)
    const db = getDb()
    db.prepare('UPDATE parcels SET is_collected_yet = ? WHERE id = ?')
        .run(parcel.is_collected_yet, parcel.id)
    const updated = db.prepare('SELECT * FROM parcels WHERE id = ?').get(parcel.id)
    db.close()
    return updated
})
