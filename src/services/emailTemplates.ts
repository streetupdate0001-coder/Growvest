/**
 * GROWVEST Institutional Wealth & Security
 * Bulletproof Responsive HTML Email Templates for Authentication Processes
 * 
 * Supports:
 * 1. Welcome & Account Activation ('welcome')
 * 2. Cryptographic Password Reset ('password_reset')
 * 3. New Device / Location Login Alert ('login_alert')
 * 
 * Compliant with:
 * - RFC 5322 & HTML Email standards
 * - Responsive breakpoints for Desktop (600px+), Tablet, and Mobile (<600px)
 * - Dark mode client compatibility via @media (prefers-color-scheme: dark)
 * - MSO / Outlook table safety conditionals
 * - High accessibility (contrast AA+, alt tags, semantic layout tables)
 */

export interface WelcomeEmailData {
  recipientName: string;
  recipientEmail: string;
  verificationCode: string;
  verificationUrl: string;
  accountTier?: string;
  antiPhishingCode?: string;
  expiryMinutes?: number;
}

export interface PasswordResetEmailData {
  recipientName: string;
  recipientEmail: string;
  resetUrl: string;
  resetCode: string;
  ipAddress: string;
  location: string;
  device: string;
  requestTimestamp: string;
  expiryMinutes?: number;
  antiPhishingCode?: string;
  freezeAccountUrl?: string;
}

export interface LoginAlertEmailData {
  recipientName: string;
  recipientEmail: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  loginTimestamp: string;
  authMethod: string;
  confirmDeviceUrl?: string;
  freezeAccountUrl?: string;
  antiPhishingCode?: string;
}

export interface EmailTemplateOutput {
  id: string;
  name: string;
  category: 'authentication' | 'security' | 'onboarding';
  subject: string;
  preheader: string;
  fromName: string;
  fromEmail: string;
  html: string;
  plainText: string;
}

// Common Shared Styles and Boilerplate
const EMAIL_CSS_RESET = `
  <style type="text/css">
    /* Base Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; display: block; }
    body { margin: 0; padding: 0; width: 100% !important; min-width: 100%; height: 100% !important; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    
    /* Hover Effects */
    .btn-primary:hover { background-color: #059669 !important; border-color: #059669 !important; }
    .btn-danger:hover { background-color: #dc2626 !important; border-color: #dc2626 !important; }
    .btn-secondary:hover { background-color: #e2e8f0 !important; color: #0f172a !important; }
    .link-hover:hover { text-decoration: underline !important; color: #059669 !important; }

    /* Responsive Mobile Media Queries */
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-center { text-align: center !important; }
      .mobile-hide { display: none !important; }
      .mobile-full-btn { width: 100% !important; display: block !important; box-sizing: border-box !important; }
      .code-display { font-size: 24px !important; letter-spacing: 4px !important; padding: 12px !important; }
      .telemetry-cell { display: block !important; width: 100% !important; padding-bottom: 8px !important; }
      .footer-links td { display: block !important; text-align: center !important; padding: 6px 0 !important; }
    }

    /* Dark Mode Email Client Support (Apple Mail, iOS, Outlook app, Android) */
    @media (prefers-color-scheme: dark) {
      body, .email-body { background-color: #0b1120 !important; }
      .dark-bg { background-color: #0b1120 !important; }
      .dark-card { background-color: #131d31 !important; border-color: #1e293b !important; }
      .dark-inner-card { background-color: #0d1527 !important; border-color: #1e293b !important; }
      .dark-text-primary { color: #f8fafc !important; }
      .dark-text-secondary { color: #94a3b8 !important; }
      .dark-text-muted { color: #64748b !important; }
      .dark-border { border-color: #1e293b !important; }
      .dark-code-box { background-color: #064e3b !important; color: #6ee7b7 !important; border-color: #059669 !important; }
      .dark-badge-green { background-color: rgba(16, 185, 129, 0.15) !important; color: #34d399 !important; border-color: rgba(16, 185, 129, 0.3) !important; }
      .dark-badge-red { background-color: rgba(239, 68, 68, 0.15) !important; color: #f87171 !important; border-color: rgba(239, 68, 68, 0.3) !important; }
      .dark-badge-amber { background-color: rgba(245, 158, 11, 0.15) !important; color: #fbbf24 !important; border-color: rgba(245, 158, 11, 0.3) !important; }
      .dark-footer { background-color: #090e1a !important; border-color: #1e293b !important; }
    }
  </style>
`;

