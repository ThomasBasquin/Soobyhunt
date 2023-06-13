import React, { useEffect, useState } from 'react';
import '../css/login.css';
import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";

export default function Login() {
    const [authMode, setAuthMode] = useState("signin");
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");
    // const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("user") != null) {
            // navigate('/app/dashboard'); //TODO
        }
    }, [])


    function submitLogin(e) {
        e.preventDefault();

        setFeedback("");

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
                    setFeedback("L'identifiant ou le mot de passe est incorrect")
                    throw new Error("Erreur de connexion");
                }
            })
            .then(json => {
                localStorage.setItem("user", JSON.stringify(json));
                // navigate('/app/dashboard'); //TODO
            })
    }

    function submitCreate(e) {
        e.preventDefault();

        setFeedback("");

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
                        setFeedback("Identifiant ou email déjà utilisé");
                        throw new Error("Erreur de création de compte");
                    }
                })
                .then(json => {
                    changeAuthMode();
                    setFeedback("Votre compte a été créé avec succès !");
                })
        }
        else {
            setFeedback("Les mots de passe ne correspondent pas");
        }
    }

    function changeAuthMode() {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
        setPseudo("");
        setPassword("");
        setEmail("");
        setConfirmPassword("");
        setFeedback("");
    }

    return <div className="fond-degrade-login">
        {authMode == "signin" ? <div className='div-login'>
            <img src="../assets/scooby.png" alt="" className='scooby' />

            <div className='zone-login'>
                <img src="../assets/logo.png" alt="" className='logo' />

                <form onSubmit={submitLogin} method='post' id='formLogin'>
                    <label htmlFor="pseudo">Identifiant</label>
                    <input type="text" id='pseudo' value={pseudo} onChange={(e) => setPseudo(e.target.value)} required />
                    <label htmlFor="mdp">Mot de passe</label>
                    <input type="password" id='mdp' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <div className='feedback'>{feedback}</div>
                    <input type="submit" value="Se connecter" className='custom-button' />
                </form>

                <div onClick={changeAuthMode} className='change-auth txt-auth'>Créer un compte</div>
            </div>

            <img src="../assets/vera.png" alt="" className='vera' />
        </div> : <div className='div-login'>
            <img src="../assets/daphnee.png" alt="" className='daphnee' />

            <div className='zone-login'>
                <img src="../assets/logo.png" alt="" className='logo' />

                <form onSubmit={submitCreate} method='post' id='formLogin'>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="pseudo">Identifiant</label>
                    <input type="text" id='pseudo' value={pseudo} onChange={(e) => setPseudo(e.target.value)} required />
                    <label htmlFor="mdp">Mot de passe</label>
                    <input type="password" id='mdp' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label htmlFor="mdp">Confirmer le mot de passe</label>
                    <input type="password" id='confirm-mdp' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <div className='feedback'>{feedback}</div>
                    <input type="submit" value="Créer un compte" className='custom-button' />
                </form>

                <div className='txt-auth'>
                    Vous avez un compte ?&nbsp;<div onClick={changeAuthMode} className='change-auth'>Se connecter</div>
                </div>
            </div >

            <img src="../assets/fred.png" alt="" className='fred' />
        </div >}
    </div >
}

renderOnDomLoaded(<Login />, "login");