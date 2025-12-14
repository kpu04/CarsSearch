import { useState, useEffect } from "react";
import MainPage from "./Pages/MainPage/MainPage";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import AdminPage from "./Pages/AdminPage/AdminPage";
import Registration from "./Pages/Registration/Registration";
import Authorization from "./Pages/Authorization/Authorization";
import { clearCredentials } from "./Store/authStore";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import CatalogPage from "./Pages/CatalogPage/CatalogPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      dispatch(clearCredentials());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/reg" element={<Registration />} />
        <Route path="/login" element={<Authorization />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route element={<PrivateRoute allowedRoles={["admin"]} />}></Route>
        <Route element={<PrivateRoute allowedRoles={["user"]} />}></Route>

        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
