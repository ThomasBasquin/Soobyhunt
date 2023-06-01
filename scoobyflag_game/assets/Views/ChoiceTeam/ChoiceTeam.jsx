import React from "react";
import { useState, useEffect } from "react";
import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";

export default function ChoiceTeam() {
  const [nomPartie, setnomPartie] = useState("Hudog");
  const [joueursConnectes, setjoueursConnectes] = useState([
    { id: 1, nom: "Hugo" },
    { id: 2, nom: "Roméo" },
    { id: 3, nom: "Lucas" },
    { id: 4, nom: "Thomas" },
    { id: 5, nom: "Gaëtan" },
  ]);
  const [nomsEquipe, setNomsEquipe] = useState([
    {
      id: 1,
      nom: "Les Foufous",
      nbPlace: 10,
      listeDesJoueurs: [],
    },
    {
      id: 2,
      nom: "CBONPOURVOUS",
      nbPlace: 5,
      listeDesJoueurs: [],
    },
    {
      id: 3,
      nom: "OuaisCGreg",
      nbPlace: 5,
      listeDesJoueurs: [],
    }
  ]);

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
      <ListeJoueurs
        selected={selected}
        setSelected={setSelected}
        joueursConnectes={joueursConnectes}
      />
      <ChoixEquipe
        nomPartie={nomPartie}
        nomsEquipe={nomsEquipe}
        selected={selected}
        setSelected={setSelected}
        joueursConnectes={joueursConnectes}
        setjoueursConnectes={setjoueursConnectes}
        setNomsEquipe={setNomsEquipe}
      />
    </div>
  );
}

const ChoixEquipe = ({ nomPartie, nomsEquipe, selected, setSelected, joueursConnectes, setjoueursConnectes, setNomsEquipe }) => {
  useEffect(() => {
   
  }, [joueursConnectes, nomsEquipe]);

  const placerJoueur = (id) => {
    console.log(nomsEquipe[id].listeDesJoueurs)
    const newListeEquipe = nomsEquipe;
    const newJoueur = {id: 6, nom: "Cédric" };
    console.log(newListeEquipe[id].listeDesJoueurs.push())
    // newListeEquipe[id].listeDesJoueurs.push(joueursConnectes[selected-1]);
    // setNomsEquipe(newListeEquipe);
    const newList = joueursConnectes.filter(person=>person.id !== selected);
    setjoueursConnectes(newList);
    setSelected(null);
  }
  
  return (
    <div className="boxBlanche">
      <h1 style={{ textAlign: "center", textDecoration: "underline" }}>
        Partie de {nomPartie}
      </h1>
      <div className="listeEquipe">
        {nomsEquipe.map((noms) => {
          
          return (
            <div className="equipe" key={noms.id}>
              <p className="titreEquipe">{noms.nom}</p>
              {selected ? (
                <div className="buttonRejoindre" onClick={()=> placerJoueur(noms.id-1)}>Rejoindre</div>
              ) : (
                <div></div>
              )}
              <div className="scroll">
                {nomsEquipe[noms.id - 1].listeDesJoueurs.length == 0 ? (
                  <div className="messageAucunJoueur">
                    Aucun joueur dans l'équipe actuellement.
                  </div>
                ) : (
                  {}
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ListeJoueurs = ({ selected, setSelected, joueursConnectes }) => {
  return (
    <div className="listeJoueurs">
      <h2
        style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: 30,
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
          <ItemJoueurs
            key={j.id}
            nom={j}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </div>
    </div>
  );
};

const ItemJoueurs = ({ nom, selected, setSelected }) => {
  return (
    <div
      onClick={() => {
        if (selected == nom.id) {
          setSelected("");
        } else {
          setSelected(nom.id);
        }
      }}
      className={selected === nom.id ? "selected itemJoueur" : "itemJoueur"}
    >
      <p style={{ marginLeft: 10, fontSize: 20 }}>{nom.nom}</p>
      {selected === nom.id ? (
        <img src="img/fleur.png" style={{ width: 60 }} />
      ) : (
        <div></div>
      )}
    </div>
  );
};
renderOnDomLoaded(<ChoiceTeam />, "HomeRoot");
