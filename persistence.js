/*
 * Optional MongoDB persistence for hosts with an ephemeral filesystem (e.g. Render free plan).
 *
 * If MONGODB_URI is NOT set, everything stays on local disk exactly as before.
 * If MONGODB_URI IS set, content.json and uploaded images are copied to MongoDB on every
 * change, and restored into ./storage when the server starts.
 */
const fs = require('fs');
const path = require('path');

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'gtec';

let client = null;
let database = null;
let ready = false;
let pendingContent = null;
let flushing = false;

const log = (...a) => console.log('[persistence]', ...a);
const warn = (...a) => console.error('[persistence]', ...a);

async function init({ dataDir, uploadDir, dbFile }) {
  if (!URI) {
    log('MONGODB_URI not set: using local disk only (data is lost if the host wipes its disk).');
    return;
  }
  const { MongoClient } = require('mongodb');
  client = new MongoClient(URI, { serverSelectionTimeoutMS: 20000 });
  // If this fails we throw on purpose: starting with empty data could overwrite the real data later.
  await client.connect();
  database = client.db(DB_NAME);
  fs.mkdirSync(uploadDir, { recursive: true });

  const content = await database.collection('content').findOne({ _id: 'main' });
  if (content && typeof content.json === 'string') {
    fs.writeFileSync(dbFile, content.json);
    log('Restored content.json from MongoDB.');
  } else if (fs.existsSync(dbFile)) {
    await database.collection('content').replaceOne(
      { _id: 'main' },
      { _id: 'main', json: fs.readFileSync(dbFile, 'utf8'), updatedAt: new Date() },
      { upsert: true }
    );
    log('MongoDB was empty: copied local content.json into it.');
  }

  let restored = 0;
  const cursor = database.collection('uploads').find({});
  for await (const doc of cursor) {
    if (!/^[a-f0-9-]+\.(png|jpg|webp)$/.test(String(doc._id))) continue;
    const raw = doc.data && doc.data.buffer ? doc.data.buffer : doc.data;
    fs.writeFileSync(path.join(uploadDir, String(doc._id)), Buffer.from(raw), { mode: 0o600 });
    restored++;
  }
  log(`Restored ${restored} uploaded image(s) from MongoDB.`);

  // Copy any local uploads that MongoDB does not have yet (first-time migration).
  const known = new Set(
    (await database.collection('uploads').find({}, { projection: { _id: 1 } }).toArray()).map(d => String(d._id))
  );
  for (const name of fs.readdirSync(uploadDir)) {
    if (known.has(name) || !/^[a-f0-9-]+\.(png|jpg|webp)$/.test(name)) continue;
    await database.collection('uploads').replaceOne(
      { _id: name },
      { _id: name, data: fs.readFileSync(path.join(uploadDir, name)), createdAt: new Date() },
      { upsert: true }
    );
  }
  ready = true;
}

function flushContent() {
  if (flushing) return;
  flushing = true;
  (async () => {
    while (pendingContent !== null) {
      const json = pendingContent;
      pendingContent = null;
      try {
        await database.collection('content').replaceOne(
          { _id: 'main' },
          { _id: 'main', json, updatedAt: new Date() },
          { upsert: true }
        );
      } catch (e) {
        warn('Could not save content to MongoDB:', e.message);
      }
    }
    flushing = false;
  })();
}

function saveContent(jsonText) {
  if (!ready) return;
  pendingContent = jsonText;
  flushContent();
}

function saveUpload(name, bytes) {
  if (!ready) return;
  database.collection('uploads')
    .replaceOne({ _id: name }, { _id: name, data: bytes, createdAt: new Date() }, { upsert: true })
    .catch(e => warn('Could not save image to MongoDB:', e.message));
}

function deleteUpload(name) {
  if (!ready) return;
  database.collection('uploads').deleteOne({ _id: name })
    .catch(e => warn('Could not delete image from MongoDB:', e.message));
}

module.exports = { init, saveContent, saveUpload, deleteUpload };
