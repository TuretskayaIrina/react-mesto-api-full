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
const postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
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

module.exports = {
  getAllUsers,
  getUsersById,
  postUser,
};
