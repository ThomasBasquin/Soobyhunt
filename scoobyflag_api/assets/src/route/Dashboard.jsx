import ItemConfig from "../components/ItemConfig";
import "../css/dashboard.css";
import React, { useEffect, useState } from "react";
import { MapContainer, Polygon, TileLayer, useMap } from "react-leaflet";
import Loader from "../components/Loader";
import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState("");
  const [indexSelected, setIndexSelected] = useState(-1);
  const [status, setStatus] = useState("");
  const [port, setPort] = useState(null);

  useEffect(() => {
    //Recuperer les configs du user
    fetch(
      "https://scoobyhunt.fr/user/" +
      JSON.stringify(JSON.parse(localStorage.getItem("user")).id) +
      "/getAllTemplate"
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json) => {
        setIsLoading(false);
        setTemplates(json.filter((a) => a.isActive == 1));
      });
  }, []);

  function clickUser() {
    document.location.assign("/app/user")
  }

  function addConfig() {
    document.location.assign("/app/carte")
  }

  function selectConfig(config, index) {
    setSelectedConfig(config);
    setIndexSelected(index);
  }

  function deleteConfig(idConfig) {
    const response = fetch(
      "https://scoobyhunt.fr/game/delete/template/" + idConfig,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json) => {
        setSelectedConfig("");
        setIndexSelected(-1);
        setTemplates(templates.filter((a) => a.id !== idConfig));
      });
  }

  function creerPartie() {
    if (selectedConfig == "") {
      alert("Aucune configuration n'est sélectionée");
    }
    else {
      document.querySelector(".fondSombre").style.display = "flex";
    }
  }

  function cancelCreate() {
    document.querySelector(".fondSombre").style.display = "none";
  }

  function confirmCreate() {
    setStatus("creation");

    const createGameOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idTemplate: selectedConfig.id }),
    };

    fetch("https://scoobyhunt.fr/game/create", createGameOption)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la requête.");
        }
        return response.json();
      })
      .then((json) => {
        // id de la game qu'on envoie au serveur
        lauchContainer(json.id);
      });
  }

  function lauchContainer(idGame) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ID: idGame }),
    };

    fetch("https://thomasbasquin.fr/create", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la requête.");
        }
        return response.json();
      })
      .then((data) => {
        setStatus("fini");
        console.log(data); // Les données renvoyées par le serveur
        // Faites ce que vous voulez avec les données
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });
  }

  function joinPartie() {
    console.log(port);
  }

  function ChangeView() {
    var totalLat = 0;
    var totalLng = 0;
    var nbPoint = 0;
    selectedConfig.json.authorizedZone.map((point) => {
      totalLat += point.latitude;
      totalLng += point.longitude;
      nbPoint++;
    });
    const map = useMap();
    map.setView([totalLat / nbPoint, totalLng / nbPoint], 14);
    return null;
  }

  return (
    <>
      <div className="fond-degrade-dashboard">
        <div className="header">
          <div className="header-gauche">
            <img
              src="../assets/logo.png"
              alt=""
              className="logo-header-dashboard"
              onClick={() => document.location.assign("/app")}
            />
            <div className="titre-header">ScoobyHunt</div>
          </div>
          <img
            src="../assets/profile.png"
            alt=""
            className="btn-user"
            onClick={clickUser}
          />
        </div>
        <div className="main-dashboard">
          <div className="zone-grise">
            <div className="titre-zone">Liste de mes configurations</div>

            <div className="liste-config">
              {isLoading ? (
                <Loader />
              ) : templates.length == 0 ? (
                <div className="texte-config">Aucune configuration</div>
              ) : (
                templates.map((template, index) => {
                  return (
                    <ItemConfig
                      config={template}
                      key={index}
                      selectConfig={selectConfig}
                      index={index}
                      selected={index == indexSelected}
                      deleteConfig={deleteConfig}
                    />
                  );
                })
              )}
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
                    <div>{selectedConfig.createdAt.substr(0, 10)}</div>
                    <div>{selectedConfig.json.modeDeJeu}</div>
                  </div>
                  <MapContainer
                    className="map-config"
                    dragging={false}
                    scrollWheelZoom={false}
                  >
                    <ChangeView />
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Polygon
                      pathOptions={{ color: "#6b2b94" }}
                      positions={selectedConfig.json.authorizedZone.map(
                        (point) => [point.latitude, point.longitude]
                      )}
                    />
                    {selectedConfig.json.unauthorizedZone.map((zone) => (
                      <Polygon
                        pathOptions={{ color: "#ee9158" }}
                        positions={zone.map((point) => [
                          point.latitude,
                          point.longitude,
                        ])}
                      />
                    ))}
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

      <div className="fondSombre">
        <div className="popUp">
          {status == "" ? (<>
            <h3>Voulez vous vraiment créer la partie ?</h3>
            <div className="ligneBouton">
              <button className="btnConfirm" onClick={confirmCreate}>Oui</button>
              <button className="btnConfirm" onClick={cancelCreate}>Non</button>
            </div></>) : status == "creation" ? <>
              <h3>Création de la partie en cours...</h3>
              <h5>{"Cela peut prendre quelques temps :)"}</h5>
              <Loader />
            </> : status == "fini" ? <>
              <h3>Partie créée avec succès</h3>
              <button className="btnConfirm" onClick={joinPartie}>Rejoinde la partie</button>
            </> : <></>}
        </div>
      </div >
    </>
  );
}

renderOnDomLoaded(<Dashboard />, "dashboard");