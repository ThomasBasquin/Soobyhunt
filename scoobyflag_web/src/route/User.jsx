import { useNavigate } from "react-router-dom";

export default function User() {
    const navigate = useNavigate();

    function logout() {
        localStorage.clear("user");
        navigate("/");
    }

    return <div className="fond-degrade">
        <div className="zone-blanche">
            <h1>Gestion de compte</h1>

            <h2>Stats</h2>

            <button className="custom-button" onClick={logout}>Se déconnecter</button>
        </div>
    </div>
}