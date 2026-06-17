const nodemailer = require("nodemailer");

const BREVO_SMTP_HOST = "smtp-relay.brevo.com";
const BREVO_SMTP_PORT = 587;
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_SENDERS_URL = "https://api.brevo.com/v3/senders";

const DISPOSABLE_DOMAINS = [
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
];

function isDisposableRecipient(email) {
  const domain = email?.split("@")[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getGmailConfig() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();
  if (!user || !pass) {
    return null;
  }
  return { user, pass };
}

function shouldUseGmailForRecipient(toEmail) {
  if (process.env.EMAIL_USE_GMAIL_FOR_DISPOSABLE === "false") {
    return false;
  }
  if (!getGmailConfig()) {
    return false;
  }
  return (
    isDisposableRecipient(toEmail) || process.env.EMAIL_USE_GMAIL === "true"
  );
}

function buildResetUrl(email, token) {
  const base = process.env.ADMIN_CLIENT_URL || "http://localhost:5173";
  const params = new URLSearchParams({ token, email });
  return `${base.replace(/\/$/, "")}/reset-password?${params.toString()}`;
}

/**
 * BREVO_SMTP_KEY supports:
 * 1) email|xsmtpsib-...     → SMTP (recommended)
 * 2) email|xkeysib-...      → Brevo API
 * 3) xkeysib-...            → Brevo API (uses first verified sender in Brevo)
 */
function isPlaceholderBrevoKey(raw) {
  if (!raw) {
    return true;
  }
  if (/your-api-key|xkeysib-your|xsmtpsib-your|change-me|example\.com\|/i.test(raw)) {
    return true;
  }
  if (raw.startsWith("xkeysib-") && raw.length < 50) {
    return true;
  }
  if (raw.startsWith("xsmtpsib-") && raw.length < 50) {
    return true;
  }
  return false;
}

function parseBrevoConfig() {
  const raw = process.env.BREVO_SMTP_KEY?.trim();
  if (!raw || isPlaceholderBrevoKey(raw)) {
    return null;
  }

  const separator = raw.includes("|") ? "|" : raw.includes(":") ? ":" : null;

  if (separator) {
    const [user, key] = raw.split(separator).map((s) => s.trim());
    if (!user || !key) {
      return null;
    }
    if (key.startsWith("xkeysib-")) {
      return { mode: "api", apiKey: key, senderEmail: user };
    }
    if (key.startsWith("xsmtpsib-")) {
      return { mode: "smtp", user, pass: key };
    }
    return null;
  }

  if (raw.startsWith("xkeysib-")) {
    return { mode: "api", apiKey: raw, senderEmail: null };
  }

  if (raw.startsWith("xsmtpsib-")) {
    return { mode: "smtp-missing-email", pass: raw };
  }

  return null;
}

function getSmtpTransporter(config) {
  return nodemailer.createTransport({
    host: BREVO_SMTP_HOST,
    port: BREVO_SMTP_PORT,
    secure: false,
    auth: { user: config.user, pass: config.pass },
  });
}

async function getVerifiedSenders(apiKey) {
  const res = await fetch(BREVO_SENDERS_URL, {
    headers: { "api-key": apiKey, accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error("Could not load senders from Brevo. Check your API key.");
  }

  const data = await res.json();
  return data.senders?.filter((s) => s.active !== false && s.email) || [];
}

async function getVerifiedSenderEmail(apiKey) {
  const verified = await getVerifiedSenders(apiKey);
  if (!verified[0]?.email) {
    throw new Error(
      "No verified sender in Brevo. Add a sender in Brevo → Senders, or use email|key in .env"
    );
  }
  return verified[0].email;
}

/**
 * Brevo only delivers when FROM is a verified sender.
 * If BREVO_SENDER_EMAIL is not verified (e.g. yopmail), use first verified sender.
 */
async function resolveApiSenderEmail(apiKey) {
  const configured = process.env.BREVO_SENDER_EMAIL?.trim();
  const verified = await getVerifiedSenders(apiKey);

  if (!verified.length) {
    throw new Error(
      "No verified sender in Brevo. Add & verify an email in Brevo → Senders."
    );
  }

  if (configured) {
    const match = verified.find(
      (s) => s.email.toLowerCase() === configured.toLowerCase()
    );
    if (match) {
      return match.email;
    }
    console.warn(
      `⚠ BREVO_SENDER_EMAIL "${configured}" is not verified in Brevo. Sending from "${verified[0].email}" instead. Inquiries still go to INQUIRY_NOTIFY_EMAIL.`
    );
  }

  return verified[0].email;
}

async function sendViaGmail({ toEmail, subject, html, replyTo }) {
  const gmail = getGmailConfig();
  if (!gmail) {
    throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD are required in .env");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user: gmail.user, pass: gmail.pass },
  });

  await transporter.sendMail({
    from: `"Volume Day Trader" <${gmail.user}>`,
    to: toEmail,
    replyTo: replyTo || gmail.user,
    subject,
    html,
    text: stripHtml(html),
  });
}

async function sendViaBrevoApi(
  apiKey,
  senderEmail,
  toEmail,
  subject,
  htmlContent,
  replyTo
) {
  const payload = {
    sender: { name: "Volume Day Trader", email: senderEmail },
    to: [{ email: toEmail }],
    subject,
    htmlContent,
    textContent: stripHtml(htmlContent),
  };

  if (replyTo) {
    payload.replyTo = { email: replyTo };
  }

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Brevo API error ${res.status}`);
  }

  return res.json().catch(() => ({}));
}

function logDevEmailFallback(toEmail, subject, reason, extraLines = []) {
  console.warn("\n⚠ Email NOT sent:", reason);
  console.log("--- Email (dev fallback) ---");
  console.log("To:", toEmail);
  console.log("Subject:", subject);
  for (const line of extraLines) {
    console.log(line);
  }
  console.log("---\n");
}

const BREVO_SETUP_HINT =
  "Configure BREVO_SMTP_KEY and BREVO_SENDER_EMAIL in server/.env — see server/docs/BREVO_SETUP.md";

async function sendHtmlEmail({
  toEmail,
  subject,
  html,
  replyTo,
  devExtraLines = [],
  strict = false,
}) {
  const config = parseBrevoConfig();
  const isDev = process.env.NODE_ENV !== "production";
  const mustSend = strict || !isDev;
  const useGmail = shouldUseGmailForRecipient(toEmail);

  if (useGmail) {
    try {
      await sendViaGmail({ toEmail, subject, html, replyTo });
      console.log("Email sent via Gmail SMTP to:", toEmail);
      if (isDisposableRecipient(toEmail)) {
        console.log(
          "  → Open https://yopmail.com and enter inbox:",
          toEmail.split("@")[0]
        );
      }
      return { sent: true, emailSent: true, transport: "gmail" };
    } catch (gmailError) {
      console.error("Gmail SMTP error:", gmailError.message);
      if (!config) {
        const err = new Error(
          `Gmail failed and Brevo is not configured. For yopmail, set GMAIL_APP_PASSWORD in .env. ${gmailError.message}`
        );
        err.statusCode = 502;
        throw err;
      }
      console.warn("Falling back to Brevo after Gmail error.");
    }
  }

  if (!config) {
    const reason = `BREVO_SMTP_KEY is missing or still a placeholder. ${BREVO_SETUP_HINT}`;
    if (!mustSend) {
      logDevEmailFallback(toEmail, subject, reason, devExtraLines);
      return { devMode: true, emailSent: false };
    }
    const err = new Error(reason);
    err.statusCode = 503;
    throw err;
  }

  if (config.mode === "smtp-missing-email") {
    const reason =
      "xsmtpsib key needs login email: BREVO_SMTP_KEY=your@email.com|xsmtpsib-key";
    if (!mustSend) {
      logDevEmailFallback(toEmail, subject, reason, devExtraLines);
      return { devMode: true, emailSent: false };
    }
    const err = new Error(reason);
    err.statusCode = 503;
    throw err;
  }

  try {
    if (config.mode === "smtp") {
      const transporter = getSmtpTransporter(config);
      await transporter.sendMail({
        from: `"Volume Day Trader" <${config.user}>`,
        to: toEmail,
        replyTo: replyTo || config.user,
        subject,
        html,
        text: stripHtml(html),
      });
      console.log("Email sent via Brevo SMTP to:", toEmail);
    } else {
      const senderEmail =
        config.senderEmail || (await resolveApiSenderEmail(config.apiKey));

      const result = await sendViaBrevoApi(
        config.apiKey,
        senderEmail,
        toEmail,
        subject,
        html,
        replyTo
      );
      console.log(
        "Email sent via Brevo API:",
        toEmail,
        result.messageId ? `(id: ${result.messageId})` : ""
      );
      if (isDisposableRecipient(toEmail)) {
        console.log(
          "  → yopmail tip: open https://yopmail.com → inbox name:",
          toEmail.split("@")[0],
          "| If empty, add GMAIL_APP_PASSWORD in .env for direct Gmail delivery"
        );
      }
    }
    return { sent: true, emailSent: true };
  } catch (error) {
    console.error("Brevo error:", error.message);

    const reason = `Failed to send email: ${error.message}. ${BREVO_SETUP_HINT}`;

    if (!mustSend) {
      logDevEmailFallback(toEmail, subject, error.message, devExtraLines);
      return { devMode: true, emailSent: false };
    }

    const err = new Error(reason);
    err.statusCode = 502;
    throw err;
  }
}

function buildResetEmailHtml(resetUrl) {
  return `
    <div style="font-family: sans-serif; max-width: 480px;">
      <h2>Password reset</h2>
      <p>You requested to reset your admin panel password.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">Reset password</a></p>
      <p>Or copy this link:</p>
      <p style="word-break:break-all;color:#555;">${resetUrl}</p>
      <p style="color:#888;font-size:14px;">This link expires in 1 hour. If you did not request this, ignore this email.</p>
    </div>
  `;
}

function getInquiryNotifyEmail() {
  return (
    process.env.INQUIRY_NOTIFY_EMAIL?.trim() || "volumedaytrader@yopmail.com"
  );
}

function buildInquiryAdminHtml(inquiry) {
  const fullName = `${inquiry.firstName} ${inquiry.lastName}`;
  return `
    <div style="font-family: sans-serif; max-width: 560px;">
      <h2>New contact inquiry</h2>
      <p><strong>Ticket:</strong> ${inquiry.ticketNumber}</p>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>Phone:</strong> ${inquiry.phone || "-"}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap;color:#333;">${inquiry.message}</p>
    </div>
  `;
}

function buildInquiryConfirmationHtml(inquiry) {
  return `
    <div style="font-family: sans-serif; max-width: 480px;">
      <h2>Thank you for contacting us</h2>
      <p>Your email was successfully received and a ticket has been generated.</p>
      <p><strong>Ticket number:</strong> ${inquiry.ticketNumber}</p>
      <p>Our team will review your message and get back to you soon.</p>
      <p style="color:#888;font-size:14px;">Volume Day Trader</p>
    </div>
  `;
}

async function sendInquiryEmails(inquiry) {
  const notifyEmail = getInquiryNotifyEmail();
  const adminSubject = `New inquiry ${inquiry.ticketNumber} - Volume Day Trader`;
  const userSubject = `Your inquiry ticket ${inquiry.ticketNumber} - Volume Day Trader`;

  const adminResult = await sendHtmlEmail({
    toEmail: notifyEmail,
    subject: adminSubject,
    html: buildInquiryAdminHtml(inquiry),
    replyTo: inquiry.email,
    devExtraLines: [`Ticket: ${inquiry.ticketNumber}`, `From: ${inquiry.email}`],
  });

  const userResult = await sendHtmlEmail({
    toEmail: inquiry.email,
    subject: userSubject,
    html: buildInquiryConfirmationHtml(inquiry),
    replyTo: notifyEmail,
    devExtraLines: [`Ticket: ${inquiry.ticketNumber}`],
  });

  return {
    notifyEmail,
    adminSent: adminResult.emailSent === true,
    userSent: userResult.emailSent === true,
  };
}

async function sendPasswordResetEmail(toEmail, token) {
  const resetUrl = buildResetUrl(toEmail, token);
  const result = await sendHtmlEmail({
    toEmail,
    subject: "Reset your admin password - Volume Day Trader",
    html: buildResetEmailHtml(resetUrl),
    devExtraLines: [resetUrl],
  });

  if (result.devMode) {
    return { devMode: true, resetUrl, emailSent: false };
  }
  return { sent: true, emailSent: true };
}

module.exports = {
  sendPasswordResetEmail,
  sendInquiryEmails,
  buildResetUrl,
};
