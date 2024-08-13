const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const routes = require(path.resolve(__dirname, 'routes')); // Абсолютный путь
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

// Подключение к MongoDB
mongoose.connect('mongodb://mongo:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware
app.use(express.json());

// Включаем CORS для всех маршрутов
app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Маршруты
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
