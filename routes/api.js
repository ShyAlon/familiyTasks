const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('this is the api bitch');
});


module.exports = router;
