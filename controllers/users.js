const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/Validation-error');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;

// вернуть всех пользователей
const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

// вернуть пользователя по _id
const getUsersById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user === null || undefined) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.send({ data: user });
    })
    .catch(next);
};

// создать пользователя
const createUser = (req, res, next) => {
  const {
    // eslint-disable-next-line no-unused-vars
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(req.body.password, 10)

    // .then((hash) => User.create({
    //   name,
    //   about,
    //   avatar,
    //   email,
    //   password: hash,
    // }))

    // test
    .then((hash) => User.create({
      name: name || 'Вася',
      about: about || 'О Васе всякое',
      avatar: avatar || 'https://icon-library.com/images/icon-avatars/icon-avatars-18.jpg',
      email,
      password: hash,
    }))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Заполните все поля: name, about, avatar, email, password');
      } else if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      }
    })
    .then((user) => {
      res.send((user));
    })

    .catch(next);
};

// аунтификация
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }
      );
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

// обновить пользователя
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.send((user));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка валидации');
      }
      next(err);
    });
};

// обновить аватар
const updateAvatr = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.send((user));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка валидации');
      }
      next(err);
    });
};

module.exports = {
  getAllUsers,
  getUsersById,
  createUser,
  updateUser,
  updateAvatr,
  login,
};
