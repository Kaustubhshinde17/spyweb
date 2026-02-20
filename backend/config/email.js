const nodemailer = require('nodemailer');

let transporter;

// Create email transporter
const createTransporter = () => {
  if (transporter) return transporter;

  const config = {
    pool: true, // Reuse connections
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
  };

  // Check if using Gmail or custom SMTP
  if (process.env.EMAIL_SERVICE === 'gmail') {
    // Use explicit host/port for Gmail to be more robust
    Object.assign(config, {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Custom SMTP configuration
    Object.assign(config, {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  transporter = nodemailer.createTransport(config);
  return transporter;
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const t = createTransporter();

    const mailOptions = {
      from: `"SPYWEB" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await t.sendMail(mailOptions);
    console.log('✉️  Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
