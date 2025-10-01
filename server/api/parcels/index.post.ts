import { getDb } from '../../utils/db'
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default eventHandler(async (event) => {
  const parcel = await readBody(event)
  console.log('received', parcel)
  const db = getDb()
  db.prepare(
    'INSERT INTO parcels (id, date_created, intended_recipient, current_holder, is_collected_yet, collection_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(
    parcel.id,
    new Date().toISOString(),
    parcel.intended_recipient,
    parcel.current_holder,
    parcel.is_collected_yet,
    parcel.collection_date,
    parcel.notes
  )
  db.close()

const { data, error } = await resend.emails.send({
  from: 'Prenzlbogen Parcel Exchange <pakete@prenzlbogies.de>',
  to: parcel.intended_recipient,
  subject: 'Your neighbour has a parcel for you',
  html: `<p>Hallo,</p><p>Dein Nachbar hat ein Paket für dich. bei <a href="https://pakete.prenzlbogies.de">Prenzlbogen Pakete</a> anmelden, um weitere Informationen zu erhalten.</p><p> Bitte diese E-Mail NICHT beantworten, da diese Adresse keine Nachrichten empfangen kann.</p><p>Hello,</p><p>Your neighbour has a parcel for you. Log into <a href="https://pakete.prenzlbogies.de">Prenzlbogen Pakete</a> for more details.</p><p>Please DO NOT reply to this email, as this address cannot receive messages.</p>`, // HTML body
})

  if (error) {
    return console.error({ error })
  }
  
  return true
})
