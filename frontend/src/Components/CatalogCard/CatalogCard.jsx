import { useState, useEffect, useMemo } from "react";
import "./CatalogCard.css";

const MenuCard = ({ searchValue = "", filters }) => {
  const [cars, setCars] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAdd = (car) => {
    const exists = cartItems.find((c) => c.id === car.id);

    if (exists) {
      alert("This car is already in the cart.");
    } else {
      setCartItems([...cartItems, car]);
      alert("Car added to the cart.");
    }
  };

  useEffect(() => {
    const PORT = import.meta.env.VITE_PORT;
    setLoading(true);

    fetch(`http://localhost:${PORT}/api/car/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCars(data || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Ошибка загрузки:", err);
        setError(err.message);
        setCars([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredCars = useMemo(() => {
    if (!cars || cars.length === 0) return [];

    let result = [...cars];

    if (searchValue.trim()) {
      const lowerSearch = searchValue.toLowerCase().trim().split(" ").join("");
      result = result.filter((car) => {
        // const carBrand = car.brand?.toLowerCase() || "";
        // const carModel = car.model?.toLowerCase() || "";
        const carModelAndBrand =
          car.model?.toLowerCase() + car.brand?.toLowerCase() || "";
        const carBrandAndModel =
          car.brand?.toLowerCase() + car.model?.toLowerCase() || "";
        // return carBrand.includes(lowerSearch) || carModel.includes(lowerSearch);
        return (
          carModelAndBrand.includes(lowerSearch) ||
          carBrandAndModel.includes(lowerSearch)
        );
      });
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      result = result.filter((car) => {
        const price = car.price || 0;
        const minPrice = filters.minPrice || 0;
        const maxPrice = filters.maxPrice || Infinity;
        return price >= minPrice && price <= maxPrice;
      });
    }

    if (filters.minMileage !== undefined || filters.maxMileage !== undefined) {
      result = result.filter((car) => {
        const mileage = car.mileage || 0;
        const minMileage = filters.minMileage || 0;
        const maxMileage = filters.maxMileage || Infinity;
        return mileage >= minMileage && mileage <= maxMileage;
      });
    }

    if (
      filters.minEngineVolume !== undefined ||
      filters.maxEngineVolume !== undefined
    ) {
      result = result.filter((car) => {
        const engineVolume = car.engineVolume || 0;
        const minEngine = filters.minEngineVolume || 0;
        const maxEngine = filters.maxEngineVolume || Infinity;
        return engineVolume >= minEngine && engineVolume <= maxEngine;
      });
    }

    if (filters.brandId) {
      result = result.filter((car) => {
        const filterBrandId = parseInt(filters.brandId);
        const carBrandId = parseInt(car.brandId);

        return carBrandId === filterBrandId;
      });
    }

    if (filters.fuelTypeId) {
      result = result.filter((car) => {
        const filterFuelId = parseInt(filters.fuelTypeId);
        const carFuelId = parseInt(car.fuelTypeId);

        return carFuelId === filterFuelId;
      });
    }

    if (filters.transmissionId) {
      result = result.filter((car) => {
        const filterTransId = parseInt(filters.transmissionId);
        const carTransId = parseInt(car.transmissionId);

        return carTransId === filterTransId;
      });
    }

    if (filters.year) {
      result = result.filter((car) => car.year === parseInt(filters.year));
    }

    if (filters.sortBy) {
      result.sort((a, b) => {
        switch (filters.sortBy) {
          case "price_asc":
            return (a.price || 0) - (b.price || 0);
          case "price_desc":
            return (b.price || 0) - (a.price || 0);
          case "year_desc":
            return (b.year || 0) - (a.year || 0);
          case "year_asc":
            return (a.year || 0) - (b.year || 0);
          case "mileage_asc":
            return (a.mileage || 0) - (b.mileage || 0);
          case "mileage_desc":
            return (b.mileage || 0) - (a.mileage || 0);
          default:
            return 0;
        }
      });
    }

    return result;
  }, [cars, searchValue, filters]);

  if (loading) {
    return <div className="loading">Loading cars...</div>;
  }

  if (error) {
    return <div className="error">Error loading cars: {error}</div>;
  }

  if (!cars || cars.length === 0) {
    return <div className="empty">No cars available</div>;
  }

  return (
    <div className="catalog">
      {filteredCars.length === 0 ? (
        <div className="no-results">No cars found matching {searchValue}</div>
      ) : (
        <>
          {filteredCars.map((car) => (
            <div key={car.id} className="menuItem">
              <img
                className="menuPhoto"
                src={car.photo}
                alt={`${car.brandId} ${car.model}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
              <div>
                <h2 className="title">
                  {car.brand} {car.model}
                </h2>
                <span>
                  Year:{car.year} | Mileage: {car.mileage} | Engine Volume:{" "}
                  {car.engineVolume}L | Fuel:
                  {car.fuelType} | Transmission: {car.transmission}
                </span>
                <p className="description">{car.description}</p>
                <span className="price">
                  ${car.price?.toLocaleString() || "N/A"}
                </span>
              </div>

              <button className="filleadButton" onClick={() => handleAdd(car)}>
                Add to Cart
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default MenuCard;
