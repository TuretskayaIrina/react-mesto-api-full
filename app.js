const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const getCards = require('./routes/cards');
const getUsers = require('./routes/users');

const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
// app.use(require('cors')());

// eslint-disable-next-line import/no-unresolved
require('dotenv').config();

// Массив разешённых доменов
// const allowedCors = [
//   'https://kusto.students.nomoreparties.xyz',
//   'http://kusto.students.nomoreparties.xyz',
//   'https://www.kusto.students.nomoreparties.xyz',
//   'http://www.kusto.students.nomoreparties.xyz',
//   'localhost:3000',
// ];

// app.use((req, res, next) => {
//   const { origin } = req.headers;
//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // логгер запросов

// crash-test
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(30),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(10),
  }),
}), createUser);

app.use(auth); // защищаем все ниже перечисленные роуты авторизацией

app.use('/', getCards);
app.use('/', getUsers);

app.use(errorLogger); // логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

// централизованная обработка ошибок
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      // eslint-disable-next-line comma-dangle
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message
    });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
