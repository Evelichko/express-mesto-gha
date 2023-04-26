const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const InaccurateDataError = require('../errors/InaccurateDataError');

async function createUser(req, res, next) {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    let user = await User.create({
      name,
      about,
      avatar,
      email,
      password: passwordHash,
    });
    user = user.toObject();
    delete user.password;
    res.status(201).send(user);
  } catch (err) {
    console.log('lalal');
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      console.log('lalal1');
      next(new InaccurateDataError('Неверные данные в запросе'));
      return;
    }
    if (err.code === 11000) {
      console.log('lalal1');
      next(new ConflictError('Пользователь с таким email уже существует'));
    }
    next(err);
  }
}

function getAllUsers(req, res, next) {
  User
    .find({})
    .then((users) => res.send({ data: users }))
    // .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' }));
    .catch(next);
}

function getUserInfo(req, res, next) {
  const { id } = req.params;

  User
    .findById(id)
    .then((user) => {
      if (user) return res.send(user);
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new InaccurateDataError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
}

function setUserInfo(req, res, next) {
  const { name, about } = req.body;
  const { _id: userId } = req.user;

  User
    .findByIdAndUpdate(
      userId,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (user) return res.send(user);

      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при обновлении профиля пользователя'));
      } else {
        next(err);
      }
    });
}

function setUserAvatar(req, res, next) {
  const { avatar } = req.body;
  const { _id: userId } = req.user;

  User
    .findByIdAndUpdate(
      userId,
      {
        avatar,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (user) return res.send({ data: user });

      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при обновлении профиля пользователя'));
      } else {
        next(err);
      }
    });
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Неверные данные для входа');
    }

    const hasRightPassword = await bcrypt.compare(password, user.password);

    if (!hasRightPassword) {
      throw new UnauthorizedError('Неверные данные для входа');
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secretkey',
      {
        expiresIn: '7d',
      },
    );

    res.status(200).send({ jwt: token });
  } catch (err) {
    next(err);
  }
}

function getCurrentUserInfo(req, res, next) {
  const { userId } = req.user;

  User
    .findById(userId)
    .then((user) => {
      if (user) return res.status(200).send({ data: user });

      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .catch(next);
}

module.exports = {
  createUser,
  getAllUsers,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
  login,
  getCurrentUserInfo,
};