import nodemailer, { type Transporter } from "nodemailer";

export interface SendEmailParams {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export function createTransporter(): Transporter {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    },
  });
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  if (!params.text && !params.html) {
    throw new Error("sendEmail requires either text or html");
  }
  const transporter = createTransporter();
  await transporter.sendMail({
    from: params.from,
    to: params.to,
    subject: params.subject,
    ...(params.text ? { text: params.text } : {}),
    ...(params.html ? { html: params.html } : {}),
  });
}
