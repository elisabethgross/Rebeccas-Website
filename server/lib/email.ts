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

// Splits `"Display Name" <addr@example.com>` into its parts.
function parseAddress(from: string): { name?: string; address: string } {
  const match = from.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (!match) return { address: from.trim() };
  return { name: match[1].trim() || undefined, address: match[2].trim() };
}

// Resend (HTTP API) is used when RESEND_API_KEY is set. Hosts such as Render's
// free tier block outbound SMTP ports, so Gmail SMTP cannot be used there.
// Resend can only send from a verified domain, so the sender address is
// replaced with EMAIL_FROM_ADDRESS (e.g. hello@rkleinerpt.com). The display
// name is kept and the original address becomes Reply-To, so replies still
// reach the original inbox.
async function sendWithResend(params: SendEmailParams, apiKey: string): Promise<void> {
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;
  if (!fromAddress) {
    throw new Error("EMAIL_FROM_ADDRESS must be set when RESEND_API_KEY is set");
  }
  const original = parseAddress(params.from);
  const from = original.name ? `"${original.name}" <${fromAddress}>` : fromAddress;
  const replyTo =
    original.address && original.address.toLowerCase() !== fromAddress.toLowerCase()
      ? original.address
      : undefined;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: params.subject,
      ...(replyTo ? { reply_to: replyTo } : {}),
      ...(params.text ? { text: params.text } : {}),
      ...(params.html ? { html: params.html } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error ${response.status}: ${body}`);
  }
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  if (!params.text && !params.html) {
    throw new Error("sendEmail requires either text or html");
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    await sendWithResend(params, resendApiKey);
    return;
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
