const express = require('express');
const router = express.Router();
const SFConnection = require('../SFConnection');
const jsforce = require('jsforce');
const conn = SFConnection.conn;
const isAuthenticated = SFConnection.isAuthenticated;

router.get('/accounts', isAuthenticated, function(req, res){
    conn.sobject("Account")
  .find(
    // conditions in JSON object
    { Name : { $like : '%a%' } },
    // fields in JSON object
    { Id: 1,
      Name: 1,
      CreatedDate: 1 }
  )
  .sort({ CreatedDate: -1, Name : 1 })
  .limit(5)
  .skip(10)
  .execute(function(err, records) {
    if (err) { return console.error(err); }
    console.log("fetched : " + records.length);
    res.send(records);
  });
});

module.exports = router;