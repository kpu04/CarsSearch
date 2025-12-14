const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");

const upload = multer({ storage: multer.memoryStorage() });


const API_KEY = "ZNO9EwvniuloqFngdHLl";
const PROJECT = "car-models-stage-1";
const MODEL_VERSION = "5"; 

const fileToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

router.post("/image", upload.single("image"), async (req, res) => {
  try {
    console.log("=== Roboflow API (по документации) ===");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload an image",
      });
    }

    // Конвертируем в base64 С ПРЕФИКСОМ (как в документации)
    const imageBase64 = fileToBase64(req.file);

    // URL из документации, но с ВАШИМ проектом
    const url = `https://serverless.roboflow.com/${PROJECT}/${MODEL_VERSION}`;

    // Используем axios ТОЧНО как в документации
    const response = await axios({
      method: "POST",
      url: url,
      params: {
        api_key: API_KEY,
      },
      data: imageBase64,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const result = response.data;

    let detectedCars = [];

    if (result.predictions && Array.isArray(result.predictions)) {
      detectedCars = result.predictions
        .filter((pred) => pred.confidence > 0.3)
        .map((pred, index) => ({
          id: index + 1,
          model: pred.class || "Car",
          confidence: Math.round(pred.confidence * 100),
          averageConfidence: Math.round(pred.confidence * 100),
          boundingBox: pred.bbox || null,
        }));

      detectedCars.sort((a, b) => b.confidence - a.confidence);
    }

    return res.json({
      success: true,
      message:
        detectedCars.length > 0
          ? `Found ${detectedCars.length} cars`
          : "No cars detected",
      detectedCars: detectedCars,
    });
  } catch (error) {
    let userMessage = error.message;

    if (error.response?.status === 401) {
      userMessage = "Invalid Roboflow API key. Please check configuration.";
    } else if (error.response?.status === 404) {
      userMessage = `Project or model not found. Check: ${PROJECT}/${MODEL_VERSION}`;
    } else if (error.response?.status === 403) {
      userMessage = "Access forbidden. Check API key permissions.";
    }

    return res.status(500).json({
      success: false,
      error: userMessage,
      details: error.response?.data,
    });
  }
});

router.get("/test-api", async (req, res) => {
  try {
    console.log("Testing Roboflow API connection...");

    const testImage =
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

    const url = `https://serverless.roboflow.com/${PROJECT}/${MODEL_VERSION}`;

    const response = await axios({
      method: "POST",
      url: url,
      params: { api_key: API_KEY },
      data: testImage,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return res.json({
      success: true,
      status: response.status,
      result: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      response: error.response?.data,
    });
  }
});

router.get("/project-info", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.roboflow.com/${PROJECT}?api_key=${API_KEY}`
    );

    return res.json({
      success: true,
      project: {
        name: response.data.name,
        type: response.data.type,
        workspace: response.data.workspace,
        images: response.data.images,
        classes: response.data.classes || [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const searchController = require("../Controllers/searchController");

router.post("/save", searchController.saveSearchResult);

router.get('/', searchController.getAllResults);

module.exports = router;
