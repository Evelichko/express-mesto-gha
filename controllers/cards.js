const Card = require('../models/cards');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const InaccurateDataError = require('../errors/InaccurateDataError');

function getCards(req, res, next) {
  Card
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const userId = req.user._id;
  Card
    .create({ name, link, owner: userId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
}

function likeCard(req, res, next) {
  const userId = req.user._id;

  Card
    .findByIdAndUpdate(
      req.params.cardId,
      {
        $addToSet: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.status(200).send({ data: card });
      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при добавлении лайка карточке'));
      } else {
        next(err);
      }
    });
}

function dislikeCard(req, res, next) {
  const userId = req.user._id;

  Card
    .findByIdAndUpdate(
      req.params.cardId,
      {
        $pull: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.send({ data: card });

      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при снятии лайка карточки'));
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  const userId = req.user._id;

  Card
    .findById(req.params.id)
    .then((card) => {
      if (!card) throw new NotFoundError('Данные по указанному id не найдены');
      const cardOwnerId = card.owner._id;
      if (cardOwnerId.toString() !== userId) throw new ForbiddenError('Нет прав доступа');
      const id = card._id.toString();
      Card
        .findByIdAndRemove(id)
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};