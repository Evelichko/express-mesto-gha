const router = require('express').Router();

const { createUser, getAllUsers, getUserInfo } = require('../controllers/users');

router.post('/', createUser);
console.log('create route');

router.get('/', getAllUsers);
router.get('/:id', getUserInfo);

module.exports = router;
console.log('create schema');

