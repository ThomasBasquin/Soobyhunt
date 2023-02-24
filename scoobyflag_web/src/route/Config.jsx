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

async function createGame() {
  const response = await fetch("http://localhost:8000/game/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "test",
      description: "test",
      maxPlayer: 10,
    }),
  });
  const data = await response.json();
  console.log(data);
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

  const [listeEquipe, setListeEquipe] = useState([{
    id :1,
    nom: "equipe1",
    nbJoueur: 4,

  },
  {
    id :2,
    nom: "equipe2",
    nbJoueur: 8,
  }
]);
  return <div>
    
    <AjoutEquipe listeEquipe={listeEquipe}/>
    <ListeEquipe listeEquipe={listeEquipe} setListeEquipe={setListeEquipe}/>
    
  </div>;
};

const AjoutEquipe = ({listeEquipe}) => {
  const [nomEquipe, setNomEquipe]= useState("");
  const [nbJoueur, setNbJoueur]= useState(1);
  const [id, setId]= useState(3);

  const ajout = () => {
    setId(id+1);
    listeEquipe.push({id: '1', nom : 'cc', nbJoueur : '7'});
  }
  return (
    <div className="addEquipe">
<div>
      <input type="text" name='nomEquipe' className="nomEquipe" placeholder="Nom de l'équipe" value={nomEquipe} onChange={e => setNomEquipe(e.target.value)}/>
      <input type="number" name="nbJoueur" className="nbJoueur" min="1" value={nbJoueur} onChange={e => setNbJoueur(e.target.value)}/>Joueurs
      </div>
      <p onClick = {()=> ajout()} style={{backgroundColor : "var(--violet)", width: 50, color :"var(--gris)", padding : 10, borderRadius :15, cursor : "pointer"}}>Ajouter</p>
    </div>
  )
}



const ListeEquipe = ({listeEquipe, setListeEquipe}) => {
  return (
    <div className="listeEquipe">
      {listeEquipe==0 ? <p style={{fontSize : 30}}>Aucune équipe pour le moment</p> : listeEquipe.map((e)=> {
        return (
          <div key={e.id} className="equipe">
            <p>{e.nom}</p>
            <p>{e.nbJoueur}</p>
          </div>
        )
      })}
    </div>
  )
}





const Mechants = () => {
  return <div>cc</div>;
};
const Items = () => {
  return <div>cc</div>;
};
