import { useState } from "react";
import "./CommentCard.css";

const CommentCard = () => {
  const [coment, setComment] = useState("");
  const [, setError] = useState(null);
  let userId = sessionStorage.getItem("userId");

  const sendMessage = () => {
    const PORT = import.meta.env.VITE_PORT;
    fetch(`http://localhost:${PORT}/api/review/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, coment }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Сетевая ошибка: ответ не был успешным");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Комментарий отправлен:", data);
        setComment("");
        setError(null);
      })
      .catch((error) => {
        console.error("Ошибка при отправке данных:", error);
        setError(error.message);
      });
  };

  return (
    <div className="comment">
      <img
        className="commentPhoto"
        src="./public/images/profile.png"
        alt="photo"
      />

      <input
        className="reviewText"
        placeholder="Write A Message"
        type="text"
        value={coment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button onClick={sendMessage} className="filleadButton">
        Send
      </button>
    </div>
  );
};

export default CommentCard;
