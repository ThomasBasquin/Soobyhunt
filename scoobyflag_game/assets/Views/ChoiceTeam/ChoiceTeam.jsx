import React from "react";
import { useState, useEffect } from "react";
import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";
import style from "./ChoiceTeam.module.scss";

function ChoiceTeam() {
  const [nomPartie, setnomPartie] = useState("Hudog");
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "linear-gradient(#6B2B94, #EE9158)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <ListeJoueurs />
      <div className="boxBlanche">
        <h1 style={{ textAlign: "center" }}>Partie de {nomPartie}</h1>
      </div>
    </div>
  );
}

const ListeJoueurs = () => {
  const joueursConnectes = ["Hugo", "Roméo", "Lucas", "Thomas", "Gaetan"];
  
  return (
    <div className="listeJoueurs">
      <h2
        style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: 20,
          textDecoration: "underline",
        }}
      >
        Liste des joueurs connectés
      </h2>
      <div style={{display : 'flex', flexDirection : 'column', justifyContent : 'center'}}>
      {joueursConnectes.map((j)=> 
        
           <ItemJoueurs nom = {j} />
        
      )}
      </div>
    </div>
  );
};

const ItemJoueurs = ({nom}) => {
  return (
    <div style={{width: '90%', background : 'black', color : 'white', margin:10, borderRadius:15}}>
      <p style={{marginLeft:10}}>{nom}</p>
    </div>
  )
}
renderOnDomLoaded(<ChoiceTeam />, "ChoiceTeamRoot");
