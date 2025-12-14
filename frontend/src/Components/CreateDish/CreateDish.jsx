import React, { useState } from "react";
import "./CreateDish.css"; 

const CreateDish = ({ onDishCreated, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dishData = {
      name,
      description,
      category,
      price,
      photo,
    };
    const PORT = import.meta.env.VITE_PORT;
    try {
      const response = await fetch(`http://localhost:${PORT}/api/dish/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dishData),
      });

      if (!response.ok) {
        throw new Error("Ошибка при создании блюда");
      }

      const newDish = await response.json();
      setSuccess(`Блюдо "${newDish.name}" успешно создано!`);
      setError(null);
      resetForm();
      onDishCreated();
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setPhoto("");
    onClose(); 
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
         <h1>New Dish</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Choose One</option>
              <option value="main">Main Dish</option>
              <option value="starter">Starter</option>
              <option value="drinks">Drink</option>
              <option value="dessert">Dessert</option>
            </select>
          </div>

          <div>
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Photo (URL):</label>
            <input
              type="text"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              required
            />
          </div>
          <button type="submit">Create</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </div>
    </div>
  );
};

export default CreateDish;
