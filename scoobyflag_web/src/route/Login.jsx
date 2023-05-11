import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../css/login.css';

export default function Login() {
    const [authMode, setAuthMode] = useState("signin");
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("user") != null) {
            navigate('/dashboard');
        }
    }, [])


    function submitLogin(e) {
        e.preventDefault();

        document.getElementById("feedbackLogin").style.display = "none";

        return fetch("https://scoobyhunt.fr/login", {
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
                    document.getElementById("feedbackLogin").style.display = "block";
                    throw new Error("Erreur de connexion");
                }
            })
            .then(json => {
                localStorage.setItem("user", json);
                navigate('/dashboard');
            })
    }

    function submitCreate(e) {
        e.preventDefault();

        document.getElementById("feedbackCreate").style.display = "none";

        //On controle si les 2 mdp sont identiques
        if (password == confirmPassword) {
            return fetch("https://scoobyhunt.fr/user/create", {
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
                        document.getElementById("feedbackCreate").style.display = "block";
                        document.getElementById("feedbackCreate").innerHTML = "Identifiant ou email déjà utilisé";
                        throw new Error("Erreur de création de compte");
                    }
                })
                .then(json => {
                    localStorage.setItem("user", json);
                    navigate('/dashboard');
                })
        }
        else {
            document.getElementById("feedbackCreate").innerHTML = "Les mots de passe ne correspondent pas";
            document.getElementById("feedbackCreate").style.display = "block";
        }
    }

    function changeAuthMode() {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
        setPseudo("");
        setPassword("");
        setEmail("");
        setConfirmPassword("");
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
                    <div className='feedback' id='feedbackLogin'>L'identifiant ou le mot de passe est incorrect</div>
                    <input type="submit" value="Se connecter" className='custom-button' />
                </form>

                <div onClick={changeAuthMode} className='change-auth txt-auth'>Créer un compte</div>
            </div>

            <img src="vera.png" alt="" className='vera' />
        </div> : <div className='div-login'>
            <img src="daphnee.png" alt="" className='daphnee' />

            <div className='zone-login'>
                <img src="logo.png" alt="" className='logo' />

                <form onSubmit={submitCreate} method='post' id='formLogin'>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="pseudo">Identifiant</label>
                    <input type="text" id='pseudo' value={pseudo} onChange={(e) => setPseudo(e.target.value)} required />
                    <label htmlFor="mdp">Mot de passe</label>
                    <input type="password" id='mdp' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label htmlFor="mdp">Confirmer le mot de passe</label>
                    <input type="password" id='confirm-mdp' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <div className='feedback' id='feedbackCreate'></div>
                    <input type="submit" value="Créer un compte" className='custom-button' />
                </form>

                <div className='txt-auth'>
                    Vous avez un compte ?&nbsp;<div onClick={changeAuthMode} className='change-auth'>Se connecter</div>
                </div>
            </div >

            <img src="fred.png" alt="" className='fred' />
        </div >}
    </div >
}