const router = require('express').Router();

const { createUser, getAllUsers, getUserInfo, setUserInfo, setUserAvatar } = require('../controllers/users');

router.post('/', createUser);
console.log('create route');

router.get('/', getAllUsers);
router.get('/:id', getUserInfo);

router.patch('/me', setUserInfo);
router.patch('/me/avatar', setUserAvatar);

module.exports = router;

