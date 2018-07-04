var express = require('express');
var router = express.Router();
const txtUtils = require('../utils/txtUtils');

//****************************MONGO_DB HANDLING **************************************************************
/* GET mesaje*/
router.get('/', getMesaj, renderAnunturi);
/* POST mesaj*/
router.post('/', addMesaj, renderAnunturi);
// DELETE mesaj
router.delete('/:id',deleteMesaj, renderAnunturi);

//GET mesaje
function getMesaj(req, res, next) {
  req.db.collection('mesaje').find().toArray(function (err, results) {
    console.log(results);
    req.anunturi = results;
    return next();
  });
}

// POST Mesaj
function addMesaj(req, res, next) {
  var titluAnunt = req.body.anunt_titlu;
  var mesajAnunt = req.body.anunt_mesaj;
  if (!txtUtils.isBlank(titluAnunt) && !txtUtils.isBlank(mesajAnunt)) {
    var mesaj = {
      titlu: titluAnunt,
      mesaj: mesajAnunt
    }
    req.db.collection('mesage').save(mesaj, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
    });
  }
  res.redirect('/mesaje')
}

//DELETE Anunturi
function deleteMesaj(req, res, next) {
  var btnStergeAnung = req.body.btn_sterge_anunt;
    req.db.collection('mesaje').remove({
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('deleted from database')
      res.redirect('/mesaje');
    });
}


function renderAnunturi(req, res) {
  res.render('pages/mesaje', {
    anunturi: req.anunturi
  })
}
module.exports = router;