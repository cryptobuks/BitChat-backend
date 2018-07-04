const express = require('express');
var router = express.Router();

router.get('/', getGrupuri, getUseri, renderIndex);

//GET grupuri
function getGrupuri(req, res, next) {
  req.db.collection('grupuri').find().toArray(function (err, results) {
    console.log(results);
    req.grupuri = results;
    return next();
  });
}

//GET useri
function getUseri(req, res, next) {
  req.db.collection('useri').find().toArray(function (err, results) {
    console.log(results);
    req.useri = results;
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