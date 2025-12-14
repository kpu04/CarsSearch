import { useState } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ProfileCard from "../../Components/ProfileComponent/ProfileComponent";
import AdminReview from "../../Components/AdminReview/AdminReview";
import AdminMenu from "../../Components/AdminCatalog/AdminCatalog";
import "./AdminPage.css";
import AdminResults from "../../Components/AdminResults/AdminResults";
const AdminPage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showResults, setShowResult] = useState(false);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const toggleReviews = () => {
    setShowReviews((prev) => !prev);
  };

  const toggleResults = () => {
    setShowResult((prev) => !prev);
  };

  return (
    <div className="adminPage">
      <Header />
      <ProfileCard />

      <div className="text">
        <h1>View Catalog</h1>
        <ArrowDropDownIcon fontSize="large" onClick={toggleMenu} />
      </div>
      {showMenu && <AdminMenu />}
      <hr></hr>
      <div className="text">
        <h1> View Reviews</h1>
        <ArrowDropDownIcon fontSize="large" onClick={toggleReviews} />
      </div>
      {showReviews && <AdminReview />}
      <hr></hr>
      <div className="text">
        <h1> View Results</h1>
        <ArrowDropDownIcon fontSize="large" onClick={toggleResults} />
      </div>
      {showResults && <AdminResults />}

      <Footer />
    </div>
  );
};

export default AdminPage;
