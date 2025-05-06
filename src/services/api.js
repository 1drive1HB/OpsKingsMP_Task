// api.js
const axios = require('axios');
require('dotenv').config();

async function fetchWithRetry(url, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      // Log attempt for debugging (helps trace failures)
      console.log(`→ Attempt ${attempt + 1}: Fetching ${url}`);
      
      const res = await axios.get(url);
      
      // Success log with status (quick verification)
      console.log(`✓ Success [Status ${res.status}]`);
      return res.data;

    } catch (err) {
      attempt++;
      
      // Throw only after final retry to avoid silent failures
      if (attempt === maxRetries) {
        throw new Error(`API request failed after ${maxRetries} attempts: ${err.message}`);
      }
      
      // Warn + delay before retry (avoids hammering the API)
      console.warn(`⚠️ Retrying... (${err.message})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Backoff: 1s, 2s, 3s...
    }
  }
}

// Export specific API calls (avoids exposing raw fetchWithRetry)
module.exports = {
  getWeatherData: () => fetchWithRetry(process.env.WEATHER_API),  // Uses env for flexibility
  getHolidaysData: () => fetchWithRetry(process.env.HOLIDAYS_API) // Same pattern for other APIs
};