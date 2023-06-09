import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  GeoJSON,
  Marker,
  Polygon,
  Popup
} from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "../css/carte.css";
import mechant1 from "../assets/mechant1.png";
import mechant2 from "../assets/mechant2.png";
import loupe from "../assets/loupe.png";
import lunettes from "../assets/lunettes.png";
import sac from "../assets/sac.png";
import ghost from "../assets/ghost.png";
import { EditControl } from "react-leaflet-draw";
import pointInPolygon from "point-in-polygon";
import ItemEquipe from "../components/ItemEquipe";

export default function Carte() {
  const navigate = useNavigate();

  const [nomConfig, setNomConfig] = useState("");
  const [heures, setHeures] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [dureeConfig, setDureeConfig] = useState(0);
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);
  const [status, setStatus] = useState("");
  const [zoneJeu, setZoneJeu] = useState([]);
  const [zonesInterdites, setZonesInterdites] = useState([]);
  const [mechants, setMechants] = useState([]);
  const [items, setItems] = useState([]);
  const [equipes, setEquipes] = useState([{ id: 0, nom: "", nbJoueur: 1 }, { id: 1, nom: "", nbJoueur: 1 }]);
  const [configLoaded, setConfigLoaded] = useState(null);
  const [modifs, setModifs] = useState(false);
  const [configId, setConfigId] = useState(null);

  const mapRef = useRef(null);

  const { state } = useLocation();

  useEffect(() => {
    if (state != null) {
      const { config } = state;
      console.log(config);
      setConfigLoaded(config);
      setConfigId(config.id);
    }

    getLocation();
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Votre navigateur ne supporte pas la géolocalisation");
    } else {
      setStatus("Localisation...");
      setLatitude(48.530437);
      setLongitude(7.735647777777776);
      setStatus(null);
      /*navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        console.log(position.coords);
        setStatus(null);
      }, () => {
        setStatus("Impossible de récupérer votre position");
      });*/
    }
  };

  const mechant1Icon = new L.icon({
    iconUrl: mechant1,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });

  const mechant2Icon = new L.icon({
    iconUrl: mechant2,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });

  const loupeIcon = new L.icon({
    iconUrl: loupe,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });

  const lunettesIcon = new L.icon({
    iconUrl: lunettes,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });

  const sacIcon = new L.icon({
    iconUrl: sac,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });

  const ghostIcon = new L.icon({
    iconUrl: ghost,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });

  const onCreated = (e) => {
    //On cherche quel objet est ajouté
    var type;
    if (e.layerType === "polygon") {
      if (e.layer.options.color == "#ee9158") {
        type = "zoneInterdite";
      }
      else {
        type = "zoneJeu";
      }
    }
    else {
      type = e.layer._icon.attributes.src.nodeValue.substr(12);
      type = type.substr(0, type.length - 4);
    }

    //Ajout du popUp Modifier/Supprimer
    var container = L.DomUtil.create("div");
    var btnModifier = L.DomUtil.create("button", "", container);
    btnModifier.innerHTML = "Modifier";
    var btnSupprimer = L.DomUtil.create("button", "", container);
    btnSupprimer.innerHTML = "Supprimer";
    e.layer.bindPopup(L.popup({
      content: container,
      offset: L.point(0, -25)
    }));
    L.DomEvent.addListener(btnModifier, "click", function () {
      mapRef.current.closePopup();
      clickEdit();
    })
    L.DomEvent.addListener(btnSupprimer, "click", function (f) {
      clickSupprimer(e.layer._leaflet_id, type);
      mapRef.current.closePopup();
      var a = document.createEvent("Event");
      a.initEvent("click", true, true);
      var docFragment = document.createDocumentFragment();
      if (e.layerType === "polygon") {
        docFragment.appendChild(e.layer._path);
      }
      else {
        docFragment.appendChild(e.layer._icon);
      }
      var myHTMLCollection = docFragment.children;
      !myHTMLCollection[0].dispatchEvent(a);
      clickSaveSupprimer();
    })

    if (type == "zoneJeu") {
      setZoneJeu([{ id: e.layer._leaflet_id, coords: e.layer.getLatLngs()[0] }]);
    }
    else if (type == "zoneInterdite") {
      setZonesInterdites(oldZones => [...oldZones, { id: e.layer._leaflet_id, coords: e.layer.getLatLngs()[0] }]);
    }
    else if (type.includes("mechant")) {
      setMechants(oldMechants => [...oldMechants, { id: e.layer._leaflet_id, name: type, coords: e.layer.getLatLng() }])
    }
    else {
      setItems(oldItems => [...oldItems, { id: e.layer._leaflet_id, name: type, coords: e.layer.getLatLng() }])
    }
  }

  const onDeleted = (e) => {
    //console.log(e.layers);
  }

  const clickZoneJeu = (e) => {
    if (zoneJeu.length == 0) {
      var e = document.createEvent("Event");
      e.initEvent("click", true, true);
      var cb = document.getElementsByClassName("leaflet-draw-draw-polygon");
      return !cb[0].dispatchEvent(e);
    }
  };

  const clickZoneInterdite = (e) => {
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-draw-polygon");
    return !cb[1].dispatchEvent(e);
  };

  const clickMechant = (e) => {
    if (document.getElementById("detailsMechants").style.visibility == "visible") {
      document.getElementById("detailsMechants").setAttribute("style", "visibility:hidden");
    }
    else {
      document.getElementById("detailsMechants").setAttribute("style", "visibility:visible");
    }
  };

  const clickObjet = (e) => {
    if (document.getElementById("detailsItems").style.visibility == "visible") {
      document.getElementById("detailsItems").setAttribute("style", "visibility:hidden");
    }
    else {
      document.getElementById("detailsItems").setAttribute("style", "visibility:visible");
    }
  };

  const clickEdit = (e) => {
    document.getElementById("btnSave").style.display = "none";
    document.getElementById("btnConfirmer").style.display = "block";
    document.getElementById("btnAnnuler").style.display = "block";

    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-edit-edit");
    return !cb[0].dispatchEvent(e);
  };

  const clickSupprimer = (id, type, e) => {
    if (type == "zoneJeu") {
      setZoneJeu([]);
    }
    else if (type == "zoneInterdite") {
      setZonesInterdites(oldZones => oldZones.filter(a => a.id !== id));
    }
    else if (type.includes("mechant")) {
      setMechants(oldMechants => oldMechants.filter(a => a.id !== id));
    }
    else {
      setItems(oldItems => oldItems.filter(a => a.id !== id));
    }
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-edit-remove");
    return !cb[0].dispatchEvent(e);
  };

  const clickSaveSupprimer = (e) => {
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-actions-bottom")[0].children[0].children[0];
    return !cb.dispatchEvent(e);
  }

  const clickCancelEdit = (e) => {
    document.getElementById("btnSave").style.display = "block";
    document.getElementById("btnConfirmer").style.display = "none";
    document.getElementById("btnAnnuler").style.display = "none";

    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-actions-top")[0].children[1].children[0];
    return !cb.dispatchEvent(e);
  }

  const clickSaveEdit = (e) => {
    document.getElementById("btnSave").style.display = "block";
    document.getElementById("btnConfirmer").style.display = "none";
    document.getElementById("btnAnnuler").style.display = "none";

    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-actions-top")[0].children[0].children[0];
    return !cb.dispatchEvent(e);
  }

  const chooseItem = (e, index) => {
    document.getElementById("detailsItems").setAttribute("style", "visibility:hidden");
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-draw-marker");
    return !cb[index].dispatchEvent(e);
  }

  const chooseMechant = (e, index) => {
    document.getElementById("detailsMechants").setAttribute("style", "visibility:hidden");
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-draw-marker");
    return !cb[index].dispatchEvent(e);
  }

  function quitter() {
    //Verif modifs pour sauvegarde ?
    navigate("/dashboard");
  }

  function openSave() {
    var configOk = true;
    var message = "";

    //Verif des equipes (nom,...)
    equipes.forEach(equipe => {
      if (equipe.nom == "") {
        configOk = false;
        message = "Equipe";
      }
    })

    //Zone de jeu présente ?
    if (zoneJeu.length < 1) {
      configOk = false;
      message = "Zone de jeu";
    }
    //Au moins deux mechants ?
    if (mechants.length < 2) {
      configOk = false;
      message = "Mechants";
    }

    //Points dans la zone
    /*var ok = true;
    var tabZone = [];

    if (configOk) {
      for (var i = 0; i < zonesInterdites.length; i++) {
        tabZone = [];
        for (var j = 0; j < zonesInterdites[i].length; j++) {
          tabZone.push(Object.values(zonesInterdites[i][j]));
        }
        mechants.forEach(mechant => {
          if (pointInPolygon([mechant.lat, mechant.lng], tabZone)) {
            ok = false;
          }
        })
      }
      tabZone = [];
      for (var k = 0; k < zoneJeu[0].length; k++) {
        tabZone.push(Object.values(zoneJeu[0][k]));
      }
      if (!pointInPolygon([e.layer.getLatLng().lat, e.layer.getLatLng().lng], tabZone)) {
        ok = false;
      }

      console.log(ok);
    }*/


    if (configOk) {
      document.querySelector(".fondSombre").style.display = "flex";
    }
    else {
      alert(message)
    }
  }

  function closeSave() {
    document.querySelector(".fondSombre").style.display = "none";
  }

  async function saveConfig() {
    var bodyConfig = JSON.stringify({
      name: nomConfig,
      modeDeJeu: "Time",
      limitTime: dureeConfig,
      teams: equipes,
      authorizedZone: zoneJeu[0].coords.map(pts => ({ latitude: pts.lat, longitude: pts.lng })),
      unauthorizedZone: zonesInterdites.map(zone => zone.coords.map(pts => ({ latitude: pts.lat, longitude: pts.lng }))),
      mechants: mechants.map(mechant => ({ name: mechant.name, latitude: mechant.coords.lat, longitude: mechant.coords.lng })),
      items: items.map(item => ({ name: item.name, latitude: item.coords.lat, longitude: item.coords.lng })),
      private: true,
      idCreator: JSON.stringify(JSON.parse(localStorage.getItem("user")).id)
    });

    console.log(bodyConfig);

    if (configId == null) {
      const response = await fetch("https://scoobyhunt.fr/game/create/template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyConfig,
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((json) => {
          console.log(json);
          setConfigId(json.gameTemplate.id);
          document.querySelector(".fondSombre").style.display = "none";
        });
    }
    else {
      const response = await fetch("https://scoobyhunt.fr/game/modify/template/" + configId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyConfig,
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((json) => {
          console.log(json);
          document.querySelector(".fondSombre").style.display = "none";
        });
    }
  }

  function addEquipe() {
    setEquipes([...equipes, { id: equipes.length, nom: "", nbJoueur: 1 }]);

    setTimeout(() => {
      document.querySelector(".listeEquipes").scrollTop = document.querySelector(".listeEquipes").scrollHeight;
    }, 50);
  }

  function deleteEquipe(index) {
    setEquipes(equipes.filter(a => a.id !== index));
  }

  function updateEquipe(index, nom, nbJoueur) {
    setEquipes(equipes.map((equipe, i) => {
      if (i == index) {
        return {
          id: index,
          nom: nom,
          nbJoueur: nbJoueur
        }
      }
      else {
        return equipe;
      }
    }))
  }

  return status == null ? (
    <>
      <MapContainer
        center={[latitude, longitude]}
        zoom={16}
        ref={mapRef}
        id="map-config"
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup>
          {configLoaded != null ? <>
            <Polygon pathOptions={{ color: '#6b2b94' }} positions={configLoaded.json.authorizedZone.map(point =>
              [point.latitude, point.longitude])
            } >
              <Popup>
                <button onClick={() => {
                  mapRef.current.closePopup();
                  clickEdit();
                }}>Modifier</button>
                <button>Supprimer</button>
              </Popup>
            </Polygon>
            {configLoaded.json.unauthorizedZone.map(zones => <Polygon pathOptions={{ color: '#ee9158' }} positions={zones.map(point =>
              [point.latitude, point.longitude])
            } >
              <Popup>
                <button onClick={() => {
                  mapRef.current.closePopup();
                  clickEdit();
                }}>Modifier</button>
                <button>Supprimer</button>
              </Popup>
            </Polygon>
            )}
            {configLoaded.json.items.map(item =>
              <Marker position={[item.latitude, item.longitude]} icon={item.name == "loupe" ? loupeIcon : item.name == "sac" ? sacIcon : item.name == "lunettes" ? lunettesIcon : ghostIcon}>
                <Popup>
                  <button onClick={() => {
                    mapRef.current.closePopup();
                    clickEdit();
                  }}>Modifier</button>
                  <button>Supprimer</button>
                </Popup>
              </Marker>
            )}
            {configLoaded.json.mechants.map(mechant =>
              <Marker position={[mechant.latitude, mechant.longitude]} icon={mechant.name == "mechant1" ? mechant1Icon : mechant2Icon}>
                <Popup>
                  <button onClick={() => {
                    mapRef.current.closePopup();
                    clickEdit();
                  }}>Modifier</button>
                  <button>Supprimer</button>
                </Popup>
              </Marker>
            )}
          </> : <></>}
          <EditControl
            position="topright"
            draw={{
              polyline: false,
              rectangle: false,
              circlemarker: false,
              circle: false,
              marker: {
                icon: mechant1Icon,
                popup: "test"
              },
              polygon: {
                shapeOptions: {
                  color: "#6b2b94"
                },
              },
            }}
            edit={{
              remove: false,
              edit: false,
            }}
            onCreated={(e) => onCreated(e)}
            onDeleted={(e) => onDeleted(e)}
          />
          <EditControl
            position="topright"
            draw={{
              polyline: false,
              rectangle: false,
              circlemarker: false,
              circle: false,
              marker: {
                icon: mechant2Icon,
              },
              polygon: {
                shapeOptions: {
                  color: "#ee9158"
                },
              },
            }}
            edit={{
              remove: false,
              edit: false,
            }}
          />
          <EditControl
            position="topright"
            draw={{
              polyline: false,
              rectangle: false,
              circlemarker: false,
              circle: false,
              marker: {
                icon: loupeIcon,
              },
              polygon: false,
            }}
            edit={{
              remove: false,
              edit: false,
            }}
          />
          <EditControl
            position="topright"
            draw={{
              polyline: false,
              rectangle: false,
              circlemarker: false,
              circle: false,
              marker: {
                icon: lunettesIcon,
              },
              polygon: false,
            }}
            edit={{
              remove: false,
              edit: false,
            }}
          />
          <EditControl
            position="topright"
            draw={{
              polyline: false,
              rectangle: false,
              circlemarker: false,
              circle: false,
              marker: {
                icon: sacIcon,
              },
              polygon: false,
            }}
            edit={{
              remove: false,
              edit: false,
            }}
          />
          <EditControl
            position="topright"
            draw={{
              polyline: false,
              rectangle: false,
              circlemarker: false,
              circle: false,
              marker: {
                icon: ghostIcon,
              },
              polygon: false,
            }}
          />
        </FeatureGroup>
      </MapContainer >
      <div className="sideBar">
        <div className="divBtnSideBar">
          <div
            id="btnZone"
            onClick={(e) => clickZoneJeu(e)}
            className="btnSideBar"
          >
            <img src="gaming-zone.png" alt="" className="iconBar" />
            Zone de jeu
          </div>
        </div>
        <div className="divBtnSideBar">
          <div
            id="btnZoneInterdite"
            onClick={(e) => clickZoneInterdite(e)}
            className="btnSideBar"
          >
            <img src="forbidden.png" alt="" className="iconBar" />
            Zone interdite
          </div>
        </div>
        <div className="divBtnSideBar">
          <div
            id="btnFlag"
            onClick={(e) => clickMechant(e)}
            className="btnSideBar"
          >
            <img src="villain.png" alt="" className="iconBar" />
            Méchants
          </div>

          <div className="detail" id="detailsMechants">
            <div className="btnDetail" onClick={(e) => chooseMechant(e, 0)}>
              <img src="mechant1.png" alt="" className="iconBar" />
              Méchant 1
            </div>
            <div className="btnDetail" onClick={(e) => chooseMechant(e, 1)}>
              <img src="mechant2.png" alt="" className="iconBar" />
              Méchant 2
            </div>
          </div>
        </div>
        <div className="divBtnSideBar">
          <div
            id="btnItems"
            onClick={(e) => clickObjet(e)}
            className="btnSideBar"
          >
            <img src="object.png" alt="" className="iconBar" />
            Objets
          </div>

          <div className="detail" id="detailsItems">
            <div className="btnDetail" onClick={(e) => chooseItem(e, 2)}>
              <img src="loupe.png" alt="" className="iconBar" />
              Item 1
            </div>
            <div className="btnDetail" onClick={(e) => chooseItem(e, 3)}>
              <img src="lunettes.png" alt="" className="iconBar" />
              Item 2
            </div>
            <div className="btnDetail" onClick={(e) => chooseItem(e, 4)}>
              <img src="sac.png" alt="" className="iconBar" />
              Item 3
            </div>
            <div className="btnDetail" onClick={(e) => chooseItem(e, 5)}>
              <img src="ghost.png" alt="" className="iconBar" />
              Item 4
            </div>
          </div>
        </div>
      </div>
      <div className="divEquipes">
        <div className="divTopEquipes">
          <div className="titreEquipe">Équipes</div>
          <img src="add.png" className="btnAddEquipe" onClick={addEquipe}></img>
        </div>
        <div className="listeEquipes">
          {equipes.map((equipe, index) => {
            return <ItemEquipe equipe={equipe} key={index} deleteEquipe={() => deleteEquipe(equipe.id)} updateEquipe={updateEquipe} />
          })}
        </div>
      </div>
      <div className="btnCarte" id="btnSave" onClick={openSave}>
        Sauvegarder
      </div>
      <div className="btnCarte" id="btnQuit" onClick={quitter}>
        Quitter
      </div>
      <div className="btnCarte" id="btnConfirmer" onClick={clickSaveEdit}>
        Confirmer les modifications
      </div>
      <div className="btnCarte" id="btnAnnuler" onClick={clickCancelEdit}>
        Annuler les modifications
      </div>

      <div className="fondSombre">
        <div className="popUp" id="deconnexion">
          <form onSubmit={saveConfig}>
            <div>
              <label htmlFor="nomConfig">Nom de la configuration :</label>
              <input type="text" id='nomConfig' value={nomConfig} onChange={(e) => setNomConfig(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="dureeConfig">Durée de la partie :</label>
              <input type="number" id='heures' value={heures} min={0} onChange={(e) => {
                setHeures(e.target.value)
                setDureeConfig(minutes * 60 + e.target.value * 3600);
              }} required />
              <label htmlFor="heures">H</label>
              <input type="number" id='minutes' value={minutes} min={0} max={59} onChange={(e) => {
                setMinutes(e.target.value)
                setDureeConfig(e.target.value * 60 + heures * 3600);
              }} required />
              <label htmlFor="minutes">Min</label>
            </div>
            <div>
              <input type="submit" value={"Sauvegarder"} />
              <input type="button" value={"Annuler"} onClick={closeSave} />
            </div>
          </form>
        </div>
      </div>
    </>
  ) : (
    <h1>{status}</h1>
  );
}
