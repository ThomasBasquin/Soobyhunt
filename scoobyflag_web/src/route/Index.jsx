import { Link } from "react-router-dom";

export default function Index() {
    return (<>
        <div className="titre">CTF Grandeur nature !</div>
        <div className="presentation">Venez joueur sur le meilleur jeu de capture the Flag grandeur nature sur le thème Scooby-Doo</div>
        <Link to="/dashboard">Créer une partie</Link>
    </>)
}