const Card = require('../models/card');

// возвращает все карточки
const getAllCards = (req, res) => Card.find({})
  .then((cards) => {
    res
      .status(200)
      .send((cards));
  })
  .catch((err) => {
    console.log(err);
    return res
      .status(500)
      .send({ message: 'На сервере произошла ошибка.' });
  });

// создаёт карточку
const postCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res
        .status(200)
        .send((card));
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

// удаляет карточку по id
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (card === null || undefined) {
        return res
          .status(404)
          .send({ message: 'Нет карточки с таким id' });
      }

      return res
        .status(200)
        .send((card));
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
  getAllCards,
  postCard,
  deleteCard,
};
