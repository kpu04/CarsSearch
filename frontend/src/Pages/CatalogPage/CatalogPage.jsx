import { useState, useEffect } from "react";
import "./CatalogPage.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import MenuCard from "../../Components/CatalogCard/CatalogCard";
import ReviewCard from "../../Components/ReviewCard/ReviewCard";
import CommentCard from "../../Components/CommentCard/CommentCard";
import { Button } from "@mui/material";
import Search from "../../Components/Search/Search";
import CarFilters from "../../Components/CarFilters/CarFilters";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import TuneIcon from "@mui/icons-material/Tune";
import SearchCar from "../../Components/SearchCar/SearchCar";

const MenuPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isFilterOpen, setFilter] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [filterData, setFilterData] = useState({
    brands: [],
    fuelTypes: [],
    transmissions: [],
  });
  const handleSearch = (value) => {
    setSearchValue(value);
  };
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const PORT = import.meta.env.VITE_PORT;

        const [brandsRes, fuelRes, transRes] = await Promise.all([
          fetch(`http://localhost:${PORT}/api/car/filter/brands`).then((res) =>
            res.json()
          ),
          fetch(`http://localhost:${PORT}/api/car/filter/fuel-types`).then(
            (res) => res.json()
          ),
          fetch(
            `http://localhost:${PORT}/api/car/filter/transmission-types`
          ).then((res) => res.json()),
        ]);

        setFilterData({
          brands: brandsRes || [],
          fuelTypes: fuelRes || [],
          transmissions: transRes || [],
        });
      } catch (error) {
        console.error("Error loading filter data:", error);
      }
    };

    loadFilterData();
  }, []);

  const handleFilterChange = (newFilters) => {
    console.log("Filters updated:", newFilters);
    setFilters(newFilters);
  };

  const handleSearchOpen = () => {
    setSearchOpen(() => true);
  };

  const handleSearchClose = () => {
    setSearchOpen(() => false);
  };

  return (
    <div>
      <Header />
      <div className="filters">
        <Button onClick={handleSearchOpen}>
          <ImageSearchIcon />
        </Button>
        {isSearchOpen && (
          <SearchCar onClick={handleSearchClose} returnResult={handleSearch} />
        )}

        <Search searchValue={searchValue} onChange={handleSearch} />

        {isFilterOpen ? (
          <CarFilters
            onFilterChange={handleFilterChange}
            brands={filterData.brands}
            fuelTypes={filterData.fuelTypes}
            transmissions={filterData.transmissions}
            minPrice={0}
            maxPrice={100000}
            minMileage={0}
            maxMileage={200000}
            minEngine={0.5}
            maxEngine={8.0}
            closeFilters={() => setFilter(false)}
          />
        ) : (
          <Button onClick={() => setFilter(true)}>
            <TuneIcon />
          </Button>
        )}
      </div>

      <MenuCard searchValue={searchValue} filters={filters} />
      <section className="reviewSection">
        <div>
          <h1>Our Clients Say</h1>
          <p className="littleLight">
            We love to hear from customers, so please leave a comment or say
            hello in an email.
          </p>
        </div>
        <ReviewCard />
        <CommentCard />
      </section>
      <Footer />
    </div>
  );
};

export default MenuPage;
