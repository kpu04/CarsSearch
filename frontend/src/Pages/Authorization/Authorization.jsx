import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../Store/authStore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Authorization.css";

const Authorization = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state) => state.auth.email);
  const password = useSelector((state) => state.auth.password);

  const handleAuthorization = async () => {
    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    const PORT = import.meta.env.VITE_PORT;

    const response = await fetch(
      `http://localhost:${PORT}/api/authorization/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      alert(data.error || "Authorization failed");
    } else {
      console.log(`Authorization successful!`, data);
      const { id, role } = data.user;

      // sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("userId", id);
      sessionStorage.setItem("email", email);

      if (role === "user") {
        navigate("/profile");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="authorization">
      <div>
        <h1>Authorization</h1>
        <label>E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) =>
            dispatch(setCredentials({ email: e.target.value, password }))
          }
          placeholder="Input Your E-mail"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) =>
            dispatch(setCredentials({ email, password: e.target.value }))
          }
          placeholder="Enter A password"
        />
        <span>
          <Link className="button" to={"/reg"}>
            Go To Registration
          </Link>
          <button className="button" onClick={handleAuthorization}>
            Send
          </button>
        </span>
      </div>
    </div>
  );
};

export default Authorization;
