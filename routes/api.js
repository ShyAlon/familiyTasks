const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');

const serviceAccount = require("../familytasks2017-firebase-adminsdk-tlpmx-82f97e012a");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('this is the api bitch');
});

router.get('/add', function(req, res, next) {
  res.send('adding user');
  const docRef = db.collection('users').doc('alovelace');
  const setAda = docRef.set({
    first: 'Ada',
    last : 'Lovelace',
    born : 1815
  });

});

module.exports = router;
