const express = require('express');
var router = express.Router();
const txtUtils = require('../utils/txtUtils');

// GET useri
router.get('/', getUseri, renderInregistrare);
// POST user
router.post('/', addUser, renderInregistrare);

//GET mongoDb Instructori
function getUseri(req, res, next) {
    req.db.collection('useri').find().toArray(function (err, results) {
        console.log(results);
        req.instructori = results;
        return next();
    });
}

//POST user
function addUser(req, res, next) {
    var user = {
        name: req.body.inregistrare_user_nume,
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
        instructori: req.instructori,
        copii: req.copii
    })
}
module.exports = router;