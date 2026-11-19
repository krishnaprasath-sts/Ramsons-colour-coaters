const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

// POST /api/contact or /sendMail
router.post('/', async (req, res) => {
  try {
    const { name, companyname, email, phone, service, message, source } = req.body;

    const cleanName = String(name || '').trim();
    const cleanCompany = String(companyname || '').trim();
    const cleanEmail = String(email || '').trim();
    const cleanPhone = String(phone || '').trim();
    const cleanMessage = String(message || '').trim();

    if (!cleanName || cleanName.length < 2 || !/^[A-Za-z][A-Za-z\s.'-]{1,59}$/.test(cleanName)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid full name.' });
    }

    if (!cleanEmail || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    if (!cleanPhone) {
      return res.status(400).json({ success: false, error: 'Phone number is required.' });
    }

    const normalizedPhone = cleanPhone.replace(/[\s\-()]/g, '').replace(/^(?:\+91|91|0)(?=\d{10}$)/, '');
    if (!/^[6-9]\d{9}$/.test(normalizedPhone) || /^(\d)\1{9}$/.test(normalizedPhone)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid 10-digit mobile number.' });
    }

    if ((source === 'Get a Quote Popup' || source === 'Contact Form') && cleanMessage.length < 10) {
      return res.status(400).json({ success: false, error: 'Please provide at least 10 characters of requirement details.' });
    }

    const fullMessage = service
      ? `[Service: ${service}]${cleanMessage ? ' ' + cleanMessage : ''}`
      : cleanMessage;

    // Save contact / quote enquiry into SQLite database
    const stmt = db.prepare('INSERT INTO contacts (name, companyname, email, phone, message, source) VALUES (?, ?, ?, ?, ?, ?)');
    const info = stmt.run(cleanName, cleanCompany, cleanEmail, cleanPhone, fullMessage, source || 'Contact Form');

    // Send email via nodemailer when SMTP settings are configured
    let emailSent = false;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS.replace(/\s+/g, ''),
          },
        });

        const escapeHtml = (str) =>
          String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

        const enquirySource = source || 'Contact Form';
        const isQuotePopup = enquirySource === 'Get a Quote Popup';
        const enquiryId = Number(info.lastInsertRowid);
        const refCode = `RCC-${String(enquiryId).padStart(4, '0')}`;
        const submittedAt = new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        const waPhone = `91${normalizedPhone}`;
        const replySubject = encodeURIComponent(`Re: Your Powder Coating Enquiry (${refCode}) - Ramson Colour Coaters`);
        const preheaderText = `${cleanName}${cleanCompany ? ` (${cleanCompany})` : ''} | ${cleanPhone}${service ? ` | ${service}` : ''} — ${cleanMessage.substring(0, 90)}`;
        const fontHeading = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
        const fontBody = "'IBM Plex Sans', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

        await transporter.sendMail({
          from: `"Ramson Colour Coaters" <${process.env.SMTP_USER}>`,
          to: process.env.ENQUIRY_RECIPIENT || process.env.SMTP_USER,
          replyTo: cleanEmail,
          subject: `[${refCode}] ${isQuotePopup ? 'Quote Request' : 'Customer Enquiry'} — ${cleanName}${cleanCompany ? ` (${cleanCompany})` : ''}`,
          text: [
            `RAMSON COLOUR COATERS — ${isQuotePopup ? 'QUOTE REQUEST' : 'CUSTOMER ENQUIRY'} (${refCode})`,
            `Received: ${submittedAt} IST`,
            `Source: ${enquirySource}`,
            `==================================================`,
            `Customer Name : ${cleanName}`,
            `Company / Firm: ${cleanCompany || 'Individual'}`,
            `Phone Number  : ${cleanPhone}`,
            `Email Address : ${cleanEmail}`,
            service ? `Service Type  : ${service}` : null,
            `==================================================`,
            `REQUIREMENT DETAILS:`,
            `${cleanMessage || 'N/A'}`,
            `==================================================`,
            `Ramson Colour Coaters | Eachanari, Coimbatore - 641 105`,
          ]
            .filter(Boolean)
            .join('\n'),
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <title>${escapeHtml(refCode)} - Ramson Colour Coaters</title>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
              <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" />
              <style>
                @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
                body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                @media only screen and (max-width: 600px) {
                  .email-shell { padding: 14px 8px !important; }
                  .email-pad { padding-left: 20px !important; padding-right: 20px !important; }
                  .email-title { font-size: 20px !important; }
                  .stack-col { display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
                  .action-btn { display: block !important; text-align: center !important; margin-bottom: 10px !important; }
                }
              </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: ${fontBody}; color: #0F172A; -webkit-font-smoothing: antialiased;">
              <!-- Hidden Inbox Preheader -->
              <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; color: #F1F5F9;">
                ${escapeHtml(preheaderText)}
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="email-shell" style="background-color: #F1F5F9; padding: 36px 16px;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);">

                      <!-- Top Brand Accent Line -->
                      <tr>
                        <td style="height: 4px; background-color: #0369A1; font-size: 0; line-height: 0;">&nbsp;</td>
                      </tr>

                      <!-- Executive Dark Navy Masthead -->
                      <tr>
                        <td class="email-pad" style="background-color: #0F172A; padding: 26px 36px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="vertical-align: middle;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                  <tr>
                                    <td style="width: 40px; height: 40px; background-color: #0369A1; border-radius: 8px; text-align: center; vertical-align: middle; font-family: ${fontHeading}; font-size: 15px; font-weight: 800; color: #FFFFFF; letter-spacing: 0.5px;">
                                      RC
                                    </td>
                                    <td style="padding-left: 14px; vertical-align: middle;">
                                      <div style="font-family: ${fontHeading}; font-size: 15px; font-weight: 800; color: #FFFFFF; letter-spacing: 0.4px; text-transform: uppercase; line-height: 1.2;">
                                        Ramson Colour Coaters
                                      </div>
                                      <div style="font-family: ${fontBody}; font-size: 12px; font-weight: 400; color: #94A3B8; margin-top: 2px;">
                                        Industrial Powder Coating Specialists &bull; Coimbatore
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td align="right" style="vertical-align: middle;">
                                <span style="display: inline-block; background-color: #1E293B; border: 1px solid #334155; color: #38BDF8; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 6px; letter-spacing: 0.5px;">
                                  ${escapeHtml(refCode)}
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Lead Title & Summary Intro -->
                      <tr>
                        <td class="email-pad" style="padding: 32px 36px 24px; border-bottom: 1px solid #E2E8F0;">
                          <div style="font-family: ${fontBody}; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.1px; color: #0369A1; margin-bottom: 8px;">
                            ${escapeHtml(isQuotePopup ? 'New Quote Request' : 'New Website Enquiry')}
                          </div>
                          <h1 class="email-title" style="margin: 0 0 8px; font-family: ${fontHeading}; font-size: 24px; font-weight: 800; color: #020617; letter-spacing: -0.02em; line-height: 1.25;">
                            ${escapeHtml(cleanName)}
                          </h1>
                          <p style="margin: 0; font-family: ${fontBody}; font-size: 14.5px; font-weight: 400; color: #475569; line-height: 1.55;">
                            ${cleanCompany ? `<strong style="color: #0F172A; font-weight: 600;">${escapeHtml(cleanCompany)}</strong> &nbsp;&bull;&nbsp; ` : ''}Submitted on ${escapeHtml(submittedAt)} IST via ${escapeHtml(enquirySource)}.
                          </p>
                        </td>
                      </tr>

                      <!-- Structured Customer Data Sheet -->
                      <tr>
                        <td class="email-pad" style="padding: 26px 36px 8px;">
                          <div style="font-family: ${fontHeading}; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.9px; color: #475569; margin-bottom: 14px;">
                            Lead Information
                          </div>
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse;">
                            <tr>
                              <td style="padding: 12px 0; width: 34%; font-family: ${fontBody}; font-size: 13.5px; font-weight: 500; color: #475569; border-bottom: 1px solid #E2E8F0; vertical-align: top;">
                                Customer Name
                              </td>
                              <td style="padding: 12px 0; font-family: ${fontBody}; font-size: 14.5px; font-weight: 600; color: #020617; border-bottom: 1px solid #E2E8F0; vertical-align: top;">
                                ${escapeHtml(cleanName)}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 12px 0; font-family: ${fontBody}; font-size: 13.5px; font-weight: 500; color: #475569; border-bottom: 1px solid #E2E8F0; vertical-align: top;">
                                Company / Firm
                              </td>
                              <td style="padding: 12px 0; font-family: ${fontBody}; font-size: 14.5px; font-weight: 500; color: #0F172A; border-bottom: 1px solid #E2E8F0; vertical-align: top;">
                                ${escapeHtml(cleanCompany || 'Individual')}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 12px 0; font-family: ${fontBody}; font-size: 13.5px; font-weight: 500; color: #475569; border-bottom: 1px solid #E2E8F0; vertical-align: top;">
                                Mobile Number
                              </td>
                              <td style="padding: 12px 0; font-family: ${fontBody}; font-size: 14.5px; font-weight: 700; border-bottom: 1px solid #E2E8F0; vertical-align: top;">
                                <a href="tel:${escapeHtml(cleanPhone)}" style="color: #0369A1; text-decoration: none;">${escapeHtml(cleanPhone)}</a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 12px 0; font-family: ${fontBody}; font-size: 13.5px; font-weight: 500; color: #475569; border-bottom: 1px solid #E2E8F0; vertical-align: top;">
                                Email Address
                              </td>
                              <td style="padding: 12px 0; font-family: ${fontBody}; font-size: 14.5px; font-weight: 600; border-bottom: 1px solid #E2E8F0; vertical-align: top;">
                                <a href="mailto:${escapeHtml(cleanEmail)}" style="color: #0369A1; text-decoration: none;">${escapeHtml(cleanEmail)}</a>
                              </td>
                            </tr>
                            ${service ? `
                            <tr>
                              <td style="padding: 12px 0; font-family: ${fontBody}; font-size: 13.5px; font-weight: 500; color: #475569; border-bottom: 1px solid #E2E8F0; vertical-align: top;">
                                Coating Service
                              </td>
                              <td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; vertical-align: top;">
                                <span style="display: inline-block; background-color: #E0F2FE; color: #075985; font-family: ${fontBody}; font-size: 13px; font-weight: 700; padding: 4px 10px; border-radius: 6px;">
                                  ${escapeHtml(service)}
                                </span>
                              </td>
                            </tr>` : ''}
                            <tr>
                              <td style="padding: 12px 0; font-family: ${fontBody}; font-size: 13.5px; font-weight: 500; color: #475569; vertical-align: top;">
                                Enquiry Channel
                              </td>
                              <td style="padding: 12px 0; font-family: ${fontBody}; font-size: 14px; font-weight: 500; color: #334155; vertical-align: top;">
                                ${escapeHtml(enquirySource)}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Technical Requirement / Message Block -->
                      <tr>
                        <td class="email-pad" style="padding: 20px 36px 0;">
                          <div style="font-family: ${fontHeading}; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.9px; color: #475569; margin-bottom: 10px;">
                            Component &amp; Coating Requirements
                          </div>
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-left: 3px solid #0369A1; border-radius: 8px;">
                            <tr>
                              <td style="padding: 18px 20px; font-family: ${fontBody}; font-size: 15px; font-weight: 400; line-height: 1.7; color: #0F172A; white-space: pre-wrap;">${escapeHtml(cleanMessage || 'No additional requirement details provided.')}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Touch-Friendly 44px Executive Action Buttons -->
                      <tr>
                        <td class="email-pad" style="padding: 28px 36px 32px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td class="stack-col" style="padding-right: 10px; padding-bottom: 8px;">
                                <a href="tel:${escapeHtml(cleanPhone)}" class="action-btn" style="display: inline-block; background-color: #0369A1; color: #FFFFFF; font-family: ${fontHeading}; font-size: 13.5px; font-weight: 700; text-decoration: none; padding: 13px 22px; border-radius: 8px; letter-spacing: 0.1px;">
                                  Call Customer
                                </a>
                              </td>
                              <td class="stack-col" style="padding-right: 10px; padding-bottom: 8px;">
                                <a href="https://wa.me/${waPhone}" class="action-btn" style="display: inline-block; background-color: #047857; color: #FFFFFF; font-family: ${fontHeading}; font-size: 13.5px; font-weight: 700; text-decoration: none; padding: 13px 22px; border-radius: 8px; letter-spacing: 0.1px;">
                                  WhatsApp Chat
                                </a>
                              </td>
                              <td class="stack-col" style="padding-bottom: 8px;">
                                <a href="mailto:${escapeHtml(cleanEmail)}?subject=${replySubject}" class="action-btn" style="display: inline-block; background-color: #FFFFFF; color: #0F172A; border: 1px solid #CBD5E1; font-family: ${fontHeading}; font-size: 13.5px; font-weight: 700; text-decoration: none; padding: 12px 20px; border-radius: 8px; letter-spacing: 0.1px;">
                                  Reply via Email
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Corporate Footer -->
                      <tr>
                        <td class="email-pad" style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 22px 36px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="font-family: ${fontBody}; font-size: 12px; color: #475569; line-height: 1.65;">
                                <strong style="font-family: ${fontHeading}; color: #0F172A; font-size: 12.5px;">Ramson Colour Coaters</strong><br />
                                No : 1, S.F.NO.9/2C2, Ramachandra Industrial Estate, Eachanari to Madukkarai Road, Coimbatore - 641 105<br />
                                <span style="color: #64748B;">Automated lead notification &bull; Also archived in your Admin Dashboard under Contact Enquiries.</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        });
        emailSent = true;
        console.log(`Enquiry email sent to ${process.env.ENQUIRY_RECIPIENT || process.env.SMTP_USER}`);
      } catch (mailErr) {
        console.warn('Mail send notice (logged to DB anyway):', mailErr.message);
      }
    }

    // Return JSON response when requested via fetch / AJAX
    if (
      (req.headers.accept && req.headers.accept.includes('application/json')) ||
      (req.headers['content-type'] && req.headers['content-type'].includes('application/json'))
    ) {
      return res.json({
        success: true,
        id: Number(info.lastInsertRowid),
        emailSent,
        message: 'Enquiry submitted successfully!',
      });
    }

    // If submitted via standard HTML form post
    res.send('<script>alert("Mail sent"); window.location="/Contact";</script>');
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/contact/all (for viewing enquiries in admin)
router.get('/all', requireAdmin, (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY id DESC').all();
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/contact/:id (for deleting an enquiry in admin)
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid enquiry ID.' });
    }
    const info = db.prepare('DELETE FROM contacts WHERE id = ?').run(id);
    if (info.changes === 0) {
      return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    }
    res.json({ success: true, message: 'Enquiry deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
