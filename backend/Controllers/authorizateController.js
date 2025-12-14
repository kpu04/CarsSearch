const { User } = require("../Models");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { Op } = require('sequelize'); 

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

exports.registrateUser = async (req, res) => {
  console.log("Полученные данные:", req.body);

  try {
    let { username, password, email } = req.body;

    if (
      !username ||
      !username.trim() ||
      !password ||
      !password.trim() ||
      !email ||
      !email.trim()
    ) {
      console.log("Ошибка валидации данных:", { username, password, email });
      return res
        .status(400)
        .json({ error: "Все поля обязательны для заполнения" });
    }

    username = username.trim();
    email = email.trim();
    password = password.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Некорректный email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Пароль должен быть не менее 6 символов" });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      console.log("Пользователь уже существует");
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Имя пользователя уже занято" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email уже зарегистрирован" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: "user",
      email,
    });

    console.log("Пользователь успешно создан:", newUser.id);

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Ошибка валидации данных",
        details: error.errors.map((e) => e.message),
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Пользователь с такими данными уже существует",
      });
    }

    res.status(500).json({
      error: "Внутренняя ошибка сервера",
      details: error.message,
    });
  }
};

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.authorizateUser = async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { email, password } = req.body;
    let user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Неверные учетные данные" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    res
      .status(500)
      .json({ error: "Внутренняя ошибка сервера", details: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const { id, role, oldPassword, newPassword } = req.body;
  let user;
  user = await User.findOne({ where: { id } });
  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Старый пароль неверен" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.json({ message: "Пароль успешно изменен" });
};
