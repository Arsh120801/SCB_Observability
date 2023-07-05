//timestamp to readable time
function formatTimestamp(timestamp) {
    var date = new Date(timestamp);
    var options = {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    };
  
    return date.toLocaleString('en-IN', options);
  }
  module.exports = formatTimestamp;