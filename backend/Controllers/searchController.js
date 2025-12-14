const Result = require("../Models/Result");

const searchController = {
  saveSearchResult: async (req, res) => {
    try {
      const { detectedCarModel, confidence } = req.body;

      if (!detectedCarModel || !confidence) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required fields: userId, detectedCarModel, confidence",
        });
      }

      const result = await Result.create({
        detectedCarModel,
        confidence: parseFloat(confidence),
      });

      res.status(201).json({
        success: true,
        message: "Search result saved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error saving search result:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to save search result",
      });
    }
  },

  getAllResults: async (req, res) => {
    try {
      const results = await Result.findAll({
        order: [["createdAt", "DESC"]],
        limit: 500,
      });

      res.json({
        success: true,
        data: results,
        count: results.length,
      });
    } catch (error) {
      console.error("Error fetching all results:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch results",
      });
    }
  },

  // Удаление результата поиска
  //   deleteSearchResult: async (req, res) => {
  //     try {
  //       const { id } = req.params;
  //       const { userId } = req.body; // Для проверки владельца

  //       const result = await Result.findOne({
  //         where: { id, userId },
  //       });

  //       if (!result) {
  //         return res.status(404).json({
  //           success: false,
  //           error: "Result not found or you do not have permission to delete it",
  //         });
  //       }

  //       await result.destroy();

  //       res.json({
  //         success: true,
  //         message: "Search result deleted successfully",
  //       });
  //     } catch (error) {
  //       console.error("Error deleting search result:", error);
  //       res.status(500).json({
  //         success: false,
  //         error: error.message || "Failed to delete search result",
  //       });
  //     }
  //   },
};

module.exports = searchController;
