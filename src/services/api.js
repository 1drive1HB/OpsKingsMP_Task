// api.js
const axios = require('axios');
require('dotenv').config();

async function fetchWithRetry(url, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {      
      const res = await axios.get(url);
      
      return res.data;

    } catch (err) {
      attempt++;
      
      if (attempt === maxRetries) {
        throw new Error(`API request failed after ${maxRetries} attempts: ${err.message}`);
      }
    }
  }
}

module.exports = {
  getWeatherData: () => fetchWithRetry(process.env.WEATHER_API), 
  getHolidaysData: () => fetchWithRetry(process.env.HOLIDAYS_API) 
};