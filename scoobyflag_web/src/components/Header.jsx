import { Link } from "react-router-dom";
import "../css/header.css";

export default function Header() {
    return <header>
        <Link to="" className='active' id='home'>Accueil</Link> <Link to="/dashboard/map" id='map' className='link'>Map</Link> <Link to="/dashboard/config" id='config' className='link'>Config</Link> {/* <Link to="messages" id='messages' className='link'>Messages</Link> <Link to="user" id='user' className='link'>Utilisateur</Link>*/}
    </header>
}