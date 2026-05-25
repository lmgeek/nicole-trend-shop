import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const CONTACT_EMAIL = 'Nicoletrend.shop@gmail.com';

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  await transporter.sendMail({
    from: `"${data.name}" <${process.env.SMTP_USER || data.email}>`,
    replyTo: data.email,
    to: CONTACT_EMAIL,
    subject: `Nuovo messaggio da ${data.name} - Nicole Trend Shop`,
    html: `
      <h2>Nuovo messaggio dal form di contatto</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;font-weight:bold;">Nome:</td><td style="padding:8px;">${data.name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;">${data.email}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Telefono:</td><td style="padding:8px;">${data.phone}</td></tr>
      </table>
      <h3>Messaggio:</h3>
      <p style="white-space:pre-wrap;padding:12px;background:#f5f5f5;border-radius:8px;">${data.message}</p>
    `,
  });
}
