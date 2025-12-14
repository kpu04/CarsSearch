const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userControllers");

// router.get("/", carController.getAllCars);
// router.post("/new", carController.createCar);
router.get("/:id", userController.getUserById);

module.exports = router;
