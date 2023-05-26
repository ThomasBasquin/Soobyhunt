import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Marker,
  Popup,
} from "react-leaflet";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import L, { popup } from "leaflet";
import "../css/carte.css";
import "../css/config.css";
import mechant1 from "../assets/mechant1.png";
import mechant2 from "../assets/mechant2.png";
import loupe from "../assets/loupe.png";
import lunettes from "../assets/lunettes.png";
import sac from "../assets/sac.png";
import ghost from "../assets/ghost.png";
import player from "../assets/points.png";
import Config from "../components/Config";
import { EditControl } from "react-leaflet-draw";
import pointInPolygon from "point-in-polygon";

export default function Carte() {
  const navigate = useNavigate();

  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);
  const [status, setStatus] = useState("");
  const [partieLancee, setPartieLancee] = useState(false);

  const [zoneJeu, setZoneJeu] = useState([]);
  const [zonesInterdites, setZonesInterdites] = useState([]);
  const [mechants, setMechants] = useState([]);
  const [items, setItems] = useState([]);
  const [joueurs, setJoueurs] = useState([]);
  const [aa, setAa] = useState(0);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    /*const url = new URL("http://hugoslr.fr:16640/.well-known/mercure");
    url.searchParams.append(
      "topic",
      "https://scoobyflag/user/{userId}".replace(
        "{userId}",
        0
      )
    );

    const eventSource = new EventSource(url);

    eventSource.onmessage = ({ data }) => {
      console.log(data);
      const user = JSON.parse(JSON.parse(data));
      const alreadyExist = joueurs.find((u) => u.id == user.id);

      if (!alreadyExist) {
        ajouterJoueur(user.id, [user.latitude, user.longitude]);
      } else {
        deplacerJoueur(user.id, [user.latitude, user.longitude]);
      }

      // else if (data.includes("deplacer")) {
      //     deplacerJoueur(0, [Math.random() * (48.54 - 48.53) + 48.53, Math.random() * (7.74 - 7.73) + 7.73]);
      // }
    };

    return () => eventSource.close();*/
  }, [joueurs]);

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

  const playerIcon = new L.icon({
    iconUrl: player,
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
  });

  const openConfig = () => {
    document.querySelector(".menuConfig").classList.add("slideIn");
    document.querySelector(".menuConfig").classList.remove("slideOut");
  };

  const clickUser = () => {
    navigate("/user");
  }

  const onCreated = (e) => {
    if (e.layerType === "polygon") {
      if (e.layer.options.color == "red") {
        var tabTemp = zonesInterdites;
        tabTemp.push(e.layer.getLatLngs()[0]);
        setZonesInterdites(tabTemp);
      } else {
        var tabTemp = zoneJeu;
        tabTemp[0] = e.layer.getLatLngs()[0];
        setZoneJeu(tabTemp);
      }
      e.layer._path.addEventListener("click", () => {
        clickEdit();
      })
    } else {
      e.layer.bindPopup("salut").openPopup();
      /*e.layer._icon.addEventListener("click", () => {
        clickEdit();
      })*/

      var ok = true;
      var tabZone = [];

      for (var i = 0; i < zonesInterdites.length; i++) {
        tabZone = [];
        for (var j = 0; j < zonesInterdites[i].length; j++) {
          tabZone.push(Object.values(zonesInterdites[i][j]));
        }
        if (pointInPolygon([e.layer.getLatLng().lat, e.layer.getLatLng().lng], tabZone)) {
          ok = false;
        }
      }

      tabZone = [];
      for (var k = 0; k < zoneJeu[0].length; k++) {
        tabZone.push(Object.values(zoneJeu[0][k]));
      }
      if (!pointInPolygon([e.layer.getLatLng().lat, e.layer.getLatLng().lng], tabZone)) {
        ok = false;
      }

      console.log(ok);

      if (e.layer._icon.attributes.src.nodeValue == "/src/assets/mechant1.png") {
        var tabTemp = mechants;
        tabTemp.push(e.layer.getLatLng());
        setMechants(tabTemp);
      } else if (e.layer._icon.attributes.src.nodeValue == "/src/assets/mechant2.png") {
        var tabTemp = mechants;
        tabTemp.push(e.layer.getLatLng());
        setMechants(tabTemp);
      }
      else if (e.layer._icon.attributes.src.nodeValue == "/src/assets/loupe.png") {
        var tabTemp = items;
        tabTemp.push({
          name: "loupe",
          coordonnees: e.layer.getLatLng(),
        });
        setItems(tabTemp);
      }
      else if (e.layer._icon.attributes.src.nodeValue == "/src/assets/lunettes.png") {
        var tabTemp = items;
        tabTemp.push({
          name: "lunettes",
          coordonnees: e.layer.getLatLng(),
        });
        setItems(tabTemp);
      }
      else if (e.layer._icon.attributes.src.nodeValue == "/src/assets/sac.png") {
        var tabTemp = items;
        tabTemp.push({
          name: "sac",
          coordonnees: e.layer.getLatLng(),
        });
        setItems(tabTemp);
      }
      else if (e.layer._icon.attributes.src.nodeValue == "/src/assets/ghost.png") {
        var tabTemp = items;
        tabTemp.push({
          name: "ghost",
          coordonnees: e.layer.getLatLng(),
        });
        setItems(tabTemp);
      }
    }
  };

  const onDeleted = (e) => {
    console.log(e.layers);
  }

  const clickZoneJeu = (e) => {
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-draw-polygon");
    return !cb[0].dispatchEvent(e);
  };

  const clickZoneInterdite = (e) => {
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-draw-polygon");
    return !cb[1].dispatchEvent(e);
  };

  const clickMechant = (e) => {
    if (zoneJeu.length == 0) {
      alert("Créer d'abord une zone de jeu.");
    } else {
      if (document.getElementById("detailsMechants").style.visibility == "visible") {
        document.getElementById("detailsMechants").setAttribute("style", "visibility:hidden");
      }
      else {
        document.getElementById("detailsMechants").setAttribute("style", "visibility:visible");
      }
    }
  };

  const clickObjet = (e) => {
    if (zoneJeu.length == 0) {
      alert("Créer d'abord une zone de jeu.");
    } else {
      if (document.getElementById("detailsItems").style.visibility == "visible") {
        document.getElementById("detailsItems").setAttribute("style", "visibility:hidden");
      }
      else {
        document.getElementById("detailsItems").setAttribute("style", "visibility:visible");
      }
    }
  };

  const clickEdit = (e) => {
    //document.getElementById("detailsEdit").setAttribute("style", "visibility:visible");
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-edit-edit");
    return !cb[0].dispatchEvent(e);
  };

  const clickSupprimer = (e) => {
    document.getElementById("detailsSuppr").setAttribute("style", "visibility:visible");
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-edit-remove");
    return !cb[0].dispatchEvent(e);
  };

  const clickCancelSupprimer = (e) => {
    document.getElementById("detailsSuppr").setAttribute("style", "visibility:hidden");
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-actions-bottom")[0].children[1].children[0];
    return !cb.dispatchEvent(e);
  }

  const clickSaveSupprimer = (e) => {
    document.getElementById("detailsSuppr").setAttribute("style", "visibility:hidden");
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-actions-bottom")[0].children[0].children[0];
    return !cb.dispatchEvent(e);
  }

  const clickCancelEdit = (e) => {
    document.getElementById("detailsEdit").setAttribute("style", "visibility:hidden");
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-actions-top")[0].children[1].children[0];
    return !cb.dispatchEvent(e);
  }

  const clickSaveEdit = (e) => {
    document.getElementById("detailsEdit").setAttribute("style", "visibility:hidden");
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

  const ajouterJoueur = (id, coordonnees) => {
    //setJoueurs([...joueurs, { id: joueurs.length, coordonnees: coordonnees }])
    setJoueurs((oldJoueurs) => [
      ...oldJoueurs,
      { id: id, coordonnees: coordonnees },
    ]);
  };

  const deplacerJoueur = (idJoueur, coordonnees) => {
    setJoueurs((cur) =>
      cur.map((joueur, i) => {
        if (joueur.id === idJoueur) {
          return { id: joueur.id, coordonnees: coordonnees };
        } else {
          return joueur;
        }
      })
    );
    //setJoueurs([...joueurs, { id: idJoueur, coordonnees: coordonnees }])
  };

  async function createGame(modeJeu, listeEquipe) {
    /*const response = await fetch("http://127.0.0.1:8000/game/create/template", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Sprint 1", //A CHANGER
        modeDeJeu: modeJeu,
        limitTime: 600, //A CHANGER
        teams: listeEquipe,
        authorizedZone: zoneJeu.map(zone => ({ latitude: zone.lat, longitude: zone.lng })),
        unauthorizedZone: zonesInterdites.map(zone => zone.map(pts => ({ latitude: pts.lat, longitude: pts.lng }))),
        mechants: mechants.map(mechant => ({ latitude: mechant.lat, longitude: mechant.lng })),
        items: items.map(item => ({ latitude: item.lat, longitude: item.lng })),
        private: true, //A CHANGER
        idCreator: 3, //
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json) => {
        const id = json.gameTemplate.id;
        launchGame(id);
      });*/

    /*console.log(
      JSON.stringify({
        name: "Sprint 1", //A CHANGER
        modeDeJeu: modeJeu,
        limitTime: 600, //A CHANGER
        teams: listeEquipe,
        authorizedZone: zoneJeu,
        unauthorizedZone: zonesInterdites,
        mechants: mechants,
        items: items,
        private: true, //A CHANGER
        idCreator: 3,
      })
    );*/

    console.log({
      name: "Sprint 1", //A CHANGER
      modeDeJeu: modeJeu,
      limitTime: 600, //A CHANGER
      teams: listeEquipe,
      authorizedZone: zoneJeu,
      unauthorizedZone: zonesInterdites,
      mechants: mechants,
      items: items,
      private: true, //A CHANGER
      idCreator: 3,
    });

    //setPartieLancee(true);
  }

  async function launchGame(id) {
    fetch("https://scoobyhunt.fr/game/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json) => {
        console.log(json);
      });
  }

  return status == null ? (
    <>
      <MapContainer center={[latitude, longitude]} zoom={16}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup>
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
              polygon: true,
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
                  guidelineDistance: 10,
                  color: "red",
                  weight: 3,
                },
              },
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
            edit={{
              remove: false,
              edit: false,
            }}
          />
        </FeatureGroup>
        {partieLancee ? (
          <>
            {joueurs.map((joueur, id) => {
              return (
                <Marker
                  key={id}
                  position={joueur.coordonnees}
                  icon={playerIcon}
                >
                  <Popup>ID Joueur : {joueur.id}</Popup>
                </Marker>
              );
            })}
            <div onClick={test} className="btnTest"></div>
          </>
        ) : (
          <></>
        )}
      </MapContainer>
      {!partieLancee ? (
        <>
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
          <Config createGame={createGame} />{" "}
        </>
      ) : (
        <></>
      )}
    </>
  ) : (
    <h1>{status}</h1>
  );
}