/**
 * Common Header with Logo, Swiss Enclave badge, and Anti-Phishing Code
 */
function renderEmailHeader(antiPhishingCode?: string, badgeText: string = 'FINTECH ENCLAVE'): string {
  return `
    <!-- Header -->
    <tr>
      <td style="padding: 32px 32px 24px 32px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;" class="dark-card mobile-padding">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="left" valign="middle">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #10b981; border-radius: 8px; width: 36px; height: 36px; text-align: center; vertical-align: middle;">
                    <span style="color: #ffffff; font-family: 'Courier New', Courier, monospace; font-size: 18px; font-weight: 800; line-height: 36px;">G</span>
                  </td>
                  <td style="padding-left: 12px;">
                    <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 800; letter-spacing: -0.5px; color: #0f172a; display: block;" class="dark-text-primary">GROWVEST</span>
                    <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1px; color: #10b981; text-transform: uppercase; display: block;">Institutional Wealth</span>
                  </td>
                </tr>
              </table>
            </td>
            <td align="right" valign="middle">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 4px 10px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 700; color: #065f46;" class="dark-badge-green">
                    ${badgeText}
                  </td>
                </tr>
                ${antiPhishingCode ? `
                <tr>
                  <td align="right" style="padding-top: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; color: #64748b;" class="dark-text-muted">
                    Anti-Phishing: <strong style="color: #0f172a;" class="dark-text-primary">${antiPhishingCode}</strong>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

/**
 * Common Institutional Regulatory Footer
 */
function renderEmailFooter(recipientEmail: string): string {
  return `
    <!-- Footer -->
    <tr>
      <td style="padding: 32px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;" class="dark-footer mobile-padding">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <!-- Security Dispatch Notice -->
          <tr>
            <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; line-height: 17px; color: #64748b; padding-bottom: 16px;" class="dark-text-muted">
              <strong>Automated Security Communication:</strong> This email was dispatched to <a href="mailto:${recipientEmail}" style="color: #059669; text-decoration: none;">${recipientEmail}</a> from Growvest Core Security Infrastructure. If you did not initiate this request, please contact our 24/7 Institutional Desk immediately.
            </td>
          </tr>

          <!-- Certifications & Badges -->
          <tr>
            <td style="padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;" class="dark-border">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #94a3b8;">
                    <span style="display: inline-block; margin-right: 12px;">🛡️ SOC-2 TYPE II</span>
                    <span style="display: inline-block; margin-right: 12px;">🔒 AES-256 HSM CUSTODY</span>
                    <span style="display: inline-block;">⚖️ FINMA COMPLIANT</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Navigation Links & Address -->
          <tr>
            <td style="padding-top: 20px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr class="footer-links">
                  <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #64748b;" class="dark-text-muted">
                    <a href="https://growvest.com/security" style="color: #64748b; text-decoration: none; margin-right: 14px;" class="link-hover dark-text-muted">Security Center</a>
                    <a href="https://growvest.com/transparency" style="color: #64748b; text-decoration: none; margin-right: 14px;" class="link-hover dark-text-muted">Transparency Center</a>
                    <a href="https://growvest.com/privacy" style="color: #64748b; text-decoration: none; margin-right: 14px;" class="link-hover dark-text-muted">Privacy Policy</a>
                    <a href="https://growvest.com/support" style="color: #64748b; text-decoration: none;" class="link-hover dark-text-muted">24/7 Support Desk</a>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; line-height: 16px; color: #94a3b8; padding-top: 14px;" class="dark-text-muted">
                    © ${new Date().getFullYear()} GrowvestX Ltd. Office Address: 200 Aldersgate St, Barbican, London EC14 4HD, United Kingdom. Email: support@growvestx.com Phone: +44 7900 413315 Company Reg NO: 14892018 We are Registered in England & Wales.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

/**
 * 1. WELCOME EMAIL TEMPLATE
 * Designed for user onboarding, account activation, KYC guidance, and security setup.
 */
export function generateWelcomeEmail(data: WelcomeEmailData): EmailTemplateOutput {
  const {
    recipientName = 'Alexander Vance',
    recipientEmail = 'alexander.vance@institutional-wealth.ch',
    verificationCode = '849-201',
    verificationUrl = 'https://greeneza.com/auth/verify?token=gz_wtk_948291048201',
    accountTier = 'Level 1: Standard Institutional',
    antiPhishingCode = 'GZ-VANCE-88',
    expiryMinutes = 60
  } = data;

  const subject = `Welcome to Growvest — Confirm Your Account Verification Code (${verificationCode})`;
  const preheader = `Welcome to Growvest Institutional Wealth. Use code ${verificationCode} to verify your identity and activate your secure digital vault.`;

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${subject}</title>
  ${EMAIL_CSS_RESET}
</head>
<body class="email-body" style="margin: 0; padding: 0; background-color: #f8fafc; -webkit-font-smoothing: antialiased;">
  <!-- Preheader text (hidden preview) -->
  <div style="display: none; font-size: 1px; color: #f8fafc; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;" class="dark-bg">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
            <td>
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);" class="email-container dark-card">
          
          ${renderEmailHeader(antiPhishingCode, 'ONBOARDING ENCLAVE')}

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                
                <!-- Status Badge -->
                <tr>
                  <td align="left" style="padding-bottom: 16px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 4px 12px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 100px; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; color: #065f46;" class="dark-badge-green">
                          ✓ ACCOUNT CREATED • PENDING EMAIL VERIFICATION
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Greeting Headline -->
                <tr>
                  <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 800; line-height: 32px; color: #0f172a; padding-bottom: 12px;" class="dark-text-primary">
                    Welcome to Growvest, ${recipientName}
                  </td>
                </tr>

                <!-- Narrative Paragraph -->
                <tr>
                  <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 22px; color: #334155; padding-bottom: 24px;" class="dark-text-secondary">
                    Your institutional digital wealth workspace has been provisioned under <strong>${accountTier}</strong>. To complete regulatory verification and unlock your segregated cold-storage vault balances, please confirm your email address using the code or activation button below.
                  </td>
                </tr>

                <!-- Verification Code Box -->
                <tr>
                  <td align="center" style="padding: 0 0 28px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0fdf4; border: 2px dashed #86efac; border-radius: 12px;" class="dark-code-box">
                      <tr>
                        <td align="center" style="padding: 20px 16px;">
                          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #166534; display: block; margin-bottom: 8px;">
                            6-Digit Verification Token
                          </span>
                          <span class="code-display" style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #047857; display: block;">
                            ${verificationCode}
                          </span>
                          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #15803d; display: block; margin-top: 8px;">
                            ⏱️ Valid for ${expiryMinutes} minutes • Single-use cryptographic token
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Primary CTA Button -->
                <tr>
                  <td align="center" style="padding-bottom: 28px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center">
                          <!--[if (gte mso 9)|(IE)]>
                          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${verificationUrl}" style="height:48px;v-text-anchor:middle;width:280px;" arcsize="20%" stroke="f" fillcolor="#10b981">
                            <w:anchorlock/>
                            <center>
                          <![endif]-->
                          <a href="${verificationUrl}" target="_blank" class="btn-primary mobile-full-btn" style="background-color: #10b981; border: 1px solid #10b981; border-radius: 10px; color: #ffffff; display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 700; line-height: 48px; text-align: center; text-decoration: none; width: 280px; -webkit-text-size-adjust: none; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);">
                            Verify Email & Activate Account →
                          </a>
                          <!--[if (gte mso 9)|(IE)]>
                            </center>
                          </v:roundrect>
                          <![endif]-->
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Fallback Link -->
                <tr>
                  <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 18px; color: #64748b; padding-bottom: 28px; border-bottom: 1px solid #e2e8f0;" class="dark-border dark-text-muted">
                    If the button does not open directly, copy and paste this secure URL into your browser:<br />
                    <span style="font-family: 'Courier New', Courier, monospace; color: #059669; word-break: break-all;">${verificationUrl}</span>
                  </td>
                </tr>

                <!-- Institutional Security Starter Checklist -->
                <tr>
                  <td style="padding-top: 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; color: #0f172a; padding-bottom: 12px;" class="dark-text-primary">
                          Recommended Institutional Security Steps:
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td width="24" valign="top" style="font-size: 14px; line-height: 20px;">1️⃣</td>
                              <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 20px; color: #475569; padding-bottom: 8px;" class="dark-text-secondary">
                                <strong>Activate 2FA Hardware Security:</strong> Pair Google Authenticator or YubiKey hardware tokens in the Security Center.
                              </td>
                            </tr>
                            <tr>
                              <td width="24" valign="top" style="font-size: 14px; line-height: 20px;">2️⃣</td>
                              <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 20px; color: #475569; padding-bottom: 8px;" class="dark-text-secondary">
                                <strong>Configure Inactivity Session Locks:</strong> Set your preferred auto-logout timeout threshold (15m to 4h).
                              </td>
                            </tr>
                            <tr>
                              <td width="24" valign="top" style="font-size: 14px; line-height: 20px;">3️⃣</td>
                              <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 20px; color: #475569;" class="dark-text-secondary">
                                <strong>Whitelist Payout Addresses:</strong> Pre-approve withdrawal IBANs or crypto addresses with 24-hour time-locks.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          ${renderEmailFooter(recipientEmail)}

        </table>
        <!--[if (gte mso 9)|(IE)]>
            </td>
          </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;

  const plainText = `
WELCOME TO GROWVEST INSTITUTIONAL WEALTH
========================================

Hello ${recipientName},

Your institutional workspace has been provisioned under ${accountTier}. To activate your account and access your segregated vault balances, please verify your email address.

YOUR 6-DIGIT VERIFICATION TOKEN:
${verificationCode}
(Valid for ${expiryMinutes} minutes)

OR VERIFY DIRECTLY VIA SECURE LINK:
${verificationUrl}

RECOMMENDED SECURITY ACTIONS:
1. Enable Hardware 2FA in the Security Center
2. Set your session inactivity auto-lock threshold
3. Whitelist verified destination withdrawal addresses

Anti-Phishing Verification Phrase: ${antiPhishingCode}

If you did not create this account, please immediately contact support@growvest.com.

Growvest Financial Technology SA
Gotthardstrasse 26, 8002 Zurich, Switzerland
  `.trim();

  return {
    id: 'welcome',
    name: 'Welcome & Account Activation',
    category: 'onboarding',
    subject,
    preheader,
    fromName: 'Growvest Team',
    fromEmail: 'onboarding@growvest.com',
    html,
    plainText
  };
}

/**
 * 2. PASSWORD RESET EMAIL TEMPLATE
 * Designed for secure cryptographic password resets with telemetry audit and 1-click emergency lock.
 */
export function generatePasswordResetEmail(data: PasswordResetEmailData): EmailTemplateOutput {
  const {
    recipientName = 'Alexander Vance',
    recipientEmail = 'alexander.vance@institutional-wealth.ch',
    resetUrl = 'https://greeneza.com/auth/reset-password?token=gz_rst_839021849102',
    resetCode = 'GZ-RST-9104',
    ipAddress = '194.209.14.88',
    location = 'Zurich, Switzerland',
    device = 'Chrome 128 (macOS Sequoia)',
    requestTimestamp = 'August 17, 2026 at 17:55 UTC',
    expiryMinutes = 15,
    antiPhishingCode = 'GZ-VANCE-88',
    freezeAccountUrl = 'https://greeneza.com/security/emergency-lock?account=alexander.vance'
  } = data;

  const subject = `Security Alert: Password Reset Request for Growvest Account`;
  const preheader = `A password reset was requested for ${recipientEmail}. If this was you, use the link within ${expiryMinutes} minutes. If not, lock your account immediately.`;

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${subject}</title>
  ${EMAIL_CSS_RESET}
</head>
<body class="email-body" style="margin: 0; padding: 0; background-color: #f8fafc; -webkit-font-smoothing: antialiased;">
  <!-- Preheader -->
  <div style="display: none; font-size: 1px; color: #f8fafc; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;" class="dark-bg">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
            <td>
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);" class="email-container dark-card">
          
          ${renderEmailHeader(antiPhishingCode, 'SECURITY ENCLAVE')}

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                
                <!-- Alert Banner -->
                <tr>
                  <td align="left" style="padding-bottom: 16px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 4px 12px; background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 100px; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; color: #92400e;" class="dark-badge-amber">
                          🔒 CRYPTOGRAPHIC PASSWORD RESET REQUEST
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 22px; font-weight: 800; line-height: 30px; color: #0f172a; padding-bottom: 12px;" class="dark-text-primary">
                    Reset Your Growvest Password
                  </td>
                </tr>

                <!-- Narrative -->
                <tr>
                  <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 22px; color: #334155; padding-bottom: 20px;" class="dark-text-secondary">
                    Hello ${recipientName}, we received an authorized request to reset the login credentials for your institutional account (<strong>${recipientEmail}</strong>).
                  </td>
                </tr>

                <!-- Primary CTA Button -->
                <tr>
                  <td align="center" style="padding: 8px 0 24px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center">
                          <!--[if (gte mso 9)|(IE)]>
                          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${resetUrl}" style="height:48px;v-text-anchor:middle;width:280px;" arcsize="20%" stroke="f" fillcolor="#10b981">
                            <w:anchorlock/>
                            <center>
                          <![endif]-->
                          <a href="${resetUrl}" target="_blank" class="btn-primary mobile-full-btn" style="background-color: #10b981; border: 1px solid #10b981; border-radius: 10px; color: #ffffff; display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 700; line-height: 48px; text-align: center; text-decoration: none; width: 280px; -webkit-text-size-adjust: none; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);">
                            Reset Password Securely →
                          </a>
                          <!--[if (gte mso 9)|(IE)]>
                            </center>
                          </v:roundrect>
                          <![endif]-->
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Expiry Note -->
                <tr>
                  <td align="center" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #b45309; padding-bottom: 24px;">
                    ⏰ <strong>Time-Sensitive:</strong> This reset authorization expires in <strong>${expiryMinutes} minutes</strong>.
                  </td>
                </tr>

                <!-- Request Telemetry Audit Box -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;" class="dark-inner-card">
                      <tr>
                        <td style="padding: 16px 20px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td colspan="2" style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;" class="dark-border dark-text-muted">
                                📡 Audit Telemetry Log
                              </td>
                            </tr>
                            <tr>
                              <td class="telemetry-cell" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #64748b; padding-top: 10px;" class="dark-text-muted">
                                Request Timestamp:
                              </td>
                              <td align="right" class="telemetry-cell" style="font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: 600; color: #0f172a; padding-top: 10px;" class="dark-text-primary">
                                ${requestTimestamp}
                              </td>
                            </tr>
                            <tr>
                              <td class="telemetry-cell" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #64748b; padding-top: 6px;" class="dark-text-muted">
                                IP Origin:
                              </td>
                              <td align="right" class="telemetry-cell" style="font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: 600; color: #0f172a; padding-top: 6px;" class="dark-text-primary">
                                ${ipAddress} (${location})
                              </td>
                            </tr>
                            <tr>
                              <td class="telemetry-cell" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #64748b; padding-top: 6px;" class="dark-text-muted">
                                Client Device:
                              </td>
                              <td align="right" class="telemetry-cell" style="font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: 600; color: #0f172a; padding-top: 6px;" class="dark-text-primary">
                                ${device}
                              </td>
                            </tr>
                            <tr>
                              <td class="telemetry-cell" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #64748b; padding-top: 6px;" class="dark-text-muted">
                                Security Checksum:
                              </td>
                              <td align="right" class="telemetry-cell" style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; color: #059669; padding-top: 6px;">
                                ${resetCode}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Emergency Account Freeze Warning -->
                <tr>
                  <td style="padding: 20px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px;" class="dark-badge-red">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; color: #991b1b; padding-bottom: 6px;">
                          ⚠️ Did NOT request this password change?
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 18px; color: #7f1d1d; padding-bottom: 12px;">
                          Your account may be undergoing unauthorized credential probing. Protect your segregated funds by triggering an immediate emergency vault lock.
                        </td>
                      </tr>
                      <tr>
                        <td align="left">
                          <a href="${freezeAccountUrl}" target="_blank" class="btn-danger" style="background-color: #ef4444; border: 1px solid #ef4444; border-radius: 8px; color: #ffffff; display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 700; line-height: 36px; padding: 0 16px; text-align: center; text-decoration: none;">
                            🚨 Freeze & Lock My Account Immediately
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          ${renderEmailFooter(recipientEmail)}

        </table>
        <!--[if (gte mso 9)|(IE)]>
            </td>
          </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;

  const plainText = `
PASSWORD RESET REQUEST — GROWVEST SECURITY
==========================================

Hello ${recipientName},

We received a request to reset your password for ${recipientEmail}.

RESET YOUR PASSWORD (Expires in ${expiryMinutes} minutes):
${resetUrl}

REQUEST AUDIT TELEMETRY:
- Time: ${requestTimestamp}
- IP Address: ${ipAddress} (${location})
- Device: ${device}
- Security Token ID: ${resetCode}

DID NOT REQUEST THIS?
If you did not initiate this reset, your account credentials may be compromised. Lock your account immediately:
${freezeAccountUrl}

Anti-Phishing Verification: ${antiPhishingCode}

Growvest Core Security Infrastructure
Gotthardstrasse 26, 8002 Zurich, Switzerland
  `.trim();

  return {
    id: 'password_reset',
    name: 'Password Reset Notification',
    category: 'security',
    subject,
    preheader,
    fromName: 'Growvest Security Center',
    fromEmail: 'security-alerts@growvest.com',
    html,
    plainText
  };
}

/**
 * 3. NEW LOGIN ALERT EMAIL TEMPLATE
 * Real-time institutional telemetry notification with device info, geolocation, and 1-click confirmation or freeze.
 */
export function generateLoginAlertEmail(data: LoginAlertEmailData): EmailTemplateOutput {
  const {
    recipientName = 'Alexander Vance',
    recipientEmail = 'alexander.vance@institutional-wealth.ch',
    ipAddress = '82.165.197.1',
    location = 'London, Greater London, United Kingdom',
    device = 'Apple iPhone 16 Pro (iOS 19.1)',
    browser = 'Mobile Safari 18.0',
    loginTimestamp = 'August 17, 2026 at 17:54 UTC',
    authMethod = 'Password + Hardware TOTP (2FA)',
    confirmDeviceUrl = 'https://greeneza.com/security/trust-device?session=gz_sess_891048',
    freezeAccountUrl = 'https://greeneza.com/security/freeze-session?session=gz_sess_891048',
    antiPhishingCode = 'GZ-VANCE-88'
  } = data;

  const subject = `Security Alert: New Sign-In to Growvest Account from ${location.split(',')[0]}`;
  const preheader = `A new login was recorded on your account from ${device} in ${location}. If this was not you, lock your vault immediately.`;

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${subject}</title>
  ${EMAIL_CSS_RESET}
</head>
<body class="email-body" style="margin: 0; padding: 0; background-color: #f8fafc; -webkit-font-smoothing: antialiased;">
  <!-- Preheader -->
  <div style="display: none; font-size: 1px; color: #f8fafc; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;" class="dark-bg">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
            <td>
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);" class="email-container dark-card">
          
          ${renderEmailHeader(antiPhishingCode, 'TELEMETRY SENTINEL')}

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                
                <!-- Alert Badge -->
                <tr>
                  <td align="left" style="padding-bottom: 16px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 4px 12px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 100px; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; color: #991b1b;" class="dark-badge-red">
                          🚨 NEW DEVICE / LOCATION LOGIN DETECTED
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 22px; font-weight: 800; line-height: 30px; color: #0f172a; padding-bottom: 12px;" class="dark-text-primary">
                    New Sign-In to Your Account
                  </td>
                </tr>

                <!-- Narrative -->
                <tr>
                  <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 22px; color: #334155; padding-bottom: 24px;" class="dark-text-secondary">
                    Hello ${recipientName}, your Growvest institutional account (<strong>${recipientEmail}</strong>) was accessed from a new device or physical location.
                  </td>
                </tr>

                <!-- Detailed Telemetry Card -->
                <tr>
                  <td style="padding-bottom: 28px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;" class="dark-inner-card">
                      <tr>
                        <td style="padding: 20px 20px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td colspan="2" style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;" class="dark-border dark-text-muted">
                                📍 Session Telemetry Snapshot
                              </td>
                            </tr>
                            <tr>
                              <td class="telemetry-cell" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #64748b; padding-top: 12px;" class="dark-text-muted">
                                Timestamp (UTC):
                              </td>
                              <td align="right" class="telemetry-cell" style="font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: 600; color: #0f172a; padding-top: 12px;" class="dark-text-primary">
                                ${loginTimestamp}
                              </td>
                            </tr>
                            <tr>
                              <td class="telemetry-cell" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #64748b; padding-top: 8px;" class="dark-text-muted">
                                Physical Location:
                              </td>
                              <td align="right" class="telemetry-cell" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 700; color: #0f172a; padding-top: 8px;" class="dark-text-primary">
                                🇬🇧 ${location}
                              </td>
                            </tr>
                            <tr>
                              <td class="telemetry-cell" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #64748b; padding-top: 8px;" class="dark-text-muted">
                                IP Address:
                              </td>
                              <td align="right" class="telemetry-cell" style="font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: 600; color: #059669; padding-top: 8px;">
                                ${ipAddress}
                              </td>
                            </tr>
                            <tr>
                              <td class="telemetry-cell" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #64748b; padding-top: 8px;" class="dark-text-muted">
                                Device & OS:
                              </td>
                              <td align="right" class="telemetry-cell" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 600; color: #0f172a; padding-top: 8px;" class="dark-text-primary">
                                ${device}
                              </td>
                            </tr>
                            <tr>
                              <td class="telemetry-cell" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #64748b; padding-top: 8px;" class="dark-text-muted">
                                Browser Agent:
                              </td>
                              <td align="right" class="telemetry-cell" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 600; color: #0f172a; padding-top: 8px;" class="dark-text-primary">
                                ${browser}
                              </td>
                            </tr>
                            <tr>
                              <td class="telemetry-cell" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #64748b; padding-top: 8px;" class="dark-text-muted">
                                Auth Protocol:
                              </td>
                              <td align="right" class="telemetry-cell" style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; color: #065f46; padding-top: 8px;">
                                🛡️ ${authMethod}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Action Fork (Was this you?) -->
                <tr>
                  <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 700; color: #0f172a; padding-bottom: 14px;" class="dark-text-primary">
                    Was this authorized activity by you?
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Option A: Yes, trust device -->
                        <td width="48%" class="mobile-stack" style="padding-bottom: 10px;">
                          <a href="${confirmDeviceUrl}" target="_blank" class="btn-secondary mobile-full-btn" style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 10px; color: #334155; display: block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; line-height: 44px; text-align: center; text-decoration: none;">
                            ✓ Yes, This Was Me
                          </a>
                        </td>
                        <td width="4%" class="mobile-hide"></td>
                        <!-- Option B: No, freeze account -->
                        <td width="48%" class="mobile-stack" style="padding-bottom: 10px;">
                          <a href="${freezeAccountUrl}" target="_blank" class="btn-danger mobile-full-btn" style="background-color: #ef4444; border: 1px solid #ef4444; border-radius: 10px; color: #ffffff; display: block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; line-height: 44px; text-align: center; text-decoration: none; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);">
                            🚨 No, Secure My Account
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Advisory -->
                <tr>
                  <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 18px; color: #64748b; padding-top: 14px; border-top: 1px solid #e2e8f0;" class="dark-border dark-text-muted">
                    <strong>Institutional Security Note:</strong> If you did not log in from this device, click "No, Secure My Account" to immediately terminate all active sessions, invalidate current JWT tokens, and lock outbound asset withdrawals.
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          ${renderEmailFooter(recipientEmail)}

        </table>
        <!--[if (gte mso 9)|(IE)]>
            </td>
          </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;

  const plainText = `
NEW SIGN-IN DETECTED — GROWVEST SECURITY
========================================

Hello ${recipientName},

A new sign-in was recorded for your account (${recipientEmail}).

LOGIN AUDIT SNAPSHOT:
- Time: ${loginTimestamp}
- Location: ${location}
- IP Address: ${ipAddress}
- Device: ${device}
- Browser: ${browser}
- Auth Protocol: ${authMethod}

WAS THIS YOU?
If YES, you can whitelist this device:
${confirmDeviceUrl}

If NO (UNAUTHORIZED ACCESS):
Lock your account, terminate all sessions, and freeze withdrawals immediately:
${freezeAccountUrl}

Anti-Phishing Verification Phrase: ${antiPhishingCode}

Growvest Security Operations Center
Gotthardstrasse 26, 8002 Zurich, Switzerland
  `.trim();

  return {
    id: 'login_alert',
    name: 'New Login & Device Alert',
    category: 'security',
    subject,
    preheader,
    fromName: 'Growvest Security Telemetry',
    fromEmail: 'telemetry@growvest.com',
    html,
    plainText
  };
}

/**
 * Registry of all available Authentication Email Templates
 */
export const AUTH_EMAIL_TEMPLATES = {
  welcome: generateWelcomeEmail,
  password_reset: generatePasswordResetEmail,
  login_alert: generateLoginAlertEmail
};
