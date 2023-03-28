var express = require('express');
var router = express.Router();
const trailsCtrl = require('../controllers/trails');
const isLoggedIn = require('../config/auth')
/* GET users listing. */

router.get('/', trailsCtrl.index);
router.get('/new', trailsCtrl.new);
router.get('/:id', trailsCtrl.show);
router.post('/', isLoggedIn, trailsCtrl.create);
// check if the user is logged before they create a movie! Server side authorization!

module.exports = router;
