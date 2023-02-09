import { Link } from "react-router-dom";
import "../css/main.css";

export default function Index() {
    return (<div className="fondSamy">
        <div className="infoAccueil">
        <div className="titre">CTF Grandeur nature !</div>
        <div className="presentation">Venez joueur sur le meilleur jeu de capture the Flag grandeur nature sur le thème Scooby-Doo</div>
        <Link className="createGame" to="/dashboard">Créer une partie</Link>
        </div>
    </div>)
}