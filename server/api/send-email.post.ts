import { Resend } from 'resend';

// Initialize Resend with your API key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  try {
    // Get the email and name from the request body
    const body = await readBody(event);
    const { to, name, message } = body;

    if (!to || !name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing "to" or "name" in request body',
      });
    }

    const data = await resend.emails.send({
      from: 'Prenzlbogen Parcel Exchange<pakete@prenzlbogies.de>', // Must be a verified domain
      to: [to],
      subject: `Hello ${name}!`,
      html: message,
    });

    // console.log({ data });
    return { message: 'Email sent successfully!', data };

  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error sending email',
    });
  }
});