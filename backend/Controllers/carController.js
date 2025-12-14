const { Car, Brand, FuelType, TransmissionType } = require("../Models");

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.findAll({
      include: [
        {
          model: Brand,
          as: "brand",
          attributes: ["id", "name"],
        },
        {
          model: FuelType,
          as: "fuelType",
          attributes: ["id", "name"],
        },
        {
          model: TransmissionType,
          as: "transmission",
          attributes: ["id", "name"],
        },
      ],
      attributes: [
        "id",
        "model",
        "year",
        "price",
        "photo",
        "description",
        "mileage",
        "engineVolume",
        "brandId",
        "fuelTypeId",
        "transmissionId",
      ],
    });

    const formattedCars = cars.map((car) => ({
      id: car.id,
      model: car.model,
      brand: car.brand?.name || null,
      brandId: car.brandId,
      year: car.year,
      price: car.price,
      photo: car.photo,
      description: car.description,
      mileage: car.mileage,
      engineVolume: car.engineVolume,
      fuelType: car.fuelType?.name || null,
      fuelTypeId: car.fuelTypeId,
      transmission: car.transmission?.name || null,
      transmissionId: car.transmissionId,
    }));

    res.json(formattedCars);
  } catch (err) {
    console.error("Error fetching cars:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch cars", details: err.message });
  }
};

