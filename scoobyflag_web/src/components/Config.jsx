import "../css/config.css";
import React, { useState } from "react";

export default function Config({ createGame }) {
  const [toggleState, setToggleState] = useState(1);
  const [choose, setChoose] = useState("");
  const [nbGrandMechant, setnbGrandMechant] = useState(1);
  const [nbPetitMechant, setnbPetitMechant] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };
  const chooseItem = (type) => {
    setChoose(type);
  };
  const [listeEquipe, setListeEquipe] = useState([
    {
      id: 1,
      nom: "equipe1",
      nbJoueur: 4,
    },
    {
      id: 2,
      nom: "equipe2",
      nbJoueur: 8,
    },
  ]);

  const closeMenu = () => {
    document.querySelector(".menuConfig").classList.add("slideOut");
    document.querySelector(".menuConfig").classList.remove("slideIn");
  }

  return (
    <div className="menuConfig">
      <img src="croix.png" alt="" className="closeBtn" onClick={closeMenu} />
      <h1 className="titreConfig">Paramètres de la partie</h1>

      <div className="scroll">
        <div className="listEcran">
          <div
            className={
              toggleState === 1 ? "choixMDJ active-tab" : "choixMDJ"
            }
            onClick={() => toggleTab(1)}
          >
            Mode de jeu
          </div>
          <div
            className={
              toggleState === 2 ? "choixMDJ active-tab" : "choixMDJ"
            }
            onClick={() => toggleTab(2)}
          >
            Équipes
          </div>
        </div>
        {/*<div className="listEcran">
              <div
                className={
                  toggleState === 3 ? "choixMDJ active-tab" : "choixMDJ"
                }
                onClick={() => toggleTab(3)}
              >
                Méchants
              </div>
              <div
                className={
                  toggleState === 4 ? "choixMDJ active-tab" : "choixMDJ"
                }
                onClick={() => toggleTab(4)}
              >
                Items
              </div>
              </div>*/}

        <ModeDeJeu
          choose={choose}
          chooseItem={chooseItem}
          toggleState={toggleState}
        />
        <div
          className={
            toggleState === 2
              ? "listMDJ content active-content"
              : "listMDJ content"
          }
        >
          <Equipes
            listeEquipe={listeEquipe}
            setListeEquipe={setListeEquipe}
          />
        </div>
        <div
          className={
            toggleState === 3
              ? "listMDJ content active-content"
              : "listMDJ content"
          }
        >
          <Mechants
            nbGrandMechant={nbGrandMechant}
            nbPetitMechant={nbPetitMechant}
            setnbGrandMechant={setnbGrandMechant}
            setnbPetitMechant={setnbPetitMechant}
          />
        </div>
        <div
          className={
            toggleState === 4
              ? "listMDJ content active-content"
              : "listMDJ content"
          }
        >
          <Items />
        </div>
      </div>
      <div className="createButton" onClick={() => createGame(choose, listeEquipe)}>
        Créer la partie
      </div>
    </div>
  );
}

