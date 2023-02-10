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
      <div className="listEcran">
        <div className="choixMDJ">Mode de jeu</div>
        <div className="choixMDJ">Équipe</div>
        </div>
        <div className="listEcran">
        <div className="choixMDJ">Méchants</div>
        <div className="choixMDJ">Items</div>
      </div>

      <div className="listMDJ">
        <ItemMDJ mdj="time" />
        <ItemMDJ mdj="flag" />
        <ItemMDJ mdj="supremacy" />
      </div>
    </div>
  );
};

const ItemMDJ = ({ mdj }) => {
  switch (mdj) {
    case "time":
      return (
        <div onClick={() => console.log("cc")} className="itemMDJ">
          <img
            src="chrono.jpeg"
            style={{ width: 140, height: 140, borderRadius: 30 }}
          />
          <div className="" style={{ marginLeft: 10, marginRight: 10 }}>
            <h2 style={{ margin: 0, marginTop: 10 }}>TIME</h2>
            <p>
              L’équipe gagnante est celle qui a le temps cumulé de possession
              des drapeaux le plus important à la fin de la partie
            </p>
          </div>
        </div>
      );
      break;

    case "flag":
      return (
        <div className="itemMDJ">
          <img
            src="flag.jpeg"
            style={{ width: 140, height: 140, borderRadius: 30 }}
          />
          <div className="" style={{ marginLeft: 10, marginRight: 10 }}>
            <h2>FLAG</h2>
            <p>
              L’équipe gagnante est celle qui possède le plus de drapeaux à la
              fin de la partie
            </p>
          </div>
        </div>
      );
      break;

    case "supremacy":
      return (
        <div className="itemMDJ">
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
      );
      break;
  }
};
