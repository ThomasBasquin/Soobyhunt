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
        style={{ width: 200, paddingBottom: 100, marginLeft: 80 }}
      />
      <div className="" style={{ marginLeft: 80 }}>
        <div className="titre">Scooby-Dooby-Dooooo !</div>
        <div className="presentation">
          Venez jouer sur le meilleur jeu de capture the Flag grandeur nature
          sur le thème Scooby-Doo
        </div>
        <div style={{display: 'flex', justifyContent : 'center', alignItems : 'center', width: '800px', height: 100}}>
          <Link className="createGame" to="/login" style={{marginRight:40}}>
            Se connecter
          </Link>
          <Link className="createGame" to="/dashboard">
            Continuer en invité
          </Link>
        </div>
      </div>
    </div>
  );
}
