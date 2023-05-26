import { useNavigate } from "react-router-dom";
import ItemConfig from "../components/ItemConfig";
import "../css/dashboard.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

export default function Dashboard() {
  const templates = [
    {
      id: 34,
      gameMaster: {
        id: 1,
        email: "user@user.fr",
        password:
          "$2y$13$Z0WXItgEa9exI8mlU6HtNe3ANzAmv0yeBRoa99/.TuuNUpkfbm4kO",
        pseudo: "user",
      },
      json: {
        name: "Sprint 1",
        items: [
          {
            name: "loupe",
            coordonnees: {
              lat: 48.526737650441,
              lng: 7.734074592590333,
            },
          },
          {
            name: "loupe",
            coordonnees: {
              lat: 48.52903974489115,
              lng: 7.737872600555421,
            },
          },
          {
            name: "loupe",
            coordonnees: {
              lat: 48.52922447632966,
              lng: 7.731606960296631,
            },
          },
          {
            name: "loupe",
            coordonnees: {
              lat: 48.53235059847265,
              lng: 7.737872600555421,
            },
          },
          {
            name: "loupe",
            coordonnees: {
              lat: 48.527476605743104,
              lng: 7.745447158813477,
            },
          },
        ],
        teams: [
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
        ],
        private: true,
        mechants: [
          {
            lat: 48.53071651324544,
            lng: 7.733323574066163,
          },
          {
            lat: 48.527675553405246,
            lng: 7.742722034454347,
          },
          {
            lat: 48.531810645709584,
            lng: 7.739932537078858,
          },
          {
            lat: 48.52844291563801,
            lng: 7.734589576721192,
          },
        ],
        idCreator: 1,
        limitTime: 600,
        modeDeJeu: "",
        authorizedZone: [
          {
            lat: 5.53013391358619,
            lng: 45.727572917938233,
          },
          {
            lat: 48.53411250954362,
            lng: 7.739825248718263,
          },
          {
            lat: 48.527007654589966,
            lng: 7.747313976287843,
          },
          {
            lat: 48.52497548274613,
            lng: 7.737421989440919,
          },
          {
            lat: 48.52761871129582,
            lng: 7.728345394134522,
          },
        ],
        unauthorizedZone: [
          [
            {
              lat: 48.531810645709584,
              lng: 7.729847431182862,
            },
            {
              lat: 48.52558656397187,
              lng: 7.732186317443848,
            },
            {
              lat: 48.52794555255377,
              lng: 7.72566318511963,
            },
            {
              lat: 48.53158329545517,
              lng: 7.726972103118897,
            },
          ],
        ],
      },
      createdAt: "2023-05-12T15:18:52+00:00",
    },
    {
      id: 35,
      gameMaster: {
        id: 1,
        email: "user@user.fr",
        password:
          "$2y$13$Z0WXItgEa9exI8mlU6HtNe3ANzAmv0yeBRoa99/.TuuNUpkfbm4kO",
        pseudo: "user",
      },
      json: {
        name: "Sprint 2",
        items: [
          {
            name: "loupe",
            coordonnees: {
              lat: 48.526737650441,
              lng: 7.734074592590333,
            },
          },
          {
            name: "loupe",
            coordonnees: {
              lat: 48.52903974489115,
              lng: 7.737872600555421,
            },
          },
          {
            name: "loupe",
            coordonnees: {
              lat: 48.52922447632966,
              lng: 7.731606960296631,
            },
          },
          {
            name: "loupe",
            coordonnees: {
              lat: 48.53235059847265,
              lng: 7.737872600555421,
            },
          },
          {
            name: "loupe",
            coordonnees: {
              lat: 48.527476605743104,
              lng: 7.745447158813477,
            },
          },
        ],
        teams: [
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
        ],
        private: true,
        mechants: [
          {
            lat: 48.53071651324544,
            lng: 7.733323574066163,
          },
          {
            lat: 48.527675553405246,
            lng: 7.742722034454347,
          },
          {
            lat: 48.531810645709584,
            lng: 7.739932537078858,
          },
          {
            lat: 48.52844291563801,
            lng: 7.734589576721192,
          },
        ],
        idCreator: 1,
        limitTime: 600,
        modeDeJeu: "",
        authorizedZone: [
          {
            lat: 25.53013391358619,
            lng: 24.727572917938233,
          },
          {
            lat: 48.53411250954362,
            lng: 7.739825248718263,
          },
          {
            lat: 48.527007654589966,
            lng: 7.747313976287843,
          },
          {
            lat: 48.52497548274613,
            lng: 7.737421989440919,
          },
          {
            lat: 48.52761871129582,
            lng: 7.728345394134522,
          },
        ],
        unauthorizedZone: [
          [
            {
              lat: 48.531810645709584,
              lng: 7.729847431182862,
            },
            {
              lat: 48.52558656397187,
              lng: 7.732186317443848,
            },
            {
              lat: 48.52794555255377,
              lng: 7.72566318511963,
            },
            {
              lat: 48.53158329545517,
              lng: 7.726972103118897,
            },
          ],
        ],
      },
      createdAt: "2023-05-12T15:18:54+00:00",
    },
    {
      id: 36,
      gameMaster: {
        id: 1,
        email: "user@user.fr",
        password:
          "$2y$13$Z0WXItgEa9exI8mlU6HtNe3ANzAmv0yeBRoa99/.TuuNUpkfbm4kO",
        pseudo: "user",
      },
      json: {
        name: "Sprint 3",
        items: [
          {
            name: "loupe",
            coordonnees: {
              lat: 48.526737650441,
              lng: 7.734074592590333,
            },
          },
          {
            name: "loupe",
            coordonnees: {
              lat: 48.52903974489115,
              lng: 7.737872600555421,
            },
          },
          {
            name: "loupe",
            coordonnees: {
              lat: 48.52922447632966,
              lng: 7.731606960296631,
            },
          },
          {
            name: "loupe",
            coordonnees: {
              lat: 48.53235059847265,
              lng: 7.737872600555421,
            },
          },
          {
            name: "loupe",
            coordonnees: {
              lat: 48.527476605743104,
              lng: 7.745447158813477,
            },
          },
        ],
        teams: [
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
        ],
        private: true,
        mechants: [
          {
            lat: 48.53071651324544,
            lng: 7.733323574066163,
          },
          {
            lat: 48.527675553405246,
            lng: 7.742722034454347,
          },
          {
            lat: 48.531810645709584,
            lng: 7.739932537078858,
          },
          {
            lat: 48.52844291563801,
            lng: 7.734589576721192,
          },
        ],
        idCreator: 1,
        limitTime: 600,
        modeDeJeu: "",
        authorizedZone: [
          {
            lat: 48.53013391358619,
            lng: 7.727572917938233,
          },
          {
            lat: 48.53411250954362,
            lng: 7.739825248718263,
          },
          {
            lat: 48.527007654589966,
            lng: 7.747313976287843,
          },
          {
            lat: 48.52497548274613,
            lng: 7.737421989440919,
          },
          {
            lat: 48.52761871129582,
            lng: 7.728345394134522,
          },
        ],
        unauthorizedZone: [
          [
            {
              lat: 48.531810645709584,
              lng: 7.729847431182862,
            },
            {
              lat: 48.52558656397187,
              lng: 7.732186317443848,
            },
            {
              lat: 48.52794555255377,
              lng: 7.72566318511963,
            },
            {
              lat: 48.53158329545517,
              lng: 7.726972103118897,
            },
          ],
        ],
      },
      createdAt: "2023-05-12T15:18:56+00:00",
    },
  ];

  const [selectedConfig, setSelectedConfig] = useState("");
  const [indexSelected, setIndexSelected] = useState(-1);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const navigate = useNavigate();

  function clickUser() {
    navigate("/user");
  }

  function addConfig() {
    navigate("/carte");
  }

  function selectConfig(config, index) {
    setSelectedConfig(config);
    setIndexSelected(index);
    setLatitude(config.json.authorizedZone[0].lat);
    setLongitude(config.json.authorizedZone[0].lng);
  }

  function creerPartie() {
    console.log(selectedConfig.id);

    fetch("http://207.154.194.125:1234/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: selectedConfig.id }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Erreur:", error);
      });
  }

  function ChangeView({ latitude, longitude }) {
    const map = useMap();
    map.setView([latitude, longitude], 10);
    return null;
  }

  return (
    <div className="fond-degrade-dashboard">
      <div className="header">
        <div className="header-gauche">
          <img src="logo.png" alt="" className="logo-header" />
          <div className="titre-header">ScoobyHunt</div>
        </div>
        <img
          src="profile.png"
          alt=""
          className="btn-user"
          onClick={clickUser}
        />
      </div>
      <div className="main-dashboard">
        <div className="zone-grise">
          <div className="titre-zone">Liste de mes configurations</div>

          <div className="liste-config">
            {templates.map((template, index) => {
              return (
                <ItemConfig
                  config={template}
                  key={index}
                  selectConfig={selectConfig}
                  index={index}
                  selected={index == indexSelected}
                />
              );
            })}
          </div>

          <div className="dashboard-button" onClick={addConfig}>
            Ajouter une configuration
          </div>
        </div>
        <div className="zone-grise">
          <div className="titre-zone">Détails de la configuration</div>

          <div className="detail-config">
            {selectedConfig == "" ? (
              <div className="config-empty">
                Sélectionnez une configuration dans le menu de gauche
              </div>
            ) : (
              <div className="config-detail">
                <div className="nom-config">{selectedConfig.json.name}</div>
                <div className="config-line">
                  <div>12/05/2023</div>
                  <div>Time</div>
                </div>
                <MapContainer
                  className="map-config"
                  center={[latitude, longitude]}
                  zoom={16}
                  dragging={false}
                  scrollWheelZoom={false}
                >
                  <ChangeView latitude={latitude} longitude={longitude} />
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </MapContainer>
              </div>
            )}
          </div>

          <div className="dashboard-button" onClick={creerPartie}>
            Créer la partie
          </div>
        </div>
      </div>
    </div>
  );
}
