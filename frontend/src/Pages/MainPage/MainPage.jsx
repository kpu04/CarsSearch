import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "../../Components/Header/Header";
import OfferCard from "../../Components/OfferCard/OfferCard";
import Footer from "../../Components/Footer/Footer";
import { clearCredentials } from "../../Store/authStore";
import "./MainPage.css";
import YandexMap from "../../Components/YandexMap/YandexMap";

const MainPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleBeforeUnload = () => {
      dispatch(clearCredentials());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch]);

  return (
    <div className="mainPage">
      <Header />

      <section className="mainSection">
        <div className="mainText">
          <h1 className="mainH">Welcome To AutoStore</h1>

          <p className="mainP">
            Welcome to our professional car dealership! We're here to make your
            dream of a reliable and comfortable vehicle come true. Over 5,000
            satisfied customers have already enjoyed our service. Join them!
          </p>

          <button className="contoureButton">
            <Link to={{ pathname: "/catalog" }}>Catalog</Link>
          </button>
        </div>
        <img
          style={{
            height: 450,
            borderRadius: 20,
          }}
          src="./images/car.png"
          alt="Main"
        />
      </section>

      <section className="informationSection">
        <YandexMap />
        <div className="deliciousStory">
          <div>
            <h2>The Our Story</h2>
            <p>
              Our dealership was founded with the goal of making car buying
              accessible and enjoyable. We are expanding, offering a wide
              selection of vehicles from trusted manufacturers. We pride
              ourselves on helping our customers find the perfect car and look
              forward to achieving new milestones with you!
            </p>
          </div>
          <div className="blockYear">
            <div className="year">
              <h2>2018</h2>
              <p>The first store was founded in Paris.</p>
            </div>
            <div className="year">
              <h2>2020</h2>
              <p>Founded more than 100 points in Europe.</p>
            </div>
          </div>
        </div>
      </section>

      <img className="lanterns" src="./images/car2.png" alt="Lanterns" />

      <section className="offerSection">
        <div className="offerText">
          <h4>What we offer</h4>
          <h2>Our Great Services</h2>
          <p>
            At our dealership, we provide a comprehensive range of services to
            meet all your automotive needs. We have an extensive inventory of
            vehicles from trusted brands, ensuring quality and reliability for
            every customer.
          </p>
        </div>
        <OfferCard />
      </section>

      <Footer />
    </div>
  );
};

export default MainPage;
