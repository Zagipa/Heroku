// server.js

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
// Подключение к MongoDB Atlas
mongoose.connect('mongodb+srv://zagipakoishibaeva:<wRRmVDHQOD57f4CG>@cluster0.enhfq21.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware для парсинга JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware для сессий
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Модель для истории запросов
const History = mongoose.model('History', new mongoose.Schema({
  userId: String,
  api: String,
  request: Object,
  response: Object,
  timestamp: { type: Date, default: Date.now }
}));

// Middleware для логирования истории запросов
app.use(async (req, res, next) => {
  if (req.session.userId) {
    const history = new History({
      userId: req.session.userId,
      api: req.url,
      request: req.body,
      response: res.body
    });
    await history.save();
  }
  next();
});

// API для получения данных о погоде
app.get('/weather', async (req, res) => {
  try {
    const response = await axios.get('dc37f59ffc942b6c48fb304a8a927a57');
    // Сохранение данных в MongoDB
    // Отправка данных в ответ клиенту
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// API для получения новостей
app.get('/news', async (req, res) => {
  try {
    const response = await axios.get('d142a4aa3fce4b50afdcd9748a4e2acf');
    // Сохранение данных в MongoDB
    // Отправка данных в ответ клиенту
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// API для получения курса валют
app.get('/currency', async (req, res) => {
  try {
    const response = await axios.get('ca2a364d9bb2aafe1f90cb7c');
    // Сохранение данных в MongoDB
    // Отправка данных в ответ клиенту
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Остальные маршруты и настройки из вашего предыдущего server.js

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
