import React from "react";
import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";
import style from "./ChoiceTeam.module.scss";

function ChoiceTeam(){
    return <><p className={style.title}>Choix des équipes</p>
        <button onClick={()=> document.location.href="/"}>Aller à l'accueil</button>
    <button onClick={()=> document.location.href="/game"}>Aller à la partie de jeu</button>
</>
}

renderOnDomLoaded(<ChoiceTeam />,"ChoiceTeamRoot");
