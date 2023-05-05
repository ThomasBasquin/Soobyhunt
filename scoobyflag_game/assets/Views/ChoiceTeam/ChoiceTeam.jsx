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
    {
      id: 3,
      nom: "OuaisCGreg",
      nbPlace: Array.from({ length: 5 }, (v, i) => i),
    },
  ];

  const [selected, setSelected] = useState(null);

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
      <ListeJoueurs selected={selected} setSelected={setSelected} />
      <ChoixEquipe
        nomPartie={nomPartie}
        nomsEquipe={nomsEquipe}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
}

const ChoixEquipe = ({ nomPartie, nomsEquipe, selected, setSelected }) => {
  console.log(selected);
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
                    <div key={nb} className="itemRejoindre">
                      <p>{nb + 1}</p>
                      {!selected ? (
                        <div style={{marginLeft:20}}>
                          <p>...</p>{" "}
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ListeJoueurs = ({ selected, setSelected }) => {
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
          <ItemJoueurs key={j.id} nom={j} selected={selected} setSelected={setSelected}/>
        ))}
      </div>
    </div>
  );
};

const ItemJoueurs = ({ nom, selected, setSelected }) => {
 
  return (
    <div
    onClick={() =>{setSelected(nom.id)}}
      className={selected === nom.id ? 'selected itemJoueur' : 'itemJoueur'}
    >
      <p style={{ marginLeft: 10, fontSize: 20 }}>{nom.nom}</p>
    </div>
  );
};
renderOnDomLoaded(<ChoiceTeam />, "ChoiceTeamRoot");
