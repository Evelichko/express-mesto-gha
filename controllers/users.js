const User = require('../models/users');

console.log('cont 1');

// module.exports.createUser = (req, res) => {
//   const { name, about, avatar } = req.body;
//   User.create({ name, about, avatar })
//     .then((user) => res.status(201).send({ data: user }))
//     .catch((err) => res.status(400).send({ message: err }));
// };

function createUser(req, res, next) {
  console.log('cont 2');

  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      const { _id } = user;
      return res.status(201).send({
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
   });
}
//   .catch((err =>
//   if(err.status(400).send({message: 'Переданы некорректные данные при создании пользователя'}))
// } else {
//   err.status(500).send({message: 'Произошла ошибка'});
// })

function getAllUsers(req, res) {
  User
    .find({})
    .then((users) => res.send({ users }))
    .catch((err) => {
      console.log(err);
    });
  //   if(err.status(400).send({message: 'Переданы некорректные данные при создании пользователя'}))
  // } else {
  //   err.status(500).send({message: 'Произошла ошибка'});
  // })
}

function getUserInfo(req, res) {
  const { id } = req.params;

  User
    .findById(id)
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      console.log(err);
    });
}
// .catch((err) =>
//   if(err.status(404).send({message: 'Пользователь по указанному _id не найден'}))
// } else {
//   err.status(500).send({message: 'Произошла ошибка'});
// })

module.exports = {
 createUser,
  getAllUsers,
  getUserInfo,
};