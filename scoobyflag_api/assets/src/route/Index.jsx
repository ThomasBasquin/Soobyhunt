import React from "react";
import "../css/main.css";
import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";

export default function Index() {
  return (
    <div className="fondSamy">
      <img
        src="../../assets/logo.png"
        style={{ width: 200, paddingBottom: 40, marginLeft: 80 }}
      />
      <div className="" style={{ marginLeft: 80 }}>
        <div className="titre">Scooby-Dooby-Dooooo !</div>
        <div className="presentation">
          <p>Plongez dans l'univers de Scooby-Doo avec l'application mobile ScoobyHunt : une aventure de capture de méchants en équipe.</p>
          <p>Venez jouer à  ScoobyHunt, le jeu  qui vous transporte dans l'univers captivant de Scooby-Doo. Préparez-vous à vivre une aventure palpitante de chasse aux méchants en équipe, directement depuis votre téléphone portable.</p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "800px",
            height: 100,
          }}
        >
          {/*//TODO <Link className="createGame" to="/app/login" style={{ marginRight: 40 }}>
            Se connecter
          </Link> */}
          <button className="createGame" style={{ marginRight: 40 }}>
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}

renderOnDomLoaded(<Index />, "index");
