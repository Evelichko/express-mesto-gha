const User = require('../models/users');

const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../errors/errors');

async function createUser(req, res) {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    }
  }
}

function getAllUsers(req, res) {
  User
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' }));
}

function getUserInfo(req, res) {
  const { id } = req.params;

  User
    .findById(id)
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Передан некорректный id' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
      }
    });
}

function setUserInfo(req, res) {
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
      if (user) return res.send({ data: user });

      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
}

function setUserAvatar(req, res) {
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

      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
}

module.exports = {
  createUser,
  getAllUsers,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
};