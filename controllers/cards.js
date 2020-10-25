const Card = require('../models/card');
const ValidationError = require('../errors/Validation-error');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-error');

// возвращает все карточки
const getAllCards = (req, res, next) => Card.find({})
  .then((cards) => {
    res.send((cards));
  })
  .catch(next);

// создаёт карточку
const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;
  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.send((card));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка валидации. Некорректные данные.');
      }
      next(err);
    });
};

// удаляет карточку по id
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError(`Карточка с id ${req.params.cardId} не существует`))

    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав');
      }

      card.remove()
        .then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })

    .catch(next);
};

// поставить лайк карточке
const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .then((data) => {
      res.send((data));
    })
    .catch(next);
};

// убрать лайк с карточки
const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .then((data) => {
      res.send((data));
    })
    .catch(next);
};

module.exports = {
  getAllCards,
  postCard,
  deleteCard,
  addLike,
  deleteLike,
};
