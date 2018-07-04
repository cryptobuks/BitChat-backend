const express = require('express');
var router = express.Router();
const txtUtils = require('../utils/txtUtils');

// GET useri
router.get('/', getUseri, renderInregistrare);
// POST user
router.post('/', addUser, renderInregistrare);

//GET useri
function getUseri(req, res, next) {
    req.db.collection('useri').find().toArray(function (err, results) {
        console.log(results);
        req.useri = results;
        return next();
    });
}

//POST user
function addUser(req, res, next) {
    var user = {
        name: req.body.inregistrare_user_name,
        email: req.body.inregistrare_user_email,
        phone: req.body.inregistrare_user_phone
    }
    req.db.collection("useri").save(user, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/inregistrare')
    })
}


function renderInregistrare(req, res) {
    res.render('pages/inregistrare', {
        useri: req.useri
    })
}
module.exports = router;