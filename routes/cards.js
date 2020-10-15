const router = require('express').Router();
const { getAllCards } = require('../controllers/cards');
const { postCard } = require('../controllers/cards');
const { deleteCard } = require('../controllers/cards');

router.get('/cards', getAllCards);
router.post('/cards', postCard);
router.delete('/cards/:id', deleteCard);

module.exports = router;
