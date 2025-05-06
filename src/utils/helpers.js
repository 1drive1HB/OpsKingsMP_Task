
function formatDate(date) {
  const d = new Date(date);
  d.setHours(d.getHours()); 
  return d.toISOString().replace('T', ' ').slice(0, 19); 
}

function combineData(weatherData, holidaysData) {
  if (!Array.isArray(weatherData)) return [];

  const holidays = Array.isArray(holidaysData) ? holidaysData : [];

  return weatherData
    .filter(day => {
      if (day.city?.toLowerCase() !== 'san francisco') { 
        console.warn(`Skipping entry due to unexpected city: "${day.city}"`);
        return false;
      }
      return true;
    })
    .map(day => {
      const isHoliday = holidays.find(h => h.date === day.date)?.is_public_holiday === 'yes';

      return {
        sky: (day.sky || ''), // Normalized
        city: day.city,
        date: day.date,
        degrees_in_celsius: Number(day.degrees_in_celsius ?? day.degrees ?? 0), 
        is_public_holiday: isHoliday,
        times_of_rain_showers: Array.isArray(day.times_of_rain_showers)
          ? (day.times_of_rain_showers.length === 0 ? null : day.times_of_rain_showers)
          : processRainTimes(day.times_of_rain_showers) // String → array
      };
    });
}


function processRainTimes(rainString) { // fix for arrays []
  if (!rainString || typeof rainString !== 'string') return [];
  return rainString.split(',').map(time => time.trim()).filter(Boolean);
}

function analyzeWeatherStats(data) {
  if (!Array.isArray(data)) {
    return {
      maxTemp: 0,
      minTemp: 0,
      avgTemp: 0,
      skyCounts: {}
    };
  }

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

  data.forEach(d => {
    if (d.sky) {
      const key = d.sky.toLowerCase();
      stats.skyCounts[key] = (stats.skyCounts[key] || 0) + 1;
    }
  });

  return stats;
}
module.exports = {
  formatDate,
  processRainTimes,
  analyzeWeatherStats,
  combineData
};