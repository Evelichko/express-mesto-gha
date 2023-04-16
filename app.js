const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const routeUsers = require('./routes/users');

const routeCards = require('./routes/cards');

const { ERROR_NOT_FOUND } = require('./errors/errors');

const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '643aacdc1a4bc372d5b763b9',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страницы этому адресу нет' });
});

app.use('/users', routeUsers);
app.use('/cards', routeCards);
app.listen(PORT);
