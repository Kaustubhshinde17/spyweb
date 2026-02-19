// Auto-reply email template for contact form submissions
const autoReplyTemplate = (name, message) => {
  const subject = 'Thank You for Contacting SPYWEB';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #0a1628 0%, #1a2a3e 50%, #0a1628 100%);
          padding: 50px 30px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0, 255, 136, 0.03) 50px, rgba(0, 255, 136, 0.03) 51px),
            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0, 255, 136, 0.03) 50px, rgba(0, 255, 136, 0.03) 51px);
          opacity: 0.5;
        }
        .logo {
          font-size: 42px;
          font-weight: 900;
          color: #00ff88;
          text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
          letter-spacing: 6px;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
        }
        .logo-subtitle {
          color: #8ec5fc;
          font-size: 14px;
          letter-spacing: 3px;
          text-transform: uppercase;
          opacity: 0.9;
          position: relative;
          z-index: 1;
        }
        .spider-web {
          font-size: 80px;
          opacity: 0.15;
          color: #00ff88;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .content {
          padding: 40px 30px;
          background: #ffffff;
        }
        .greeting {
          font-size: 24px;
          color: #0a1628;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .message-box {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 20px;
          border-left: 5px solid #00ff88;
          border-radius: 8px;
          margin: 25px 0;
          position: relative;
          overflow: hidden;
        }
        .message-box::before {
          content: '💬';
          position: absolute;
          right: 15px;
          top: 15px;
          font-size: 40px;
          opacity: 0.1;
        }
        .message-box strong {
          color: #0a1628;
          display: block;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .message-text {
          color: #1e3a5f;
          font-style: italic;
          line-height: 1.8;
          background: white;
          padding: 15px;
          border-radius: 6px;
        }
        .cta-button {
          display: inline-block;
          padding: 15px 40px;
          background: linear-gradient(135deg, #00ff88 0%, #00cc6f 100%);
          color: #0a1628;
          text-decoration: none;
          border-radius: 30px;
          font-weight: bold;
          font-size: 16px;
          margin: 25px 0;
          box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
          transition: all 0.3s;
        }
        .contact-info {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 8px;
          margin: 25px 0;
        }
        .contact-item {
          padding: 12px 0;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .contact-item:last-child {
          border-bottom: none;
        }
        .contact-icon {
          font-size: 20px;
        }
        .footer {
          background: linear-gradient(135deg, #1a2a3e 0%, #0a1628 100%);
          color: #8ec5fc;
          padding: 30px;
          text-align: center;
          font-size: 12px;
        }
        .footer-logo {
          font-size: 24px;
          font-weight: 900;
          color: #00ff88;
          letter-spacing: 4px;
          margin-bottom: 15px;
        }
        .divider {
          height: 3px;
          background: linear-gradient(90deg, transparent, #00ff88, transparent);
          margin: 20px 0;
        }
        .highlight {
          color: #00ff88;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header with Logo -->
        <div class="header">
          <div class="spider-web">🕸️</div>
          <div class="logo">SPYWEB</div>
          <div class="logo-subtitle">Digital Fortress</div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
          <h1 class="greeting">Hi ${name}! 👋</h1>
          
          <p style="font-size: 16px; color: #4a5568; margin-bottom: 20px;">
            Thank you for reaching out to <span class="highlight">SPYWEB</span>!
          </p>
          
          <p style="font-size: 15px; color: #4a5568; margin-bottom: 20px;">
            We've successfully received your message and our expert team will review it shortly. 
            We typically respond within <strong style="color: #00ff88;">24 hours</strong> during business days.
          </p>
          
          <div class="divider"></div>
          
          <!-- User's Message -->
          <div class="message-box">
            <strong>📝 Your Message:</strong>
            <div class="message-text">
              "${message.substring(0, 250)}${message.length > 250 ? '...' : ''}"
            </div>
          </div>
          
          <p style="font-size: 15px; color: #4a5568; margin: 25px 0;">
            In the meantime, feel free to explore our cutting-edge solutions and portfolio:
          </p>
          
          <center>
            <a href="http://localhost:8080" class="cta-button">🌐 Visit Our Website</a>
          </center>
          
          <!-- Contact Information -->
          <div class="contact-info">
            <h3 style="color: #0a1628; margin-bottom: 15px; font-size: 16px;">
              📞 Need Immediate Assistance?
            </h3>
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <span><strong>Email:</strong> abhisudame1@gmail.com</span>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📱</span>
              <span><strong>Phone:</strong> +91 983413554</span>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📍</span>
              <span><strong>Location:</strong> Pune, Maharashtra, India</span>
            </div>
          </div>
          
          <p style="font-size: 14px; color: #718096; margin-top: 30px; text-align: center;">
            We look forward to collaborating with you! 🚀
          </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <div class="footer-logo">SPYWEB</div>
          <p style="margin: 10px 0;">
            <strong>Digital Technology Solutions</strong>
          </p>
          <p style="margin: 5px 0; opacity: 0.8;">
            301, Datta Residency, Susgoan, Pune, 411021
          </p>
          <div style="margin: 20px auto; width: 60%; height: 1px; background: rgba(142, 197, 252, 0.3);"></div>
          <p style="font-size: 11px; opacity: 0.6; margin-top: 15px;">
            This is an automated message. Please do not reply directly to this email.
          </p>
          <p style="font-size: 11px; opacity: 0.6; margin-top: 5px;">
            © ${new Date().getFullYear()} SPYWEB. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
};

// Notification email for admin when new contact is received
const adminNotificationTemplate = (name, email, message) => {
  const subject = `🔔 New Contact: ${name}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #f4f4f4;
        }
        .container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .alert-header {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #1f2937;
          padding: 25px;
          text-align: center;
        }
        .alert-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px;
        }
        .info-grid {
          background: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .info-row {
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 15px;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #4b5563;
        }
        .info-value {
          color: #1f2937;
        }
        .message-box {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .action-button {
          display: inline-block;
          padding: 12px 30px;
          background: #00ff88;
          color: #0a1628;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="alert-header">
          <div class="alert-icon">🔔</div>
          <h2 style="margin: 0;">New Contact Form Submission</h2>
        </div>
        
        <div class="content">
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">👤 Name:</span>
              <span class="info-value"><strong>${name}</strong></span>
            </div>
            <div class="info-row">
              <span class="info-label">📧 Email:</span>
              <span class="info-value"><a href="mailto:${email}">${email}</a></span>
            </div>
            <div class="info-row">
              <span class="info-label">⏰ Submitted:</span>
              <span class="info-value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
            </div>
          </div>
          
          <div class="message-box">
            <strong style="display: block; margin-bottom: 10px; color: #1e40af;">📝 Message:</strong>
            <p style="margin: 0; color: #1f2937; white-space: pre-wrap;">${message}</p>
          </div>
          
          <center>
            <a href="http://localhost:8080/admin/contacts" class="action-button">
              🎯 View in Admin Panel
            </a>
          </center>
          
          <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 25px;">
            💡 Respond promptly to maintain excellent customer service!
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
};

// Email template for admin reply to support ticket
const supportReplyTemplate = (name, ticketSubject, replyContent) => {
  const subject = `Update on Ticket: ${ticketSubject}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4; }
        .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #0a1628 0%, #1a2a3e 100%); color: #00ff88; padding: 25px; text-align: center; }
        .content { padding: 30px; }
        .message-box { background: #f0fdf4; border-left: 4px solid #00ff88; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #6b7280; padding: 20px; background: #f9fafb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Support Ticket Update</h2>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Our team has replied to your ticket: <strong>${ticketSubject}</strong></p>
          
          <div class="message-box">
            <strong>Admin Reply:</strong>
            <p style="white-space: pre-wrap;">${replyContent}</p>
          </div>
          
          <p>You can view the full conversation in your <a href="http://localhost:8080/client/support">Client Dashboard</a>.</p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} SPYWEB. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  return { subject, html };
};

module.exports = {
  autoReplyTemplate,
  adminNotificationTemplate,
  supportReplyTemplate,
};
