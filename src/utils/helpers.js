// helpers.js

function formatDate(date) {
  const d = new Date(date);
  d.setHours(d.getHours() + 2); // Temporary UTC+2 adjustment (demo only)
  return d.toISOString().replace('T', ' ').slice(0, 19); // "YYYY-MM-DD HH:MM:SS"
}

// Converts "09:00, 14:00" → ["09:00", "14:00"] (handles empty/malformed input)
function processRainTimes(rainString) {
  if (!rainString || typeof rainString !== 'string') return [];
  return rainString.split(',').map(time => time.trim()).filter(Boolean);
}

// Generates stats from weather data (ignores invalid entries)
function analyzeWeatherStats(data) {
  if (!Array.isArray(data)) {
    return {
      maxTemp: 0,
      minTemp: 0,
      avgTemp: 0,
      skyCounts: {}
    };
  }

  // Handles both 'degrees_in_celsius' and 'degrees' fields
  const temps = data.map(d => {
    const temp = Number(d.degrees_in_celsius) || Number(d.degrees);
    return (!isNaN(temp) && temp !== null) ? temp : null;
  }).filter(t => t !== null);

  if (temps.length === 0) {
    return {
      maxTemp: 0,
      minTemp: 0,
      avgTemp: 0,
      skyCounts: {}
    };
  }

  const stats = {
    maxTemp: Math.max(...temps),
    minTemp: Math.min(...temps),
    avgTemp: temps.reduce((sum, t) => sum + t, 0) / temps.length || 0,
    skyCounts: {}
  };

  // Case-insensitive sky condition counting
  data.forEach(d => {
    if (d.sky) {
      const key = d.sky.toLowerCase();
      stats.skyCounts[key] = (stats.skyCounts[key] || 0) + 1;
    }
  });

  return stats;
}

// Merges weather + holiday data (filters non-SF entries)
function combineData(weatherData, holidaysData) {
  if (!Array.isArray(weatherData)) return [];

  const holidays = Array.isArray(holidaysData) ? holidaysData : [];

  return weatherData
    .filter(day => {
      if (day.city?.toLowerCase() !== 'san francisco') { // fix for San Francisco
        console.warn(`Skipping entry due to unexpected city: "${day.city}"`);
        return false;
      }
      return true;
    })
    .map(day => {
      const isHoliday = holidays.find(h => h.date === day.date)?.is_public_holiday === 'yes';

      return {
        sky: (day.sky || '').toLowerCase(), // Normalized
        city: day.city,
        date: day.date,
        degrees: Number(day.degrees_in_celsius ?? day.degrees ?? 0), // Fallback chain
        is_public_holiday: isHoliday,
        times_of_rain_showers: Array.isArray(day.times_of_rain_showers)
          ? (day.times_of_rain_showers.length === 0 ? null : day.times_of_rain_showers) // Empty → null
          : processRainTimes(day.times_of_rain_showers) // String → array
      };
    });
}

module.exports = {
  formatDate,
  processRainTimes,
  analyzeWeatherStats,
  combineData
};