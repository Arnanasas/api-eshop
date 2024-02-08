const fs = require('fs');
const path = require('path');

// Function to log errors to a file
function logErrorToFile(PID, error, productData) {
  const logEntry = {
    PID,
    error: error.message, // Logging only the error message to avoid serialization issues
    productData,
    timestamp: new Date().toISOString()
  };

  const logFilePath = path.join(__dirname, 'error_logs.log'); // Changed to .log extension

  // Append the log entry to the file, converting the object to a string
  fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
    if (err) {
      console.error('Failed to log error to file:', err);
    }
  });
}

module.exports = logErrorToFile;