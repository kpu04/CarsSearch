import { useState } from "react";
import "./Registration.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Registration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleRegistration = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("Пожалуйста, заполните все поля!");
      return;
    }

    // Проверка на совпадение паролей
    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Введите корректный адрес электронной почты!");
      return;
    }

    if (password.length < 6) {
      alert("Пароль должен содержать минимум 6 символов!");
      return;
    }

    const PORT = import.meta.env.VITE_PORT;
    const response = await fetch(
      `http://localhost:${PORT}/api/authorization/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      alert(data.error || "Ошибка регистрации");
    } else {
      console.log("Регистрация успешна!");

      // sessionStorage.setItem("username", username);
      // sessionStorage.setItem("email", email);
      // sessionStorage.setItem("userId", data.id);

      navigate("/login");
    }
  };

  return (
    <div className="registration">
      <div>
        <h1>Registration</h1>
        <span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Create Username"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Input Your E-mail"
          />
        </span>
        <span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter A password"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat A password"
          />
        </span>

        <span className="regButton">
          <Link className="button" to={"/login"}>
            back To Authorization
          </Link>
          <button className="button" onClick={handleRegistration}>
            Register
          </button>
        </span>
      </div>
    </div>
  );
};

export default Registration;