const ModeDeJeu = ({ choose, chooseItem, toggleState }) => {
  return (
    <div
      className={
        toggleState === 1 ? "listMDJ content active-content" : "listMDJ content"
      }
    >
      <div
        onClick={() => chooseItem("time")}
        className={choose === "time" ? "itemMDJ selected-item" : "itemMDJ"}
      >
        <img
          src="chrono.jpeg"
          style={{ width: 140, height: 140, borderRadius: 30 }}
        />
        <div className="" style={{ marginLeft: 10, marginRight: 10 }}>
          <h2 style={{ margin: 0, marginTop: 10 }}>TIME</h2>
          <p style={{ margin: 0, marginTop: 10, marginBottom: 10 }}>
            L’équipe gagnante est celle qui a le temps cumulé de possession des
            drapeaux le plus important à la fin de la partie
          </p>
        </div>
      </div>
      <div
        onClick={() => chooseItem("flag")}
        className={choose === "flag" ? "itemMDJ selected-item" : "itemMDJ"}
      >
        <img
          src="flag.jpeg"
          style={{ width: 140, height: 140, borderRadius: 30 }}
        />
        <div className="" style={{ marginLeft: 10, marginRight: 10 }}>
          <h2>FLAG</h2>
          <p style={{ margin: 0, marginTop: 10, marginBottom: 10 }}>
            L’équipe gagnante est celle qui possède le plus de drapeaux à la fin
            de la partie
          </p>
        </div>
      </div>
      <div
        onClick={() => chooseItem("supremacy")}
        className={choose === "supremacy" ? "itemMDJ selected-item" : "itemMDJ"}
      >
        <img
          src="supremacy.jpeg"
          style={{ width: 140, height: 140, borderRadius: 30 }}
        />
        <div className="" style={{ marginLeft: 10, marginRight: 10 }}>
          <h2>SUPREMACY</h2>
          <p style={{ margin: 0, marginTop: 10, marginBottom: 10 }}>
            {" "}
            L’équipe gagnante est la première à posséder la majorité des
            drapeaux
          </p>
        </div>
      </div>
    </div>
  );
};
const Equipes = ({ listeEquipe, setListeEquipe }) => {
  return (
    <div>
      <AjoutEquipe listeEquipe={listeEquipe} />
      <ListeEquipe listeEquipe={listeEquipe} setListeEquipe={setListeEquipe} />
    </div>
  );
};

const AjoutEquipe = ({ listeEquipe }) => {
  const [nomEquipe, setNomEquipe] = useState("");
  const [nbJoueur, setNbJoueur] = useState(1);
  const [id, setId] = useState(3);

  const ajout = () => {
    setId(id + 1);
    listeEquipe.push({ id: "1", nom: "cc", nbJoueur: "7" });
  };
  return (
    <div className="addEquipe">
      <div>
        <input
          type="text"
          name="nomEquipe"
          className="nomEquipe"
          placeholder="Nom de l'équipe"
          value={nomEquipe}
          onChange={(e) => setNomEquipe(e.target.value)}
        />
        <input
          type="number"
          name="nbJoueur"
          className="nbJoueur"
          min="1"
          value={nbJoueur}
          onChange={(e) => setNbJoueur(e.target.value)}
        />
        Joueurs
      </div>
      <p
        onClick={() => ajout()}
        style={{
          backgroundColor: "var(--violet)",
          width: 50,
          color: "var(--gris)",
          padding: 10,
          borderRadius: 15,
          cursor: "pointer",
        }}
      >
        Ajouter
      </p>
    </div>
  );
};

const ListeEquipe = ({ listeEquipe, setListeEquipe }) => {
  return (
    <div className="listeEquipe">
      {listeEquipe == 0 ? (
        <p style={{ fontSize: 30 }}>Aucune équipe pour le moment</p>
      ) : (
        listeEquipe.map((e) => {
          return (
            <div key={e.id} className="equipe">
              <p>{e.nom}</p>
              <p>{e.nbJoueur}</p>
            </div>
          );
        })
      )}
    </div>
  );
};