exports.createCar = async (req, res) => {
  try {
    // Валидация входных данных
    const requiredFields = [
      "model",
      "year",
      "price",
      "brandId",
      "fuelTypeId",
      "transmissionId",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missing: missingFields,
      });
    }

    const [brand, fuelType, transmission] = await Promise.all([
      Brand.findByPk(req.body.brandId),
      FuelType.findByPk(req.body.fuelTypeId),
      TransmissionType.findByPk(req.body.transmissionId),
    ]);

    if (!brand) {
      return res
        .status(400)
        .json({ error: `Brand with id ${req.body.brandId} not found` });
    }
    if (!fuelType) {
      return res
        .status(400)
        .json({ error: `FuelType with id ${req.body.fuelTypeId} not found` });
    }
    if (!transmission) {
      return res.status(400).json({
        error: `TransmissionType with id ${req.body.transmissionId} not found`,
      });
    }

    const newCar = await Car.create({
      model: req.body.model,
      year: req.body.year,
      price: req.body.price,
      photo: req.body.photo || null,
      description: req.body.description || null,
      mileage: req.body.mileage || 0,
      engineVolume: req.body.engineVolume,
      brandId: req.body.brandId,
      fuelTypeId: req.body.fuelTypeId,
      transmissionId: req.body.transmissionId,
    });

    const createdCar = await Car.findByPk(newCar.id, {
      include: [
        { model: Brand, as: "brand", attributes: ["id", "name"] },
        { model: FuelType, as: "fuelType", attributes: ["id", "name"] },
        {
          model: TransmissionType,
          as: "transmission",
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(201).json({
      id: createdCar.id,
      model: createdCar.model,
      brand: createdCar.brand?.name,
      brandId: createdCar.brandId,
      year: createdCar.year,
      price: createdCar.price,
      photo: createdCar.photo,
      description: createdCar.description,
      mileage: createdCar.mileage,
      engineVolume: createdCar.engineVolume,
      fuelType: createdCar.fuelType?.name,
      fuelTypeId: createdCar.fuelTypeId,
      transmission: createdCar.transmission?.name,
      transmissionId: createdCar.transmissionId,
    });
  } catch (err) {
    console.error("Error creating car:", err);

    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: err.errors.map((e) => e.message),
      });
    }

    if (err.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error: "Foreign key constraint error",
        details:
          "One of the referenced records (Brand, FuelType, or TransmissionType) does not exist",
      });
    }

    res
      .status(500)
      .json({ error: "Failed to create car", details: err.message });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id, {
      include: [
        { model: Brand, as: "brand", attributes: ["id", "name"] },
        { model: FuelType, as: "fuelType", attributes: ["id", "name"] },
        {
          model: TransmissionType,
          as: "transmission",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    const formattedCar = {
      id: car.id,
      model: car.model,
      brand: car.brand?.name || null,
      brandId: car.brandId,
      year: car.year,
      price: car.price,
      photo: car.photo,
      description: car.description,
      mileage: car.mileage,
      engineVolume: car.engineVolume,
      fuelType: car.fuelType?.name || null,
      fuelTypeId: car.fuelTypeId,
      transmission: car.transmission?.name || null,
      transmissionId: car.transmissionId,
    };

    res.json(formattedCar);
  } catch (err) {
    console.error("Error fetching car:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch car", details: err.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    if (req.body.brandId) {
      const brand = await Brand.findByPk(req.body.brandId);
      if (!brand) {
        return res
          .status(400)
          .json({ error: `Brand with id ${req.body.brandId} not found` });
      }
    }

    if (req.body.fuelTypeId) {
      const fuelType = await FuelType.findByPk(req.body.fuelTypeId);
      if (!fuelType) {
        return res
          .status(400)
          .json({ error: `FuelType with id ${req.body.fuelTypeId} not found` });
      }
    }

    if (req.body.transmissionId) {
      const transmission = await TransmissionType.findByPk(
        req.body.transmissionId
      );
      if (!transmission) {
        return res.status(400).json({
          error: `TransmissionType with id ${req.body.transmissionId} not found`,
        });
      }
    }

    const [updated] = await Car.update(req.body, {
      where: { id: req.params.id },
      fields: [
        "model",
        "year",
        "price",
        "photo",
        "description",
        "mileage",
        "engineVolume",
        "brandId",
        "fuelTypeId",
        "transmissionId",
      ],
    });

    if (!updated) {
      return res.status(404).json({ error: "Car not found" });
    }

    const updatedCar = await Car.findByPk(req.params.id, {
      include: [
        { model: Brand, as: "brand", attributes: ["id", "name"] },
        { model: FuelType, as: "fuelType", attributes: ["id", "name"] },
        {
          model: TransmissionType,
          as: "transmission",
          attributes: ["id", "name"],
        },
      ],
    });

    const formattedCar = {
      id: updatedCar.id,
      model: updatedCar.model,
      brand: updatedCar.brand?.name || null,
      brandId: updatedCar.brandId,
      year: updatedCar.year,
      price: updatedCar.price,
      photo: updatedCar.photo,
      description: updatedCar.description,
      mileage: updatedCar.mileage,
      engineVolume: updatedCar.engineVolume,
      fuelType: updatedCar.fuelType?.name || null,
      fuelTypeId: updatedCar.fuelTypeId,
      transmission: updatedCar.transmission?.name || null,
      transmissionId: updatedCar.transmissionId,
    };

    res.json(formattedCar);
  } catch (err) {
    console.error("Error updating car:", err);

    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: err.errors.map((e) => e.message),
      });
    }

    if (err.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error: "Foreign key constraint error",
        details:
          "One of the referenced records (Brand, FuelType, or TransmissionType) does not exist",
      });
    }

    res
      .status(500)
      .json({ error: "Failed to update car", details: err.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const deleted = await Car.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting car:", err);

    if (err.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error: "Cannot delete car",
        details: "This car might be referenced in other tables",
      });
    }

    res
      .status(500)
      .json({ error: "Failed to delete car", details: err.message });
  }
};

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    res.json(brands);
  } catch (err) {
    console.error("Error fetching brands:", err);

    try {
      const sequelize = require("../Models").sequelize;

      const brands = await sequelize.query(
        'SELECT id, name FROM "Brand" ORDER BY name ASC',
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      res.json(brands);
    } catch (sqlErr) {
      console.error("SQL error fetching brands:", sqlErr);

      res.json([
        { id: 1, name: "Toyota" },
        { id: 2, name: "Honda" },
        { id: 3, name: "Ford" },
        { id: 4, name: "BMW" },
        { id: 5, name: "Mercedes" },
      ]);
    }
  }
};

exports.getAllFuelTypes = async (req, res) => {
  try {
    const fuelTypes = await FuelType.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    res.json(fuelTypes);
  } catch (err) {
    console.error("Error fetching fuel types:", err);
    res.status(500).json({
      error: "Failed to fetch fuel types",
      details: err.message,
    });
  }
};

exports.getAllTransmissionTypes = async (req, res) => {
  try {
    const transmissionTypes = await TransmissionType.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    res.json(transmissionTypes);
  } catch (err) {
    console.error("Error fetching transmission types:", err);
    res.status(500).json({
      error: "Failed to fetch transmission types",
      details: err.message,
    });
  }
};
