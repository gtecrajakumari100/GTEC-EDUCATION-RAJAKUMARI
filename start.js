/* Entry point: restore persisted data (if MongoDB is configured), then start the server. */
const path = require('path');
const persistence = require('./persistence');

const DATA_DIR = path.join(__dirname, 'storage');

persistence
  .init({
    dataDir: DATA_DIR,
    uploadDir: path.join(DATA_DIR, 'uploads'),
    dbFile: path.join(DATA_DIR, 'content.json')
  })
  .then(() => require('./server.js'))
  .catch(error => {
    console.error('Startup failed:', error.message);
    process.exit(1);
  });
