import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Marker,
  Popup,
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "../css/carte.css";
import "../css/config.css";
import mechant1 from "../assets/mechant1.png";
import loupe from "../assets/loupe.png";
import player from "../assets/points.png";
import Config from "../components/Config";
import { EditControl } from "react-leaflet-draw";

export default function Carte() {
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);
  const [status, setStatus] = useState("");
  const [menuConfig, setMenuConfig] = useState(false);
  const [clickedSupprimer, setClickedSupprimer] = useState(false);
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
    const url = new URL("http://hugoslr.fr:16640/.well-known/mercure");
    url.searchParams.append(
      "topic",
      "https://scoobyflag/user/{userId}".replace(
        "{userId}",
        0 /*userId.toString()*/
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

    return () => eventSource.close();
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

  const loupeIcon = new L.icon({
    iconUrl: loupe,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });

  const playerIcon = new L.icon({
    iconUrl: player,
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
  });

  const clickBtnConfig = () => {
    if (menuConfig) {
      setMenuConfig(false);
      document.querySelector(".menuConfig").classList.add("slideOut");
      document.querySelector(".menuConfig").classList.remove("slideIn");
    } else {
      setMenuConfig(true);
      document.querySelector(".menuConfig").classList.add("slideIn");
      document.querySelector(".menuConfig").classList.remove("slideOut");
    }
  };

  const onCreated = (e) => {
    if (e.layerType === "polygon") {
      if (e.layer.options.color == "red") {
        var tabTemp = zonesInterdites;
        tabTemp.push(e.layer.getLatLngs()[0]);
        setZonesInterdites(tabTemp);
      } else {
        setZoneJeu(e.layer.getLatLngs()[0]);
      }
    } else {
      if (
        e.layer._icon.attributes.src.nodeValue == "/src/assets/mechant1.png"
      ) {
        var tabTemp = mechants;
        tabTemp.push(e.layer.getLatLng());
        setMechants(tabTemp);
      } else {
        var tabTemp = items;
        tabTemp.push({
          name: "loupe",
          coordonnees: e.layer.getLatLng(),
        });
        setItems(tabTemp);
      }
    }
  };

  const clickZoneJeu = (e) => {
    if (zoneJeu.length > 0) {
      alert(
        "La zone de jeu est déjà présente, modifiez la ou supprimez la pour en créer une nouvelle."
      );
    } else {
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
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-draw-marker");
    return !cb[0].dispatchEvent(e);
  };

  const clickObjet = (e) => {
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-draw-marker");
    return !cb[1].dispatchEvent(e);
  };

  const clickEdit = (e) => {
    var e = document.createEvent("Event");
    e.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-edit-edit");
    return !cb[0].dispatchEvent(e);
  };

  const clickSupprimer = (e) => {
    if (clickedSupprimer) {
      //setClickedSupprimer(false);
      var e = document.createEvent("Event");
      e.initEvent("click", true, true);
      var cb = document.getElementsByClassName("leaflet-draw-actions")[2]
        .children[1];
      return !cb.dispatchEvent(e);
    } else {
      //setClickedSupprimer(true);
      var e = document.createEvent("Event");
      e.initEvent("click", true, true);
      var cb = document.getElementsByClassName("leaflet-draw-edit-remove");
      return !cb[0].dispatchEvent(e);
    }
  };

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

  console.log(items);
  async function createGame(modeJeu, listeEquipe) {
    const response = await fetch("https://scoobyhunt.fr/game/create/template", {
      method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "Sprint 1", //A CHANGER
                modeDeJeu: modeJeu,
                limitTime: 600, //A CHANGER
                teams: listeEquipe,
                authorizedZone: zoneJeu.map(zone => ({latitude:zone.lat,longitude:zone.lng})),
                unauthorizedZone: zonesInterdites.map(zone => zone.map(pts => ({latitude:pts.lat,longitude:pts.lng}))),
                mechants: mechants.map(mechant => ({latitude:mechant.lat,longitude:mechant.lng})),
                items: items.map(item => ({...item, latitude:item.coordonnees.lat,longitude:item.coordonnees.lng})),
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
            });

    console.log(
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
    );

    setPartieLancee(true);
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

  const test = () => {
    if (aa == 0) {
      ajouterJoueur([48.530437, 7.735647777777776]);
      ajouterJoueur([48.531437, 7.735]);
      setAa(1);
    } else {
      deplacerJoueur(0, [
        Math.random() * (48.54 - 48.53) + 48.53,
        Math.random() * (7.74 - 7.73) + 7.73,
      ]);
    }
  };

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
              },
              polygon: true,
            }}
            edit={{
              remove: false,
              edit: false,
            }}
            onCreated={(e) => onCreated(e)}
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
              polygon: {
                shapeOptions: {
                  guidelineDistance: 10,
                  color: "red",
                  weight: 3,
                },
              },
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
            <div
              id="btnZone"
              onClick={(e) => clickZoneJeu(e)}
              className="btnSideBar"
            >
              <img src="gaming-zone.png" alt="" className="iconBar" />
              Zone de jeu
            </div>
            <div
              id="btnZoneInterdite"
              onClick={(e) => clickZoneInterdite(e)}
              className="btnSideBar"
            >
              <img src="forbidden.png" alt="" className="iconBar" />
              Zone interdite
            </div>
            <div
              id="btnFlag"
              onClick={(e) => clickMechant(e)}
              className="btnSideBar"
            >
              <img src="mechant1.png" alt="" className="iconBar" />
              Méchants
            </div>
            <div
              id="btnItems"
              onClick={(e) => clickObjet(e)}
              className="btnSideBar"
            >
              <img src="loupe.png" alt="" className="iconBar" />
              Objets
            </div>
            <div
              id="btnZone"
              onClick={(e) => clickEdit(e)}
              className="btnSideBar"
            >
              <img src="edit.png" alt="" className="iconBar" />
              Editer
            </div>
            <div
              id="btnZone"
              onClick={(e) => clickSupprimer(e)}
              className="btnSideBar"
            >
              <img src="bin.png" alt="" className="iconBar" />
              Supprimer
            </div>
          </div>
          <img
            onClick={() => clickBtnConfig()}
            className="btnConfig"
            src="settings.svg"
            alt=""
          />
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
