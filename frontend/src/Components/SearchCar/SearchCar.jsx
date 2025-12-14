import "./SearchCar.css";
import { useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const SearchCar = ({ onClick, onSearchResults, returnResult }) => {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState("");
  const fileInputRef = useRef(null);
  const [searchResult, setSearchResult] = useState();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("❌ Please select an image file (JPG, PNG, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("❌ File is too large. Maximum size is 10MB.");
      return;
    }

    setFileName(file.name);
    setImage(file);
    setError(null);
    setStatus("📸 Image selected");

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleIconClick = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setFileName("");
    setImage(null);
    setPreviewUrl("");
    setError(null);
    setStatus("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // const handleSaveResult = async () => {
  //   const PORT = import.meta.env.VITE_PORT;
  //   try {
  //     let response;

  //     response = await fetch(`http://localhost:${PORT}/api/`);

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const jsonData = await response.json();
  //     setData(jsonData.user);
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const loadImageBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  // const handleSearch = async () => {
  //   if (!image) {
  //     setError("❌ Please select an image first");
  //     return;
  //   }

  //   setIsLoading(true);
  //   setError(null);
  //   setStatus("⏳ Preparing image...");

  //   try {
  //     // Конвертируем в base64 (как в документации)
  //     const imageBase64 = await loadImageBase64(image);

  //     setStatus("🔍 Sending to Roboflow...");

  //     // Отправляем на наш сервер (а он уже отправляет в Roboflow)
  //     const response = await fetch(`${API_URL}/api/search/image`, {
  //       method: "POST",
  //       body: createFormData(image), // Отправляем как FormData
  //     });

  //     setStatus("📊 Processing results...");

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || `Server error: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log("Response data:", data);

  //     if (data.success) {
  //       const results = data.detectedCars;
  //       console.log(results);

  //       if (results.length === 0) {
  //         setStatus("❌ No cars detected");
  //         setTimeout(() => {
  //           alert(
  //             "🚫 No cars detected in the image. Please try another photo.\n\n"
  //           );
  //         }, 100);
  //       } else {
  //         const topResult = results[0];
  //         setStatus(`✅ Found ${results.length} car(s)!`);

  //         setTimeout(() => {
  //           alert(
  //             `✅ Success!\n\n` +
  //               `Found: ${results.length} car(s)\n` +
  //               `Best match: ${topResult.model}\n` +
  //               `Confidence: ${topResult.confidence}%`
  //           );

  //           // Передаем результаты
  //           if (onSearchResults) {
  //             onSearchResults(results);
  //           }

  //           // Закрываем попап
  //           if (onClick) {
  //             onClick();
  //           }
  //         }, 100);
  //       }
  //     } else {
  //       setError(`❌ ${data.error || "Search failed"}`);
  //       setStatus("");
  //     }
  //   } catch (err) {
  //     console.error("Search error:", err);
  //     setStatus("");

  //     if (err.name === "AbortError") {
  //       setError("⏰ Request timed out. Please try a smaller image.");
  //     } else if (
  //       err.message.includes("Network Error") ||
  //       err.message.includes("Failed to fetch")
  //     ) {
  //       setError(`🌐 Cannot connect to server at ${API_URL}`);
  //     } else if (
  //       err.message.includes("401") ||
  //       err.message.includes("Unauthorized")
  //     ) {
  //       setError(
  //         "🔑 Roboflow API key error. Please check server configuration."
  //       );
  //     } else if (
  //       err.message.includes("404") ||
  //       err.message.includes("Not Found")
  //     ) {
  //       setError("🔍 Model not found. Please check Roboflow project settings.");
  //     } else {
  //       setError(`❌ ${err.message}`);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Вспомогательная функция для создания FormData
  // const createFormData = (file) => {
  //   const formData = new FormData();
  //   formData.append("image", file);
  //   return formData;
  // };

  // SearchCar.jsx - обновите функцию handleSearch
  // const handleSearch = async () => {
  //   if (!image) {
  //     setError("❌ Please select an image first");
  //     return;
  //   }

  //   setIsLoading(true);
  //   setError(null);
  //   setStatus("⏳ Preparing image...");

  //   try {
  //     setStatus("🔍 Sending to Roboflow...");

  //     // Создаем FormData с дополнительными данными
  //     const formData = new FormData();
  //     formData.append("image", image);

  //     // Добавляем метаданные если нужно
  //     formData.append("filename", image.name);
  //     formData.append("filesize", image.size);
  //     formData.append("timestamp", new Date().toISOString());

  //     const response = await fetch(`${API_URL}/api/search/image`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || `Server error: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     console.log(data.detectedCars[0].model, data.detectedCars[0].confidence);

  //     if (data.success) {
  //       const results = data.detectedCars;

  //       if (results.length === 0) {
  //         setTimeout(() => {
  //           alert(
  //             "🚫 No cars detected in the image. Please try another photo.\n\n"
  //           );
  //         }, 100);
  //       } else {
  //         const topResult = results[0];
  //         const modelName = topResult.model || "";

  //         if (returnResult && typeof returnResult === "function") {
  //           returnResult(modelName);
  //         }

  //         onClick();
  //       }
  //     } else {
  //       setStatus("");
  //     }
  //   } catch {
  //     setStatus("");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const saveSearchResult = async (resultData) => {
    try {
      const saveData = {
        detectedCarModel: resultData.model,
        confidence: resultData.confidence,
      };

      const response = await fetch(`${API_URL}/api/search/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveData),
      });

      if (!response.ok) {
        throw new Error("Failed to save search result");
      }

      const data = await response.json();
      console.log("Result saved:", data);
      return data;
    } catch (error) {
      console.error("Error saving result:", error);
      throw error;
    }
  };

  const handleSearch = async () => {
    if (!image) {
      setError("❌ Please select an image first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatus("⏳ Preparing image...");

    try {
      setStatus("🔍 Sending to Roboflow...");

      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(`${API_URL}/api/search/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const results = data.detectedCars;

        if (results.length === 0) {
          setStatus("❌ No cars detected");
          setTimeout(() => {
            alert(
              "🚫 No cars detected in the image. Please try another photo."
            );
          }, 100);
        } else {
          const topResult = results[0];
          setStatus(`✅ Found ${results.length} car(s)!`);

          // Сохраняем результат в базу данных
          try {
            await saveSearchResult(topResult);
          } catch (saveError) {
            console.error("Failed to save result:", saveError);
          }

          const modelName = topResult.model || "";

          if (returnResult && typeof returnResult === "function") {
            returnResult(modelName);
          }

          onClick();
        }
      } else {
        setError(`❌ ${data.error || "Search failed"}`);
        setStatus("");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(`❌ ${err.message}`);
      setStatus("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <div className="filters-header">
          <h3>🔍 Search Car by Photo</h3>
          <button
            className="close-button"
            onClick={onClick}
            type="button"
            disabled={isLoading}
            title="Close"
          >
            &times;
          </button>
        </div>

        <div className="upload-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
            disabled={isLoading}
            id="car-image-input"
          />

          {previewUrl ? (
            <div className="image-preview-wrapper">
              <div className="image-preview">
                <img
                  src={previewUrl}
                  alt="Car preview"
                  className="preview-image"
                />
              </div>
            </div>
          ) : (
            <div
              className={`upload-area ${isLoading ? "disabled" : ""}`}
              onClick={handleIconClick}
              style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              <img src="/images/upload.png" style={{ opacity: 0.3 }}></img>
              <p className="upload-info">Supports: JPG, PNG, WEBP • Max 10MB</p>
            </div>
          )}

          {error && (
            <div className="error-alert">
              <span className="error-text">{error}</span>
            </div>
          )}

          <div className="action-buttons">
            {isLoading ? (
              <>
                <CircularProgress />
              </>
            ) : (
              <button
                className={`search-btn ${isLoading ? "loading" : ""}`}
                onClick={handleSearch}
                disabled={!image || isLoading}
              >
                <span>Find Car Model</span>
              </button>
            )}

            {image && !isLoading && (
              <button
                className="search-btn"
                onClick={handleRemoveFile}
                type="button"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCar;
