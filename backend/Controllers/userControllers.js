const { Car, Brand, FuelType, TransmissionType, User } = require("../Models");

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.status(200).json({
      message: "Пользователь успешно найден",
      user,
    });
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    res.status(500).json({
      error: "Внутренняя ошибка сервера",
      details: error.message,
    });
  }
};
