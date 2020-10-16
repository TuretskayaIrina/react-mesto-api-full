const router = require('express').Router();

const { getAllUsers } = require('../controllers/users');
const { getUsersById } = require('../controllers/users');
const { updateUser } = require('../controllers/users');
const { updateAvatr } = require('../controllers/users');

router.get('/users', getAllUsers); // вернуть всех пользователей
router.get('/users/:id', getUsersById); // вернуть пользователя по _id
router.patch('/users/me', updateUser); // обновляет профиль
router.patch('/users/me/avatar', updateAvatr); //обновляет аватар

module.exports = router;
