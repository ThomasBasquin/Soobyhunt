import React from "react";
import { Link } from "react-router-dom";
import "../css/main.css";

export default function Index() {
  // async function createGame() {
  //   const response = await fetch("http://localhost:8000/api/game/create", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       name: "test",
  //       description: "test",
  //       maxPlayer: 10,
  //     }),
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // }
   return (
    <div className="fondSamy">
      <img
        src="logo.png"
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
          <Link className="createGame" to="/login" style={{ marginRight: 40 }}>
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
