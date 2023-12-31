import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  GeoJSON,
  Marker,
  Polygon,
  Popup
} from "react-leaflet";
import React, { useState, useEffect, useRef } from "react";
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
import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";
import Loader from "../components/Loader";

export default function Carte() {
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
  const [zoneJeuTemp, setZoneJeuTemp] = useState([]);
  const [zonesInterditesTemp, setZonesInterditesTemp] = useState([]);
  const [mechantsTemp, setMechantsTemp] = useState([]);
  const [itemsTemp, setItemsTemp] = useState([]);

  const [equipes, setEquipes] = useState([{ id: 0, nom: "", nbJoueur: 1 }, { id: 1, nom: "", nbJoueur: 1 }]);
  const [configLoaded, setConfigLoaded] = useState(null);
  const [modifs, setModifs] = useState(false);
  const [configId, setConfigId] = useState(null);
  const [contenuPopUp, setContenuPopUp] = useState(null);

  const mapRef = useRef(null);

  useEffect(() => {
    console.log(modifs);
  }, [modifs])

  useEffect(() => {
    var idConfig = new URLSearchParams(window.location.search).get("carte");

    if (idConfig != null) {
      setStatus("Chargement...")
      fetch(
        "https://scoobyhunt.fr/game/gameTemplate/" + idConfig
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((json) => {
          setConfigLoaded(json.gameTemplate);
          setConfigId(idConfig);
          setNomConfig(json.gameTemplate.json.name);
          var teams = [];
          json.gameTemplate.json.teams.forEach(team => {
            teams.push({ id: equipes.length, nom: team.nom, nbJoueur: team.nbJoueur });
          })
          setEquipes(teams);

          getLocation(json.gameTemplate);
        });
    }
    else {
      getLocation();
    }
  }, []);

  const getLocation = (configLoaded) => {
    if (configLoaded != null) {
      var totalLat = 0;
      var totalLng = 0;
      var nbPoint = 0;
      configLoaded.json.authorizedZone.map((point) => {
        totalLat += point.latitude;
        totalLng += point.longitude;
        nbPoint++;
      });
      setLatitude(totalLat / nbPoint);
      setLongitude(totalLng / nbPoint);
      setStatus(null);
    }
    else {
      if (!navigator.geolocation) {
        setStatus("Votre navigateur ne supporte pas la géolocalisation");
      } else {
        setStatus("Localisation...");
        setLatitude(48.53036756667678);
        setLongitude(7.7355033213811035);
        setStatus(null);
        /*navigator.geolocation.getCurrentPosition((position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setStatus(null);
        }, () => {
          setStatus("Impossible de récupérer votre position");
        });*/
      }
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
    setModifs(true);

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
      type = e.layer._icon.attributes.src.nodeValue.substr(14);
      type = type.substr(0, type.length - 13);
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

  const onEditStart = (e) => {
    setZoneJeu(old => {
      setZoneJeuTemp(old);
    })
    setZonesInterdites(old => {
      setZonesInterditesTemp(old);
    })
    setMechants(old => {
      setMechantsTemp(old);
    })
    setItems(old => {
      setItemsTemp(old);
    })
  }

  const onEditMove = (e) => {
    setMechantsTemp(old => old.map(mechant => {
      if (mechant.id == e.layer._leaflet_id) {
        return { id: mechant.id, name: mechant.type, coords: e.layer.getLatLng() };
      }
      else {
        return mechant;
      }
    }))
    setItemsTemp(old => old.map(item => {
      if (item.id == e.layer._leaflet_id) {
        return { id: item.id, name: item.type, coords: e.layer.getLatLng() };
      }
      else {
        return item;
      }
    }))
  }

  const onEditVertex = (e) => {
    setZoneJeuTemp(old => old.map(zone => {
      if (zone.id == e.poly._leaflet_id) {
        return { id: zone.id, coords: e.poly.getLatLngs()[0] };
      }
      else {
        return zone;
      }
    }))
    setZonesInterditesTemp(old => old.map(zone => {
      if (zone.id == e.poly._leaflet_id) {
        return { id: zone.id, coords: e.poly.getLatLngs()[0] };
      }
      else {
        return zone;
      }
    }))
  }

  const onEdited = (e) => {
    setZoneJeuTemp(old => {
      setZoneJeu(old);
    })
    setZonesInterditesTemp(old => {
      setZonesInterdites(old);
    })
    setMechantsTemp(old => {
      setMechants(old);
    })
    setItemsTemp(old => {
      setItems(old);
    })
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
    console.log(document.getElementsByClassName("leaflet-draw-actions-bottom")[0]);
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
    if (modifs) {
      document.querySelector("#quitterPU").style.display = "flex";
    }
    else {
      document.location.assign("/app/dashboard");
    }
  }

  function closeQuitter() {
    document.querySelector("#quitterPU").style.display = "none";
  }

  function confirmQuitter() {
    document.location.assign("/app/dashboard");
  }

  function openSave() {
    var configOk = true;
    var message = "";

    //Verif des equipes (nom,...)
    equipes.forEach(equipe => {
      if (equipe.nom == "") {
        configOk = false;
        message = "Erreur dans le nom des équipes";
      }
    })

    //Zone de jeu présente ?
    if (zoneJeu.length < 1) {
      configOk = false;
      message = "Il n'y a pas de zone de jeu";
    }
    //Au moins deux mechants ?
    if (mechants.length < 2) {
      configOk = false;
      message = "Il n'y a pas assez de méchants";
    }

    //Points dans la zone
    var pointsInZone = true;

    if (configOk) {
      mechants.forEach(mechant => {
        //Verif si le mechant est dans la zone de jeu
        if (!pointInPolygon([mechant.coords.lat, mechant.coords.lng], zoneJeu[0].coords.map(point => [point.lat, point.lng]))) {
          pointsInZone = false;
        }
        //Verif des zones interdites
        zonesInterdites.forEach(zoneInterdite => {
          if (pointInPolygon([mechant.coords.lat, mechant.coords.lng], zoneInterdite.coords.map(point => [point.lat, point.lng]))) {
            pointsInZone = false;
          }
        })
      })
      items.forEach(item => {
        //Verif si l'item est dans la zone de jeu
        if (!pointInPolygon([item.coords.lat, item.coords.lng], zoneJeu[0].coords.map(point => [point.lat, point.lng]))) {
          pointsInZone = false;
        }
        //Verif des zones interdites
        zonesInterdites.forEach(zoneInterdite => {
          if (pointInPolygon([item.coords.lat, item.coords.lng], zoneInterdite.coords.map(point => [point.lat, point.lng]))) {
            pointsInZone = false;
          }
        })
      })

      if (!pointsInZone) {
        configOk = false;
        message = "Mechants/Items ne sont pas dans la zone de jeu";
      }
    }

    if (configOk) {
      document.querySelector("#sauvegardePU").style.display = "flex";
    }
    else {
      alert(message)
    }
  }

  function closeSave() {
    document.querySelector("#sauvegardePU").style.display = "none";
  }

  async function saveConfig(e) {
    e.preventDefault();

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
          setConfigId(json.gameTemplate.id);
          setModifs(false);
          document.querySelector("#sauvegardePU").style.display = "none";
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
          document.querySelector("#sauvegardePU").style.display = "none";
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
            onEditStart={(e) => onEditStart(e)}
            onEditMove={(e) => onEditMove(e)}
            onEditVertex={(e) => onEditVertex(e)}
            onEdited={(e) => onEdited(e)}
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
        </FeatureGroup>
      </MapContainer >
      <div className="sideBar">
        <div className="divBtnSideBar">
          <div
            id="btnZone"
            onClick={(e) => clickZoneJeu(e)}
            className="btnSideBar"
          >
            <img src="../assets/gaming-zone.png" alt="" className="iconBar" />
            Zone de jeu
          </div>
        </div>
        <div className="divBtnSideBar">
          <div
            id="btnZoneInterdite"
            onClick={(e) => clickZoneInterdite(e)}
            className="btnSideBar"
          >
            <img src="../assets/forbidden.png" alt="" className="iconBar" />
            Zone interdite
          </div>
        </div>
        <div className="divBtnSideBar">
          <div
            id="btnFlag"
            onClick={(e) => clickMechant(e)}
            className="btnSideBar"
          >
            <img src="../assets/villain.png" alt="" className="iconBar" />
            Méchants
          </div>

          <div className="detail" id="detailsMechants">
            <div className="btnDetail" onClick={(e) => chooseMechant(e, 5)}>
              <img src="../assets/mechant2.png" alt="" className="iconBar" />
              Mineur Maudit
            </div>
            <div className="btnDetail desactive" onClick={(e) => chooseMechant(e, 4)}>
              <img src="../assets/mechant1.png" alt="" className="iconBar" />
              Le Fantôme
            </div>
          </div>
        </div>
        <div className="divBtnSideBar">
          <div
            id="btnItems"
            onClick={(e) => clickObjet(e)}
            className="btnSideBar"
          >
            <img src="../assets/object.png" alt="" className="iconBar" />
            Objets
          </div>

          <div className="detail" id="detailsItems">
            <div className="btnDetail" onClick={(e) => chooseItem(e, 0)}>
              <img src="../assets/loupe.png" alt="" className="iconBar" />
              Loupe
            </div>
            <div className="btnDetail desactive" onClick={(e) => chooseItem(e, 1)}>
              <img src="../assets/lunettes.png" alt="" className="iconBar" />
              Lunettes
            </div>
            <div className="btnDetail desactive" onClick={(e) => chooseItem(e, 2)}>
              <img src="../assets/sac.png" alt="" className="iconBar" />
              Sac
            </div>
            <div className="btnDetail desactive" onClick={(e) => chooseItem(e, 3)}>
              <img src="../assets/ghost.png" alt="" className="iconBar" />
              Inivisibilité
            </div>
          </div>
        </div>
      </div>
      <div className="divEquipes">
        <div className="divTopEquipes">
          <div className="titreEquipe">Équipes</div>
          <img src="../assets/add.png" className="btnAddEquipe" onClick={addEquipe}></img>
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

      <div className="fondSombre" id="sauvegardePU">
        <div className="popUp">
          <h3>Sauvegarde de la configuration</h3>
          <form onSubmit={saveConfig} id="formConfig">
            <div className="ligneForm">
              <label htmlFor="nomConfig">Nom de la configuration :&nbsp;</label>
              <input type="text" id='nomConfig' value={nomConfig} onChange={(e) => setNomConfig(e.target.value)} required />
            </div>
            <div className="ligneForm">
              <label htmlFor="dureeConfig">Durée de la partie :&nbsp;</label>
              <input type="number" id='heures' value={heures} min={0} onChange={(e) => {
                setHeures(e.target.value)
                setDureeConfig(minutes * 60 + e.target.value * 3600);
              }} required />
              <label htmlFor="heures">&nbsp;H&nbsp;</label>
              <input type="number" id='minutes' value={minutes} min={0} max={59} onChange={(e) => {
                setMinutes(e.target.value)
                setDureeConfig(e.target.value * 60 + heures * 3600);
              }} required />
              <label htmlFor="minutes">&nbsp;Min</label>
            </div>
            <div className="ligneForm">
              <input type="submit" className="btnForm" value={"Sauvegarder"} />
              <input type="button" className="btnForm" value={"Annuler"} onClick={closeSave} />
            </div>
          </form>
        </div>
      </div>

      <div className="fondSombre" id="quitterPU">
        <div className="popUp">
          <h3>Quitter sans sauvegarder ?</h3>
          <div>
            <button className="btnForm" onClick={closeQuitter}>Continuer à modifier</button>
            <button className="btnForm" onClick={confirmQuitter}>Quitter sans sauvegarder</button>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <h1>{status}</h1>
      <Loader />
    </>
  );
}

renderOnDomLoaded(<Carte />, "carte");
