import { Link } from "react-router-dom";
import "../css/config.css";
import React, { useState } from "react";

export default function Config() {
  return (
    <div className="menuConfig">
      <h1 className="titreConfig">Configuration d'une partie</h1>
      <div className="scroll">
        <div className="formConfig">
          <Contenu />
        </div>
      </div>
    </div>
  );
}

const Contenu = () => {
  const [toggleState, setToggleState] = useState(1);
  const [choose, setChoose] = useState("");
  const toggleTab = (index) => {
    setToggleState(index);
  };

  const chooseItem = (type) => {
    setChoose(type);
  };
  return (
    <div className="">
      <div className="listEcran">
        <div
          className={toggleState === 1 ? "choixMDJ active-tab" : "choixMDJ"}
          onClick={() => toggleTab(1)}
        >
          Mode de jeu
        </div>
        <div
          className={toggleState === 2 ? "choixMDJ active-tab" : "choixMDJ"}
          onClick={() => toggleTab(2)}
        >
          Équipes
        </div>
      </div>
      <div className="listEcran">
        <div
          className={toggleState === 3 ? "choixMDJ active-tab" : "choixMDJ"}
          onClick={() => toggleTab(3)}
        >
          Méchants
        </div>
        <div
          className={toggleState === 4 ? "choixMDJ active-tab" : "choixMDJ"}
          onClick={() => toggleTab(4)}
        >
          Items
        </div>
      </div>

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
        <Equipes />
      </div>
      <div
        className={
          toggleState === 3
            ? "listMDJ content active-content"
            : "listMDJ content"
        }
      >
        <Mechants />
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
  );
};
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
          <p>
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
          <p>
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
          <p>
            {" "}
            L’équipe gagnante est la première à posséder la majorité des
            drapeaux
          </p>
        </div>
      </div>
    </div>
  );
};
const Equipes = () => {
  return <div>
    <p style={{backgroundColor : "var(--violet)", width: 120, color :"var(--gris)", padding : 10, borderRadius :15}}>Nouvelle équipe</p>
    <AddEquipe />
    
  </div>;
};

const AddEquipe = () => {
  return (
    <div className="addEquipe">

      <input type="text" name='nomEquipe' className="nomEquipe" placeholder="Nom de l'équipe" />
      <input type="number" name="nbJoueur" className="nbJoueur" min="0"/>
      <p style={{backgroundColor : "var(--violet)", width: 50, color :"var(--gris)", padding : 10, borderRadius :15}}>Ajouter</p>
    </div>
  )
}









const Mechants = () => {
  return <div>cc</div>;
};
const Items = () => {
  return <div>cc</div>;
};
