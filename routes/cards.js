const router = require('express').Router();

const {
  createCard,
  getCards,
  deleteCard,
} = require('../controllers/cards');

router.post('/', createCard);

router.get('/', getCards);

router.delete('/:id', deleteCard);

module.exports = router;