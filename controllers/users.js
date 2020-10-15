const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// возвращает всех пользователей
const getAllUsers = (req, res) => User.find({})
  .then((users) => {
    res
      .status(200)
      .send((users));
  })
  .catch((err) => {
    console.log(err);
    return res
      .status(500)
      .send({ message: 'На сервере произошла ошибка.' });
  });

// возвращает пользователя по _id
const getUsersById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user === null || undefined) {
        return res
          .status(404)
          .send({ message: 'Нет пользователя с таким id' });
      }

      return res
        .status(200)
        .send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(404)
          .send({ message: 'Нет пользователя с таким id' });
      }
      return res
        .status(500)
        .send({ message: 'На сервере произошла ошибка.' });
    });
};

// создаёт пользователя
const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))

    .then((user) => {
      res
        .status(200)
        .send((user));
    })

    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Ошибка валидации. Некорректные данные.' });
      }
      return res
        .status(500)
        .send({ message: 'На сервере произошла ошибка.' });
    });
};

// аунтификация
const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {expiresIn: '7d'});

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports = {
  getAllUsers,
  getUsersById,
  createUser,
  login,
};
