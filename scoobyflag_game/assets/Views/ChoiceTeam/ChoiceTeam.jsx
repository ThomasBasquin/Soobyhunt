import React from "react";
import { useState, useEffect } from "react";
import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";
import style from "./ChoiceTeam.module.scss";

function ChoiceTeam() {
  const [nomPartie, setnomPartie] = useState("Hudog");
  const nomsEquipe = [
    {
      id: 1,
      nom: "Les Foufous",
      nbPlace: Array.from({ length: 10 }, (v, i) => i),
    },
    {
      id: 2,
      nom: "CBONPOURVOUS",
      nbPlace: Array.from({ length: 5 }, (v, i) => i),
    },
    { id: 3, 
      nom: "OuaisCGreg", 
      nbPlace: Array.from({ length: 5 }, (v, i) => i) },
  ];

  const selected = useState("");
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
      <ListeJoueurs selected={selected}/>
      <ChoixEquipe nomPartie={nomPartie} nomsEquipe={nomsEquipe} selected={selected}/>
    </div>
  );
}

const ChoixEquipe = ({ nomPartie, nomsEquipe, selected }) => {
  return (
    <div className="boxBlanche">
      <h1 style={{ textAlign: "center", textDecoration: "underline" }}>
        Partie de {nomPartie}
      </h1>
      <div className="listeEquipe">
        {nomsEquipe.map((noms) => {
          return (
            <div className="equipe" key={noms.id}>
              <div>
              <p className="titreEquipe">{noms.nom}</p>
              {noms.nbPlace.map((nb) => {
                return (
                  
                <div key={nb} className="itemRejoindre"><p>{nb + 1}</p></div>);
              })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ListeJoueurs = ({selected}) => {
  const joueursConnectes = [
    { id: 1, nom: "Hugo" },
    { id: 2, nom: "Roméo" },
    { id: 3, nom: "Lucas" },
    { id: 4, nom: "Thomas" },
    { id: 5, nom: "Gaëtan" },
  ];

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          
         
          
        }}
      >
        {joueursConnectes.map((j) => (
          <ItemJoueurs key={j.id} nom={j} />
        ))}
      </div>
    </div>
  );
};

const ItemJoueurs = ({ nom }) => {
  return (
    <div
      style={{
        width: "90%",
        background: "linear-gradient(45deg, #3d3d3d, #545454)",
        color: "white",
        margin: 10,
        borderRadius: 15,
        margin : "auto",
        marginBottom: 15,
        
      }}
    >
      
      <p style={{ marginLeft: 10, fontSize: 20 }}>{nom.nom}</p>
    </div>
  );
};
renderOnDomLoaded(<ChoiceTeam />, "ChoiceTeamRoot");
