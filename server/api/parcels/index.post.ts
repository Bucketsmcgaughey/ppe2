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
  html: "<p>Hello,</p><p>Your neighbour has a parcel for you. Log into Prenzlbogen Parcel Exchange for more details.</p><p>Please DO NOT respond to this email.</p>", // HTML body
})

  if (error) {
    return console.error({ error })
  }

  console.log({ data })
// await transporter.sendMail({
//     from: '"Prenzlbogen Parcel Exchange" <neil.calderwood@gmail.com>',
//     to: "parcel.intended_recipient",
//     subject: "Your neighbour has a parcel for you!",
//     text: "Hello, your neighbour has a parcel for you. Log into Prenzlbogen Parcel Exchange for more details. Please DO NOT respond to this email.", // plain‑text body
//     html: "<p>Hello,</p><p>Your neighbour has a parcel for you. Log into Prenzlbogen Parcel Exchange for more details.</p><p>Please DO NOT respond to this email.</p>", // HTML body
//   });

  return {}
})
