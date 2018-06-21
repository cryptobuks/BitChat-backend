const express = require('express');
const neo4j = require('neo4j-driver').v1;
var router = express.Router();

//****************************MONGO_DB HANDLING **************************************************************
//GET Mongo DB
router.get('/', getGrupuri, getUseri, renderIndex);

//GET mongoDb cercuri
function getGrupuri(req, res, next) {
  req.db.collection('grupuri').find().toArray(function (err, results) {
    console.log(results);
    req.cercuri = results;
    return next();
  });
}

//GET useri
function getUseri(req, res, next) {
  req.db.collection('useri').find().toArray(function (err, results) {
    console.log(results);
    req.instructori = results;
    return next();
  });
}

//Render all fetched on the main page
function renderIndex(req, res) {
  res.render('pages/index', {
    useri: req.useri,
    grupuri: req.grupuri
  })
}
module.exports = router;