import { Link } from "react-router-dom";
import "../css/config.css";

export default function Config() {
  return (
    <div className="fondViolet">
      <h1 className="titreConfig">Configuration d'une partie</h1>
      <div className="formConfig">
        <ModeDeJeu />
      </div>
    </div>
  );
}

const ModeDeJeu = () => {
  return (
    <div className="modeDeJeu">
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
            cc
        </div>
    )
}
