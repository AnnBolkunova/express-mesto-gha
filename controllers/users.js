const User = require('../models/user');

const INTERNAL_SERVER_ERR = 500;
const BAD_REQUEST_ERR = 400;
const NOT_FOUND_ERR = 404;

module.exports.getAllusers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERR).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERR).send({ message: 'Некорректный id пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERR).send({ message: 'Введены некорректные данные пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERR).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERR).send({ message: 'Введены некорректные данные профиля' });
      }
      return res.status(INTERNAL_SERVER_ERR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERR).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERR).send({ message: 'Введены некорректные данные для аватара' });
      }
      return res.status(INTERNAL_SERVER_ERR).send({ message: 'На сервере произошла ошибка' });
    });
};
