const router = require('express').Router();

const { getAllUsers } = require('../controllers/users');

const { getUsersById } = require('../controllers/users');

router.get('/users', getAllUsers); // возвращает всех пользователей
router.get('/users/:id', getUsersById); // возвращает пользователя по _id

module.exports = router;
