import React, { useState, useEffect } from "react";
import "./OfferCard.css";
const OfferCard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/Data/OfferCard.json")
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  return (
    <div className="offerCardBlock">
      {data.map((item, index) => (
        <div className="offerCard" key={index}>
          <img src={item.offerPhoto}></img>
          <h3>{item.h3}</h3>
        </div>
      ))}
    </div>
  );
};

export default OfferCard;
