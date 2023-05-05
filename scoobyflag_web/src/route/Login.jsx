import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../css/login.css';

export default function Login() {
    const [authMode, setAuthMode] = useState("signin");
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    function submitLogin(e) {
        e.preventDefault();

        return fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pseudo: pseudo,
                password: password
            }),
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                else {
                    throw new Error("Erreur");
                }
            })
            .then(json => {
                console.log(json);
                //setToken(json);
                //navigate('/dashboard');
            })

        navigate("/dashboard");
    }

    function submitCreate(e) {
        e.preventDefault();

        return fetch("http://127.0.0.1:8000/user/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pseudo: pseudo,
                email: email,
                password: password
            }),
        })
            .then(res => {
                console.log(res);
                if (res.ok) {
                    return res.json();
                }
                else {
                    throw new Error("Erreur");
                }
            })
            .then(json => {
                console.log(json);
                //setToken(json);
                //navigate('/dashboard');
            })

        //navigate("/dashboard");
    }

    function changeAuthMode() {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
    }

    return <div className="fond-degrade">
        {authMode == "signin" ? <div className='div-login'>
            <img src="scooby.png" alt="" className='scooby' />

            <div className='zone-login'>
                <img src="logo.png" alt="" className='logo' />

                <form onSubmit={submitLogin} method='post' id='formLogin'>
                    <label htmlFor="pseudo">Identifiant</label>
                    <input type="text" id='pseudo' value={pseudo} onChange={(e) => setPseudo(e.target.value)} required />
                    <label htmlFor="mdp">Mot de passe</label>
                    <input type="password" id='mdp' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <input type="submit" value="Se connecter" className='custom-button' />
                </form>

                <p><div onClick={changeAuthMode} className='change-auth'>Créer un compte</div></p>
            </div>

            <img src="vera.png" alt="" className='vera' />
        </div> : <div className='div-login'>
            <img src="daphnee.png" alt="" className='daphnee' />

            <div className='zone-login'>
                <img src="logo.png" alt="" className='logo' />

                <form onSubmit={submitCreate} method='post' id='formLogin'>
                    <label htmlFor="email">E-mail</label>
                    <input type="text" id='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="pseudo">Identifiant</label>
                    <input type="text" id='pseudo' value={pseudo} onChange={(e) => setPseudo(e.target.value)} required />
                    <label htmlFor="mdp">Mot de passe</label>
                    <input type="password" id='mdp' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label htmlFor="mdp">Confirmer le mot de passe</label>
                    <input type="password" id='confirm-mdp' />
                    <input type="submit" value="Créer un compte" className='custom-button' />
                </form>

                <p>Vous avez un compte ?&nbsp;<div onClick={changeAuthMode} className='change-auth'>Se connecter</div></p>
            </div >

            <img src="fred.png" alt="" className='fred' />
        </div >}
    </div >
}