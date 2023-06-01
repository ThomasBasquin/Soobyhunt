import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";
import React, { useEffect } from "react";
import style from "./Home.module.scss";

export default function Home(){
   
    
    return <>
    <p className={style.title}>Accueil</p>
    <button onClick={()=> document.location.href="/choiceTeam"}>Aller au choix des équipes</button>
    <button onClick={()=> document.location.href="/game"}>Aller à la partie de jeu</button>
    </>
}

renderOnDomLoaded(<Home />,"ChooseTeamRoot");