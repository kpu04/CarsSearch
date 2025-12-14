import { useState, useEffect } from "react";
import "./ProfileComponent.css";

const ProfileComponent = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    const fetchData = async () => {
      const PORT = import.meta.env.VITE_PORT;
      try {
        let response;

        response = await fetch(`http://localhost:${PORT}/api/user/${userId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData.user);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="profileComponent">
      <div className="profileBlock">
        <div className="imageBlock">
          <img
            className="profileImage"
            src="./images/profile.png"
            alt="Profile"
          />
        </div>
        <div className="informationBlock">
          <div className="smallInformationBlock">
            <p className="smallText">Username</p>
            <p className="bigText">{data?.username || "Не указано"}</p>
          </div>
          <div>
            <p className="smallText">Email</p>
            <p className="bigText">{data?.email || "Не указано"}</p>
          </div>
        </div>
      </div>

      <div className="emailBlock">
        <div>
          <p className="smallText">Need help?</p>
          <p className="bigText">pashka0410@gmail.com</p>
        </div>

        <button className="contoureButton emailButton">
          <a href="mailto:pashka041022@gmail.com">Write message</a>
        </button>
      </div>
    </div>
  );
};

export default ProfileComponent;
