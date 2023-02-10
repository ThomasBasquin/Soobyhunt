import { Link } from "react-router-dom";
import "../css/config.css";

export default function Config() {
  return (
    <div className="menuConfig">
      <h1 className="titreConfig">Configuration d'une partie</h1>
      <div className="scroll">
      <div className="formConfig">
        <ModeDeJeu />
        
      </div>
      </div>
    </div>
  );
}

const ModeDeJeu = () => {
  return (
    <div className="">
      <p className="choixMDJ">Choix du mode de jeu :</p>
      <div className="listMDJ">
        <ItemMDJ />
        <ItemMDJ />
        <ItemMDJ />
      </div>
    </div>
  );
};

const ItemMDJ = () => {
  return (
    <div className="">
      <img src="chrono.jpeg" style={{width:100, height:100}}/>
    </div>
  )
}
