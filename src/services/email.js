const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const { formatDate, analyzeWeatherStats, combineData } = require('../utils/helpers');
const { getWeatherData, getHolidaysData } = require('../services/api');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.SENDER_EMAIL_SUBJECT,
    pass: process.env.APP_PASSWORD_GMAIL
  }
});

async function generateEmailContent(data) {
  const templatePath = path.join(__dirname, '../email_template.html');
  let html = await fs.readFile(templatePath, 'utf8');

  data.forEach(entry => {
    if (entry.times_of_rain_showers?.length === 0) {
      entry.times_of_rain_showers = null; // Normalize empty arrays to null
    }
    if (entry.sky) {
      entry.sky = entry.sky.toLowerCase(); // Ensure consistent casing
    }
  });

  const stats = analyzeWeatherStats(data);
  const rainDays = data.filter(d => d.times_of_rain_showers);
  const holidayDays = data.filter(d => d.is_public_holiday);
  const avgTempFormatted = Math.round(stats.avgTemp); // Round for display

  html = html
    .replace('{{reportDate}}', formatDate(new Date()))
    .replace('{{location}}', data[0].city)
    .replace('{{maxTemp}}', stats.maxTemp)
    .replace('{{minTemp}}', stats.minTemp)
    .replace('{{skyCounts}}', Object.entries(stats.skyCounts)
      .sort(([a], [b]) => a.localeCompare(b)) // Alphabetical sort
      .map(([sky, count]) => `${sky.charAt(0) + sky.slice(1)}: ${count}`)
      .join('<br>'))
    .replace('{{rainShowers}}', rainDays
      .flatMap(d => d.times_of_rain_showers.map(time => `${d.date}: ${time}`))
        .join('<br>'))
    .replace('{{holidaySkies}}', holidayDays);

  return html;
}

async function sendWeatherReport(data, isTest = false) {
  const htmlContent = await generateEmailContent(data);

  // Mail options with dynamic recipient (test vs prod)
  const mailOptions = {
    from: `"Weather Report System" <${process.env.SENDER_EMAIL_SUBJECT}>`,
    to: isTest ? process.env.RECIPENT_TEST_STATIC_EMAIL : process.env.RECIPIENT_EMAIL,
    subject: `Certification | ${process.env.SENDER_EMAIL_SUBJECT} | ${formatDate(new Date())}`,
    html: htmlContent,
    attachments: [{
      filename: 'weather_report.json',
      content: JSON.stringify(data, null, 2) // Pretty-print JSON
    }]
  };

  return transporter.sendMail(mailOptions);
}

async function handleTestEmail() {
  // Use test files instead of live APIs
  const testData = require('../test/weather_report.json');
  const testHolidays = require('../test/public_holidays.json');
  const combined = combineData(testData, testHolidays);
  
  await sendWeatherReport(combined, true);
  console.log(`✅ Test email sent to ${process.env.RECIPENT_TEST_STATIC_EMAIL}`);
}

async function handleProductionEmail() {
  console.log(`Loading live APIs...`);

  try {
    // Parallel API fetches (optimized for speed)
    const [weatherData, holidaysData] = await Promise.all([
      getWeatherData(),
      getHolidaysData()
    ]);

    console.log(`Live data loaded successfully`);
    const combined = combineData(weatherData, holidaysData);

    await sendWeatherReport(combined);
    console.log(`✅ Production email sent to ${process.env.RECIPIENT_EMAIL}`);

  } catch (error) {
    console.error('❌ Error fetching live data:', error.message); // No retries (assume caller handles)
  }
}

module.exports = {
  handleTestEmail,
  handleProductionEmail
};