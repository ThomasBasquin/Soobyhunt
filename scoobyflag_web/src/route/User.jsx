import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/user.css";

export default function User() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("infos");

  function logout() {
    localStorage.clear("user");
    navigate("/");
  }

  return (
    <div className="fond-degrade">
      <div className="header">
        <div className="header-gauche">
          <img
            src="fleche.png"
            alt="logo"
            className="logo-header-profil"
            onClick={() => navigate("/dashboard")}
          />
          <div className="titre-header">ScoobyHunt</div>
        </div>
        <ul className="menu-list">
          <li onClick={() => setActiveItem("infos")}>
            <h2
              className={`second-title ${
                activeItem === "infos" ? "active" : ""
              }`}
            >
              Mes infos
            </h2>
          </li>
          <li onClick={() => setActiveItem("stats")}>
            <h2
              className={`second-title ${
                activeItem === "stats" ? "active" : ""
              }`}
            >
              Mes stats
            </h2>
          </li>
          <li onClick={() => setActiveItem("parties")}>
            <h2
              className={`second-title ${
                activeItem === "parties" ? "active" : ""
              }`}
            >
              Mes parties
            </h2>
          </li>
        </ul>
        <button className="custom-button" onClick={logout}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
