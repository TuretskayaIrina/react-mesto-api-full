const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getAllUsers } = require('../controllers/users');
const { getUsersById } = require('../controllers/users');
const { updateUser } = require('../controllers/users');
const { updateAvatr } = require('../controllers/users');

// вернуть всех пользователей
router.get('/users', getAllUsers);

// вернуть пользователя по _id
router.get('/users/:id', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().hex(),
  }),
}), getUsersById);

// обновляет профиль
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

// обновляет аватар
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/),
  }),
}), updateAvatr);

module.exports = router;
