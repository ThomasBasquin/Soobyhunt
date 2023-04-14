import React from "react";
import { useState, useEffect } from "react";
import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";
import style from "./ChoiceTeam.module.scss";

function ChoiceTeam(){

    const [nomPartie, setnomPartie] = useState("Hudog");
    return <div style={{height: "100%", width: "100%", background:"linear-gradient(#6B2B94, #EE9158)", display : 'flex', justifyContent: 'center', alignItems: 'center'}}>
       <div className="boxBlanche">
        <h1 style={{textAlign: 'center'}}>Partie de {nomPartie}</h1>
       </div>
    </div>
}

renderOnDomLoaded(<ChoiceTeam />,"ChoiceTeamRoot");
