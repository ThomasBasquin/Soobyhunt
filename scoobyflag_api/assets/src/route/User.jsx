import React, { useState } from "react";
import "../css/user.css";
import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";

export default function User() {
  const [activeItem, setActiveItem] = useState("infos");

  function logout() {
    localStorage.clear("user");
    // navigate("/");//TODO
  }

  return (
    <div className="fond-degrade">
      <div className="header">
        <div className="header-gauche">
          <img
            src="../assets/fleche.png"
            alt="logo"
            className="logo-header-profil"
            // onClick={() => navigate("/app/dashboard")}//TODO
          />
          <div className="titre-header">ScoobyHunt</div>
        </div>
        <ul className="menu-list">
          <li onClick={() => setActiveItem("infos")}>
            <h2
              className={`second-title ${activeItem === "infos" ? "active" : ""
                }`}
            >
              Mes infos
            </h2>
          </li>
          <li onClick={() => setActiveItem("stats")}>
            <h2
              className={`second-title ${activeItem === "stats" ? "active" : ""
                }`}
            >
              Mes stats
            </h2>
          </li>
          <li onClick={() => setActiveItem("parties")}>
            <h2
              className={`second-title ${activeItem === "parties" ? "active" : ""
                }`}
            >
              Mes parties
            </h2>
          </li>
        </ul>
        <button className="btn-deconnect" onClick={logout}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

renderOnDomLoaded(<User />,"user");
