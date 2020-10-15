const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('user', userSchema);
