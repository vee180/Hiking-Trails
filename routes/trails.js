var express = require('express');
var router = express.Router();
const trailsCtrl = require('../controllers/trails');
const isLoggedIn = require('../config/auth')
/* GET users listing. */

router.get('/', trailsCtrl.index);
router.get('/new', trailsCtrl.new);
router.get('/:id', trailsCtrl.show);
router.get('/:id/edit', trailsCtrl.edit);
router.post('/', isLoggedIn, trailsCtrl.create);
router.put('/:id', trailsCtrl.update);



module.exports = router;
