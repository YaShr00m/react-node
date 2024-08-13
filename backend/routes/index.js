const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'MYSERCREKEY_BETTER_TO_STORE_IN_ENV';

// Функция для генерации токена
function generateToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
}

// Настройка multer для обработки multipart/form-data
const upload = multer({ dest: 'uploads/' });

// Регистрация
router.post('/register', upload.single('profilePicture'), async (req, res) => {
    const { email, password, birthDate, gender } = req.body;
    const profilePicture = req.file ? req.file.path : null;

    // Преобразование строки в объект Date
    const parsedBirthDate = new Date(birthDate);

    // Проверка обязательных полей
    const errors = [];

    if (!email) {
        errors.push('Email не указан');
    } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
        errors.push('Неверный формат email');
    }

    if (!password) {
        errors.push('Пароль не указан');
    }

    if (!birthDate) {
        errors.push('Дата рождения не указана');
    } else if (isNaN(parsedBirthDate.getTime())) {
        errors.push('Неверный формат даты рождения');
    }

    if (!gender) {
        errors.push('Пол не указан');
    } else if (!['male', 'female'].includes(gender)) {
        errors.push('Пол должен быть либо "male", либо "female"');
    }

    if (errors.length > 0) {
        return res.status(400).json({ error: `Ошибка при регистрации. Подробности: ${errors.join(', ')}` });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            birthDate: parsedBirthDate, // Сохранение даты рождения в правильном формате
            gender,
            profilePicture,
            registrationDate: new Date() // Установка даты регистрации
        });

        await newUser.save();

        const token = generateToken(newUser._id); // Генерация токена
        res.status(201).json({
            message: 'Регистрация прошла успешно',
            token,
            user: newUser
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: `Ошибка при регистрации: Пользователь с таким email уже существует.` });
        }
        console.error('Ошибка при регистрации:', err);
        res.status(500).json({ error: 'Ошибка сервера при регистрации. Подробности: ' + err.message });
    }
});

// Получить всех пользователей
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error('Ошибка получения пользователей:', err);
        res.status(500).json({ error: 'Ошибка сервера при получении пользователей' });
    }
});

// Логин
router.post('/login', upload.none(), async (req, res) => {
    const { email, password } = req.body;
    console.log('Received email:', email); // Логирование данных для отладки
    console.log('Received password:', password); // Логирование данных для отладки

    if (!email || !password) {
        return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const token = generateToken(user._id); // Генерация токена
        res.status(200).json({ token, user }); // Возвращаем токен и данные пользователя
    } catch (err) {
        console.error('Ошибка входа:', err);
        res.status(500).json({ error: 'Ошибка сервера при входе' });
    }
});

// Редактирование пользователя
router.put('/users/:id', upload.single('profilePicture'), async (req, res) => {
    const { id } = req.params;
    const { email, password, birthDate, gender } = req.body;
    const newProfilePicture = req.file ? req.file.path : null;

    // Преобразование строки в объект Date
    const parsedBirthDate = new Date(birthDate);

    // Проверка обязательных полей
    const errors = [];

    if (!email) {
        errors.push('Email не указан');
    } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
        errors.push('Неверный формат email');
    }

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
    }

    if (birthDate) {
        req.body.birthDate = parsedBirthDate;
    }

    if (errors.length > 0) {
        return res.status(400).json({ error: `Ошибка при редактировании. Подробности: ${errors.join(', ')}` });
    }

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        // Удаление старого изображения, если новое изображение загружено
        if (newProfilePicture && user.profilePicture) {
            const fs = require('fs');
            fs.unlink(user.profilePicture, (err) => {
                if (err) console.error('Ошибка удаления старого изображения:', err);
            });
        }

        // Обновление пользователя
        const updatedUser = await User.findByIdAndUpdate(id, {
            ...req.body,
            profilePicture: newProfilePicture || user.profilePicture
        }, { new: true });

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Ошибка при редактировании:', err);
        res.status(500).json({ error: 'Ошибка сервера при редактировании' });
    }
});


// Получить информацию о конкретном пользователе
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Ошибка при получении пользователя:', err);
        res.status(500).json({ error: 'Ошибка сервера при получении пользователя' });
    }
});

module.exports = router;
