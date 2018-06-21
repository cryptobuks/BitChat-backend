var express = require('express');
var router = express.Router();

router.get('/', getGrupuri, renderGrupuri);
router.post('/', addGrup, renderGrupuri);

//GET grupuri
function getGrupuri(req, res, next) {
    req.db.collection('grupuri').find().toArray(function (err, results) {
        console.log(results);
        req.cercuri = results;
        return next();
    });
}

// POST grup
function addGrup(req, res, next) {
    var grup = {
        nume: req.body.cerc_nume,
        pret: req.body.cerc_pret,
        locuri: req.body.cerc_locuri,
        categorie: req.body.cerc_categorie,
        descriere: req.body.cerc_descriere
    }
    req.db.collection('grupuri').save(grup, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/grupuri')
    })
}

function renderGrupuri(req, res) {
    res.render('pages/grupuri', {
        cercuri: req.grupuri
    })
}
module.exports = router;