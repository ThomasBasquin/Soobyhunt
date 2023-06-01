import { useNavigate } from "react-router-dom";
import ItemConfig from "../components/ItemConfig";
import "../css/dashboard.css";
import { useEffect, useState } from "react";
import { MapContainer, Polygon, TileLayer, useMap } from "react-leaflet";

export default function Dashboard() {
  const [templates, setTemplates] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState("");
  const [indexSelected, setIndexSelected] = useState(-1);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    //Recuperer les configs du user
    fetch("https://scoobyhunt.fr/user/" + JSON.stringify(JSON.parse(localStorage.getItem("user")).id) + "/getAllTemplate")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json) => {
        console.log(json);
        setTemplates(json);
      });
  }, [])


  function clickUser() {
    navigate("/user");
  }

  function addConfig() {
    navigate("/carte");
  }

  function selectConfig(config, index) {
    setSelectedConfig(config);
    setIndexSelected(index);
    setLatitude(config.json.authorizedZone[0].latitude);
    setLongitude(config.json.authorizedZone[0].longitude);
  }

  function creerPartie() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ID: selectedConfig.id }),
    };

    fetch("http://207.154.194.125:1234/create", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Erreur:", error);
      });
  }

  function ChangeView({ latitude, longitude }) {
    const map = useMap();
    map.setView([latitude, longitude], 12);
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
                  <div>{selectedConfig.createdAt.substr(0, 10)}</div>
                  <div>{selectedConfig.json.modeDeJeu}</div>
                </div>
                <MapContainer
                  className="map-config"
                  center={[latitude, longitude]}
                  zoom={30}
                  dragging={false}
                  scrollWheelZoom={false}
                >
                  <ChangeView latitude={latitude} longitude={longitude} />
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polygon pathOptions={{ fillColor: 'blue' }} positions={selectedConfig.json.authorizedZone.map(point => ([point.latitude, point.longitude]))} />
                  {selectedConfig.json.unauthorizedZone.map(zone => <Polygon pathOptions={{ color: 'red' }} positions={zone.map(point => ([point.latitude, point.longitude]))} />)}
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
