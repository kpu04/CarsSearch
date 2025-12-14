const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authorizateController");

router.post("/register", authController.registrateUser);

router.post("/login", authController.authorizateUser);

router.put("/change", authController.changePassword);

module.exports = router;