const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/auth-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // максимальная длина - 30 символов
  },
  about: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // максимальная длина - 30 символов
  },
  avatar: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
    validate: { // валидация URL
      validator(v) {
        return /^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  email: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
    unique: true, // уникальное значение
    validate: { // валидация email
      validator(email) {
        return validator.isEmail(email);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
    select: false, // свойство чтобы API не возвращал хеш пароля
    minlength: 10, // минимальная длина — 10 символов
    validate: { // валидация пароля
      validator(v) {
        return /^\S+$/.test(v);
      },
      message: (props) => `${props.value} Пароль должен быть без пробелов`,
    },
  },

});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
