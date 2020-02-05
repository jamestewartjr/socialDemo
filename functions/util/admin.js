const admin = require('firebase-admin');
const config = require('./config');
const kingdomKeys = require('../../configPriv/socialdemospa-key.json')

admin.initializeApp({
  credential: admin.credential.cert(kingdomKeys),
  databaseURL: config.databaseURL,
  storageBucket: config.storageBucket
});
const db = admin.firestore();

module.exports = {admin, db};