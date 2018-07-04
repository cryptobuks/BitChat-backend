var express = require('express');
var router = express.Router();

router.get('/', getGrupuri, renderGrupuri);
router.post('/', addGrup, renderGrupuri);

//GET grupuri
function getGrupuri(req, res, next) {
    req.db.collection('grupuri').find().toArray(function (err, results) {
        console.log(results);
        req.grupuri = results;
        return next();
    });
}

// POST grup
function addGrup(req, res, next) {
    var grup = {
        name: req.body.grup_name
    }
    req.db.collection('grupuri').save(grup, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/grupuri')
    })
}

function renderGrupuri(req, res) {
    res.render('pages/grupuri', {
        grupuri: req.grupuri
    })
}
module.exports = router;