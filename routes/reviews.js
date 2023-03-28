const express = require('express');
const router = express.Router();
const reviewCtrl = require('../controllers/reviews');

router.post('/trails/:id/reviews', reviewCtrl.create);
router.delete('/reviews/:id', reviewCtrl.delete);

module.exports = router;