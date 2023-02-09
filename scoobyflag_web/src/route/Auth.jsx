import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [authMode, setAuthMode] = useState("signin");
    const [email, setEmail] = useState('');
    const [mdp, setMdp] = useState('');
    const [mdpConfirm, setMdpConfirm] = useState('');
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        console.log(localStorage.getItem("user"));
        if (localStorage.getItem("user") != null && localStorage.getItem("user") != "undefined") {
            navigate("/dashboard");
        }
    })


    function setToken(userToken) {
        localStorage.setItem('user', JSON.stringify(userToken));
    }

    function handleLogin(e) {
        e.preventDefault();

        return fetch("http://cdad162.iutrs.unistra.fr:8080/APIShareLoc-1.0-SNAPSHOT/api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: mdp
            }),
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                else {
                    throw new Error("Mauvais identifiant");
                }
            })
            .then(json => {
                setToken(json);
                navigate('/dashboard');
            })

        //navigate('/dashboard');
    }

    function handleSignup(e) {
        e.preventDefault();

        if (mdp == mdpConfirm) {
            let user = JSON.stringify({
                firstname: prenom,
                lastname: nom,
                email: email,
                password: mdp,
            });
            return fetch(
                "http://cdad162.iutrs.unistra.fr:8080/APIShareLoc-1.0-SNAPSHOT/api/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: user,
                }
            )
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    }
                    else {
                        throw new Error("Erreur");
                    }
                })
                .then(json => {
                    setToken(json);
                    navigate('/dashboard');
                })
        }
        else {
            throw new Error("Les mot de passes de correspondent pas");
        }
    }

    function changeAuthMode() {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
    }

    if (authMode == "signin") {
        return (<>
            <h1>Connexion</h1>

            <form className="formLogin" onSubmit={handleLogin}>
                <label htmlFor="email">Email</label>
                <input onChange={(e) => setEmail(e.target.value)} type="mail" name="email" id="email" required></input>
                <label htmlFor="mdp">Mot de passe</label>
                <input onChange={(e) => setMdp(e.target.value)} type="password" name="mdp" id="mdp" required></input>

                <button className="boutonCustom" type="submit">Connexion</button>
            </form>

            <button className="boutonCustom" onClick={changeAuthMode}>Créer un compte</button>
        </>)
    }
    else {
        return (<>
            <h1>Créer votre compte</h1>

            <form className="formLogin" onSubmit={handleSignup}>
                <label htmlFor="email">Email</label>
                <input onChange={(e) => setEmail(e.target.value)} type="mail" name="email" id="email" value={email} required></input>
                <label htmlFor="mdp">Mot de passe</label>
                <input onChange={(e) => setMdp(e.target.value)} type="password" name="mdp" id="mdp" value={mdp} required></input>
                <label htmlFor="mdpConfirm">Confirmez le mot de passe</label>
                <input onChange={(e) => setMdpConfirm(e.target.value)} type="password" name="mdpConfirm" id="mdpConfirm" value={mdpConfirm} required></input>
                <label htmlFor="prenom">Prénom</label>
                <input onChange={(e) => setPrenom(e.target.value)} type="text" name="prenom" id="prenom" value={prenom} required></input>
                <label htmlFor="nom">Nom</label>
                <input onChange={(e) => setNom(e.target.value)} type="text" name="nom" id="nom" value={nom} required></input>

                <button className="boutonCustom" type="submit">Créer votre compte</button>
            </form>

            <button className="boutonCustom" onClick={changeAuthMode}>Se connecter</button>
        </>)
    }
}