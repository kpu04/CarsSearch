const express = require("express");
const router = express.Router();
const carController = require("../Controllers/carController");

router.get("/", carController.getAllCars);
router.post("/new", carController.createCar);
router.get("/:id", carController.getCarById);
router.put("/:id", carController.updateCar);
router.delete("/:id", carController.deleteCar);
router.get("/filter/brands", carController.getAllBrands);
router.get("/filter/fuel-types", carController.getAllFuelTypes);
router.get("/filter/transmission-types", carController.getAllTransmissionTypes);

module.exports = router;
