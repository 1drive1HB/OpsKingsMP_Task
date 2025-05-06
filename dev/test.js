require('dotenv').config({ path: '../.env' }); // Point to the .env in parent directory
const nodemailer = require('nodemailer');

async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD_GMAIL,
      },
    });

    const mailOptions = {
      from: `"${process.env.APP_NAME_GMAIL}" <${process.env.SENDER_EMAIL}>`,
      to: process.env.RECIPIENT_TEST_STATIC_EMAIL,
      subject: 'Test Email from OpsKingsMP_Task',
      text: 'This is a test email sent from your test.js script using the .env configuration.',
      html: '<p>This is a <b>test email</b> sent from your <i>test.js</i> script using the <code>.env</code> configuration.</p>',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendTestEmail();