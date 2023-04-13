import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";
import React from "react";
import style from "./Game.module.scss";

export default function Game(){

    return <><p className={style.title}>Partie de jeu</p>
        <button onClick={()=> document.location.href="/choiceTeam"}>Aller au choix des équipes</button>
    <button onClick={()=> document.location.href="/"}>Aller à l'accueil</button>
</>
}

renderOnDomLoaded(<Game />,"GameRoot");