import React, { useState, useEffect } from "react";
import "./ThesisCard.css";

const ThesisCard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/Data/thesisCard.json")
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="thesisSection">
      {data.map((item, index) => (
        <div className="thesisCard" key={index}>
          <button className="kruglick">
            <img src={item.photo} alt={item.h2} />
          </button>
          <div className="thesisText">
            <h2>{item.h2}</h2>
            <p>{item.p}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThesisCard;
