import { Resend } from 'resend';

export async function onRequestPost({ request, env }) {
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== env.CONTACT_API_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }

  const data = await request.json();
  const { name, email, message } = data;

  const resend = new Resend(env.CONTACT_API_KEY);

  await resend.emails.send({
    from: 'Asidum <info@asidum.com>',
    to: ['info@asidum.com'],
    reply_to: email,
    subject: `Contact form: ${name}`,
    text: message
  });

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
