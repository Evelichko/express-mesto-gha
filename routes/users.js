const router = require('express').Router();

const {
  getAllUsers,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
  getCurrentUserInfo,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:id', getUserInfo);
router.patch('/me', setUserInfo);
router.patch('/me/avatar', setUserAvatar);
router.get('/me', getCurrentUserInfo);

module.exports = router;