const Mechants = ({
  nbGrandMechant,
  nbPetitMechant,
  setnbGrandMechant,
  setnbPetitMechant,
}) => {
  return (
    <div className="listeMechant">
      <div
        className="itemMDJ"
        style={{ margin: 20, padding: 10, marginLeft: 0, cursor: "auto" }}
      >
        <img
          src="mechant2.png"
          style={{ width: 140, height: 140, borderRadius: 30 }}
        />
        <div className="" style={{ marginLeft: 10, marginRight: 10 }}>
          <h2>Grand Méchant</h2>
          <p>
            Difficulté : <span style={{ color: "orange" }}>Moyenne</span>
          </p>
          <p style={{ display: "flex", justifyContent: "space-around" }}>
            <span
              style={{
                display: "flex", // Ajout pour centrer le contenu
                justifyContent: "center", // Ajout pour centrer le contenu
                alignItems: "center", // Ajout pour centrer le contenu
                backgroundColor: "var(--violet)",
                color: "var(--gris)",
                padding: 5,
                fontSize: 18,
                height: "20px", // Modification pour rendre le style cohérent
                width: "20px", // Modification pour rendre le style cohérent
                borderRadius: "50%",
                cursor: "pointer",
                lineHeight: 0, // Ajout pour réduire l'espace vertical
              }}
              onClick={() => setnbGrandMechant(nbGrandMechant - 1)}
            >
              -
            </span>{" "}
            <span style={{ padding: 10 }}>{nbGrandMechant} </span>
            <span
              style={{
                display: "flex", // Ajout pour centrer le contenu
                justifyContent: "center", // Ajout pour centrer le contenu
                alignItems: "center", // Ajout pour centrer le contenu
                backgroundColor: "var(--violet)",
                color: "var(--gris)",
                padding: 5,
                fontSize: 18,
                height: "20px", // Modification pour rendre le style cohérent
                width: "20px", // Modification pour rendre le style cohérent
                borderRadius: "50%",
                cursor: "pointer",
                lineHeight: 0, // Ajout pour réduire l'espace vertical
              }}
              onClick={() => setnbGrandMechant(nbGrandMechant + 1)}
            >
              +
            </span>
          </p>
        </div>
      </div>
      <div
        className="itemMDJ"
        style={{ margin: 20, padding: 10, marginLeft: 0, cursor: "auto" }}
      >
        <img
          src="mechant1.png"
          style={{ width: 140, height: 140, borderRadius: 30 }}
        />
        <div className="" style={{ marginLeft: 10, marginRight: 10 }}>
          <h2>Petit Méchant</h2>
          <p>
            Difficulté : <span style={{ color: "red" }}>Difficile</span>
          </p>
          <p style={{ display: "flex", justifyContent: "space-around" }}>
            <span
              style={{
                display: "flex", // Ajout pour centrer le contenu
                justifyContent: "center", // Ajout pour centrer le contenu
                alignItems: "center", // Ajout pour centrer le contenu
                backgroundColor: "var(--violet)",
                color: "var(--gris)",
                padding: 5,
                fontSize: 18,
                height: "20px", // Modification pour rendre le style cohérent
                width: "20px", // Modification pour rendre le style cohérent
                borderRadius: "50%",
                cursor: "pointer",
                lineHeight: 0, // Ajout pour réduire l'espace vertical
              }}
              onClick={() => setnbPetitMechant(nbPetitMechant - 1)}
            >
              -
            </span>{" "}
            <span style={{ padding: 10 }}>{nbPetitMechant} </span>
            <span
              style={{
                display: "flex", // Ajout pour centrer le contenu
                justifyContent: "center", // Ajout pour centrer le contenu
                alignItems: "center", // Ajout pour centrer le contenu
                backgroundColor: "var(--violet)",
                color: "var(--gris)",
                padding: 5,
                fontSize: 18,
                height: "20px", // Modification pour rendre le style cohérent
                width: "20px", // Modification pour rendre le style cohérent
                borderRadius: "50%",
                cursor: "pointer",
                lineHeight: 0, // Ajout pour réduire l'espace vertical
              }}
              onClick={() => setnbPetitMechant(nbPetitMechant + 1)}
            >
              +
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
const Items = () => {
  const [nbLoupe, setNbLoupe] = useState(1);
  return (
    <div>
      <div
        className="itemMDJ"
        style={{ margin: 20, padding: 10, marginLeft: 0, cursor: "auto" }}
      >
        <img
          src="loupe.png"
          style={{ width: 140, height: 140, borderRadius: 30 }}
        />
        <div className="" style={{ marginLeft: 10, marginRight: 10 }}>
          <h2>Loupe</h2>
          <p>Augmente le rayon de détection</p>
          <p style={{ display: "flex", justifyContent: "space-around" }}>
            <span
              style={{
                backgroundColor: "var(--violet)",
                color: "var(--gris)",
                padding: 5,
                fontSize: 18,
                borderRadius: 100,
                cursor: "pointer",
              }}
              onClick={() => setNbLoupe(nbLoupe - 1)}
            >
              -
            </span>{" "}
            <span style={{ padding: 10 }}>{nbLoupe} </span>
            <span
              style={{
                backgroundColor: "var(--violet)",
                color: "var(--gris)",
                padding: 5,
                fontSize: 18,
                borderRadius: 100,
                cursor: "pointer",
              }}
              onClick={() => setNbLoupe(nbLoupe + 1)}
            >
              +
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
