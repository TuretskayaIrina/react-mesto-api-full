const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllCards } = require('../controllers/cards');
const { postCard } = require('../controllers/cards');
const { deleteCard } = require('../controllers/cards');
const { addLike } = require('../controllers/cards');
const { deleteLike } = require('../controllers/cards');

// получить все карточки
router.get('/cards', getAllCards);

// создать карточку
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/),
  }),
}), postCard);

// удалить карточку
router.delete('/cards/:id', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex(),
  }),
}), deleteCard);

// добавить лайк
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex(),
  }),
}), addLike);

// удалить лайк
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex(),
  }),
}), deleteLike);

module.exports = router;
