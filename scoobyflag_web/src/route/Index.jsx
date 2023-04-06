import { Link } from "react-router-dom";
import "../css/main.css";

export default function Index() {
  async function createGame() {
    const response = await fetch("http://localhost:8000/api/game/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "test",
        description: "test",
        maxPlayer: 10,
      }),
    });
    const data = await response.json();
    console.log(data);
  }

  return (
    <div className="fondSamy">
      <div className="" style={{marginLeft : 80}}>
      <div className="titre">CTF Grandeur nature !</div>
      <div className="presentation">
        Venez jouer sur le meilleur jeu de capture the Flag grandeur nature sur
        le thème Scooby-Doo
      </div>
      <Link className="createGame" to="/carte" onClick={() => createGame()}>
        Créer une partie
      </Link>
      </div>
    </div>
  );
}