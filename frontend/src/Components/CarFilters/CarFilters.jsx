// components/CarFilters.jsx
import React, { useState, useEffect } from "react";
import "./CarFilters.css";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
const CarFilters = ({
  onFilterChange,
  initialFilters = {},
  brands = [],
  fuelTypes = [],
  transmissions = [],
  minPrice = 0,
  maxPrice = 100000,
  minMileage = 0,
  maxMileage = 200000,
  minEngine = 0.5,
  maxEngine = 8.0,
  closeFilters,
}) => {
  const [filters, setFilters] = useState({
    minPrice: initialFilters.minPrice || minPrice,
    maxPrice: initialFilters.maxPrice || maxPrice,
    minMileage: initialFilters.minMileage || minMileage,
    maxMileage: initialFilters.maxMileage || maxMileage,
    minEngineVolume: initialFilters.minEngineVolume || minEngine,
    maxEngineVolume: initialFilters.maxEngineVolume || maxEngine,
    brandId: initialFilters.brandId || "",
    fuelTypeId: initialFilters.fuelTypeId || "",
    transmissionId: initialFilters.transmissionId || "",
    year: initialFilters.year || "",
    sortBy: initialFilters.sortBy || "price_asc",
  });

  const years = Array.from(
    { length: new Date().getFullYear() - 1999 },
    (_, i) => new Date().getFullYear() - i
  );

  const sortOptions = [
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "year_desc", label: "Year: Newest First" },
    { value: "year_asc", label: "Year: Oldest First" },
    { value: "mileage_asc", label: "Mileage: Low to High" },
    { value: "mileage_desc", label: "Mileage: High to Low" },
  ];

  const handleChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleRangeChange = (field, value) => {
    const numValue = parseFloat(value) || 0;

    if (field === "minPrice" && numValue > filters.maxPrice) {
      const updatedFilters = {
        ...filters,
        minPrice: numValue,
        maxPrice: numValue,
      };
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
      return;
    }

    if (field === "maxPrice" && numValue < filters.minPrice) {
      const updatedFilters = {
        ...filters,
        maxPrice: numValue,
        minPrice: numValue,
      };
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
      return;
    }

    const updatedFilters = { ...filters, [field]: numValue };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      minPrice: minPrice,
      maxPrice: maxPrice,
      minMileage: minMileage,
      maxMileage: maxMileage,
      minEngineVolume: minEngine,
      maxEngineVolume: maxEngine,
      brandId: "",
      fuelTypeId: "",
      transmissionId: "",
      year: "",
      sortBy: "price_asc",
    };

    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Форматирование чисел для отображения
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatEngine = (engine) => {
    return `${engine.toFixed(1)}L`;
  };

  return (
    <div className="car-filters-container">
      <div className="car-filters">
        <div className="filters-header">
          <h3>Filter & Sort</h3>
          <button className="reset-button" onClick={handleReset} type="button">
            <RotateLeftIcon />
          </button>
          <button className="close-button" onClick={closeFilters} type="button">
            &times;
          </button>
        </div>

        <div className="filters-grid">
          <div className="filter-section">
            <label className="filter-label">Price Range</label>
            <div className="range-inputs">
              <div className="range-input-group">
                <span className="range-prefix">From</span>
                <input
                  type="number"
                  min={minPrice}
                  max={maxPrice}
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleRangeChange("minPrice", e.target.value)
                  }
                  className="range-input"
                />
                <span className="range-suffix">
                  {formatPrice(filters.minPrice)}
                </span>
              </div>
              <div className="range-input-group">
                <span className="range-prefix">To</span>
                <input
                  type="number"
                  min={minPrice}
                  max={maxPrice}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleRangeChange("maxPrice", e.target.value)
                  }
                  className="range-input"
                />
                <span className="range-suffix">
                  {formatPrice(filters.maxPrice)}
                </span>
              </div>
            </div>
            <div className="range-slider-container">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={filters.minPrice}
                onChange={(e) => handleRangeChange("minPrice", e.target.value)}
                className="range-slider min-slider"
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={filters.maxPrice}
                onChange={(e) => handleRangeChange("maxPrice", e.target.value)}
                className="range-slider max-slider"
              />
            </div>
          </div>

          {/* Mileage Range */}
          <div className="filter-section">
            <label className="filter-label">Mileage (km)</label>
            <div className="range-inputs">
              <div className="range-input-group">
                <span className="range-prefix">From</span>
                <input
                  type="number"
                  min={minMileage}
                  max={maxMileage}
                  value={filters.minMileage}
                  onChange={(e) =>
                    handleRangeChange("minMileage", e.target.value)
                  }
                  className="range-input"
                />
                <span className="range-suffix">
                  {formatNumber(filters.minMileage)}
                </span>
              </div>
              <div className="range-input-group">
                <span className="range-prefix">To</span>
                <input
                  type="number"
                  min={minMileage}
                  max={maxMileage}
                  value={filters.maxMileage}
                  onChange={(e) =>
                    handleRangeChange("maxMileage", e.target.value)
                  }
                  className="range-input"
                />
                <span className="range-suffix">
                  {formatNumber(filters.maxMileage)}
                </span>
              </div>
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Engine Volume</label>
            <div className="range-inputs">
              <div className="range-input-group">
                <span className="range-prefix">From</span>
                <input
                  type="number"
                  step="0.1"
                  min={minEngine}
                  max={maxEngine}
                  value={filters.minEngineVolume}
                  onChange={(e) =>
                    handleRangeChange("minEngineVolume", e.target.value)
                  }
                  className="range-input"
                />
                <span className="range-suffix">
                  {formatEngine(filters.minEngineVolume)}
                </span>
              </div>
              <div className="range-input-group">
                <span className="range-prefix">To</span>
                <input
                  type="number"
                  step="0.1"
                  min={minEngine}
                  max={maxEngine}
                  value={filters.maxEngineVolume}
                  onChange={(e) =>
                    handleRangeChange("maxEngineVolume", e.target.value)
                  }
                  className="range-input"
                />
                <span className="range-suffix">
                  {formatEngine(filters.maxEngineVolume)}
                </span>
              </div>
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Brand</label>
            <select
              value={filters.brandId}
              onChange={(e) => handleChange("brandId", e.target.value)}
              className="filter-select"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fuel Type Select */}
          <div className="filter-section">
            <label className="filter-label">Fuel Type</label>
            <select
              value={filters.fuelTypeId}
              onChange={(e) => handleChange("fuelTypeId", e.target.value)}
              className="filter-select"
            >
              <option value="">All Fuel Types</option>
              {fuelTypes.map((fuelType) => (
                <option key={fuelType.id} value={fuelType.id}>
                  {fuelType.name}
                </option>
              ))}
            </select>
          </div>

          {/* Transmission Select */}
          <div className="filter-section">
            <label className="filter-label">Transmission</label>
            <select
              value={filters.transmissionId}
              onChange={(e) => handleChange("transmissionId", e.target.value)}
              className="filter-select"
            >
              <option value="">All Transmissions</option>
              {transmissions.map((transmission) => (
                <option key={transmission.id} value={transmission.id}>
                  {transmission.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Select */}
          <div className="filter-section">
            <label className="filter-label">Year</label>
            <select
              value={filters.year}
              onChange={(e) => handleChange("year", e.target.value)}
              className="filter-select"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="filter-section">
            <label className="filter-label">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleChange("sortBy", e.target.value)}
              className="filter-select"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="active-filters">
          <h4>Active Filters:</h4>
          <div className="active-filters-list">
            {filters.minPrice > minPrice && filters.maxPrice < maxPrice && (
              <span className="active-filter-tag">
                Price: {formatPrice(filters.minPrice)} -{" "}
                {formatPrice(filters.maxPrice)}
              </span>
            )}
            {filters.minMileage > minMileage &&
              filters.maxMileage < maxMileage && (
                <span className="active-filter-tag">
                  Mileage: {formatNumber(filters.minMileage)} -{" "}
                  {formatNumber(filters.maxMileage)} km
                </span>
              )}
            {filters.minEngineVolume > minEngine &&
              filters.maxEngineVolume < maxEngine && (
                <span className="active-filter-tag">
                  Engine: {formatEngine(filters.minEngineVolume)} -{" "}
                  {formatEngine(filters.maxEngineVolume)}
                </span>
              )}
            {filters.brandId && (
              <span className="active-filter-tag">
                Brand:{" "}
                {brands.find((b) => b.id == filters.brandId)?.name ||
                  filters.brandId}
              </span>
            )}
            {filters.fuelTypeId && (
              <span className="active-filter-tag">
                Fuel:{" "}
                {fuelTypes.find((f) => f.id == filters.fuelTypeId)?.name ||
                  filters.fuelTypeId}
              </span>
            )}
            {filters.transmissionId && (
              <span className="active-filter-tag">
                Transmission:{" "}
                {transmissions.find((t) => t.id == filters.transmissionId)
                  ?.name || filters.transmissionId}
              </span>
            )}
            {filters.year && (
              <span className="active-filter-tag">Year: {filters.year}</span>
            )}
            {Object.values(filters).every(
              (val) =>
                val === "" ||
                val === minPrice ||
                val === maxPrice ||
                val === minMileage ||
                val === maxMileage ||
                val === minEngine ||
                val === maxEngine ||
                val === "price_asc"
            ) && <span className="no-filters">No filters applied</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarFilters;
