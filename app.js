const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const getCards = require('./routes/cards');
const getUsers = require('./routes/users');

const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// временная реализация идентификации пользователя
app.use((req, res, next) => {
  req.user = {
    _id: '5f676acd2fa3588da69bb035',
  };
  next();
});

app.use('/', getCards);
app.use('/', getUsers);

app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res) => {
  res
    .status(404)
    .send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
