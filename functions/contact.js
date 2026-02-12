export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { name, email, message } = await context.request.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Asidum <info@asidum.com>",
        to: ["info@asidum.com"],
        reply_to: email,
        subject: "Contact form — Asidum",
        html: `
          <strong>Name:</strong> ${name}<br/>
          <strong>Email:</strong> ${email}<br/><br/>
          <strong>Message:</strong><br/>
          ${message.replace(/\n/g, "<br/>")}
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
