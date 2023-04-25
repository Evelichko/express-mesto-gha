const Card = require('../models/cards');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

function getCards(req, res, next) {
  Card
    .find({})
    .then((cards) => res.send({ data: cards }))
    // .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const { userId } = req.user;

  Card
    .create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    // .catch((err) => {
    //   if (err.name === 'ValidationError') {
    //     res.status(ERROR_INACCURATE_DATA)
    // .send({ message: 'Переданы некорректные данные при создании карточки' });
    //   } else {
    //     res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
    //   }
    // });
    .catch(next);
}

function likeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
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
    // .catch((err) => {
    //   if (err.name === 'ValidationError' || err.name === 'CastError') {
    //     return res.status(ERROR_INACCURATE_DATA)
    // .send({ message: 'Переданы некорректные данные для добавления лайка' });
    //   }

    //   return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
    // });
    .catch(next);
}

function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
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
      if (card) return res.status(200).send({ data: card });

      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    // .catch((err) => {
    //   if (err.name === 'ValidationError' || err.name === 'CastError') {
    //     return res.status(ERROR_INACCURATE_DATA)
    // .send({ message: 'Переданы некорректные данные для снятия лайка' });
    //   }

    //   return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
    // });
    .catch(next);
}

function deleteCard(req, res, next) {
  const { id: cardId } = req.params;
  const { userId } = req.user;

  Card
    .findById({
      _id: cardId,
    })
    .then((card) => {
      if (!card) throw new NotFoundError('Данные по указанному id не найдены');

      const { owner: cardOwnerId } = card;
      if (cardOwnerId.valueOf() !== userId) throw new ForbiddenError('Нет прав доступа');

      card
        .remove()
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch(next);
}

module.exports = {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};