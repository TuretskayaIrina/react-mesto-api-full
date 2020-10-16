const router = require('express').Router();
const { getAllCards } = require('../controllers/cards');
const { postCard } = require('../controllers/cards');
const { deleteCard } = require('../controllers/cards');
const { addLike } = require('../controllers/cards');
const { deleteLike } = require('../controllers/cards');

router.get('/cards', getAllCards); // получить все карточки
router.post('/cards', postCard); // создать карточку
router.delete('/cards/:id', deleteCard); // удолить карточку
router.put('/cards/:cardId/likes', addLike); // добавить лайк
router.delete('/cards/:cardId/likes', deleteLike); // удалить лайк

module.exports = router;
