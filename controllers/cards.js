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
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send((card));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      }
      next(err);
    });
};

// удаляет карточку по id
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .catch(() => {
      throw new NotFoundError('Нет карточки с таким id');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError({ message: 'Недостаточно прав' });
      }
      Card.findByIdAndDelete(req.params.cardId)
        .then(() => res.send({ message: 'Delete' }))
        .catch(next);
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
    .then((data) => {
      if (data === null || undefined) {
        throw new NotFoundError('Нет карточки с таким id');
      }
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
    .then((data) => {
      if (data === null || undefined) {
        throw new NotFoundError('Нет карточки с таким id');
      }

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
