import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";
import React from "react";
import { useState, useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Marker,
  Popup,
  Polygon,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import mechant1 from "../../assets/mechant1.png";
import loupe from "../../assets/loupe.png";
import player from "../../assets/points.png";
import mechant2 from "../../assets/mechant2.png";
import ghost from "../../assets/ghost.png";
import lunettes from "../../assets/lunettes.png";
import sac from "../../assets/sac.png";

export default function Game({ MERCURE_PORT, DB_PORT }) {
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
  console.log(DB_PORT);
  console.log(MERCURE_PORT);
  useEffect(() => {
    const url = new URL(
      "http://207.154.194.125:" + MERCURE_PORT + "/.well-known/mercure"
    );
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
      if (user.latitude || user.longitude) {
        if (!alreadyExist) {
          ajouterJoueur(user.id, user.pseudo, [user.latitude, user.longitude]);
        } else {
          deplacerJoueur(user.id, user.pseudo, [user.latitude, user.longitude]);
        }
      }

      // else if (data.includes("deplacer")) {
      //     deplacerJoueur(0, [Math.random() * (48.54 - 48.53) + 48.53, Math.random() * (7.74 - 7.73) + 7.73]);
      // }
    };

    return () => eventSource.close();
  }, [joueurs]);

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

  const playerIcon = new L.icon({
    iconUrl: player,
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

  const ajouterJoueur = (id, pseudo, coordonnees) => {
    //setJoueurs([...joueurs, { id: joueurs.length, coordonnees: coordonnees }])
    setJoueurs((oldJoueurs) => [
      ...oldJoueurs,
      { id: id, pseudo: pseudo, coordonnees: coordonnees },
    ]);
  };

  const deplacerJoueur = (idJoueur, pseudo, coordonnees) => {
    setJoueurs((cur) =>
      cur.map((joueur, i) => {
        if (joueur.id === idJoueur) {
          return {
            id: joueur.id,
            pseudo: joueur.pseudo,
            coordonnees: coordonnees,
          };
        } else {
          return joueur;
        }
      })
    );
    //setJoueurs([...joueurs, { id: idJoueur, coordonnees: coordonnees }])
  };

  console.log(items);

  const jsonTemplate = {
    name: "Sprint 1",
    modeDeJeu: "Time",
    limitTime: 600,
    teams: [
      { id: 0, nom: "", nbJoueur: 1 },
      { id: 1, nom: "", nbJoueur: 1 },
    ],
    authorizedZone: [
      { latitude: 48.531554876601575, longitude: 7.730319499969483 },
      { latitude: 48.52597026236857, longitude: 7.733323574066163 },
      { latitude: 48.52645343399219, longitude: 7.742335796356202 },
      { latitude: 48.53102912493336, longitude: 7.746648788452149 },
      { latitude: 48.53506448436637, longitude: 7.742335796356202 },
      { latitude: 48.530105493919145, longitude: 7.735276222229005 },
    ],
    unauthorizedZone: [
      [
        { latitude: 48.53128489669709, longitude: 7.735104560852052 },
        { latitude: 48.52442123990932, longitude: 7.73714303970337 },
        { latitude: 48.5252028626682, longitude: 7.73115634918213 },
        { latitude: 48.53151224829131, longitude: 7.726864814758302 },
        { latitude: 48.533217352709855, longitude: 7.7295899391174325 },
      ],
    ],
    mechants: [
      {
        name: "mechant1",
        latitude: 48.52945183717502,
        longitude: 7.739696502685548,
      },
      {
        name: "mechant1",
        latitude: 48.53270582741343,
        longitude: 7.74263620376587,
      },
      {
        name: "mechant2",
        latitude: 48.52892606367095,
        longitude: 7.733538150787354,
      },
    ],
    items: [
      {
        name: "lunettes",
        latitude: 48.527576079671896,
        longitude: 7.739160060882569,
      },
      {
        name: "ghost",
        latitude: 48.5317822269836,
        longitude: 7.740082740783692,
      },
    ],
    private: true,
    idCreator: "1",
  };

  const InfosPartie = ({ time, setTime }) => {
    useEffect(() => {
      const interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
      return () => clearInterval(interval);
    }, [time]);
    return (
      <div
        style={{
          zIndex: "1000",
          position: "absolute",
          backgroundColor: "#ee9158",
          marginLeft: "45%",
          marginRight: "50%",
          padding: 30,
          fontSize: 30,
        }}
      >
        {time}
      </div>
    );
  };

  const [time, setTime] = useState(jsonTemplate.limitTime);
  return (
    <MapContainer center={[48.530437, 7.735647777777776]} zoom={16}>
      <InfosPartie time={time} setTime={setTime} />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polygon
        pathOptions={{ color: "#6b2b94" }}
        positions={jsonTemplate.authorizedZone.map((point) => [
          point.latitude,
          point.longitude,
        ])}
      />
      {jsonTemplate.unauthorizedZone.map((zone) => (
        <Polygon
          pathOptions={{ color: "#ee9158" }}
          positions={zone.map((point) => [point.latitude, point.longitude])}
        />
      ))}
      {jsonTemplate.mechants.map((mechant, id) => {
        console.log(mechant);
        let mechantItem = "";
        if (mechant.name == "mechant1") {
          mechantItem = mechant1Icon;
        } else {
          mechantItem = mechant2Icon;
        }
        return (
          <Marker
            key={id}
            position={[mechant.latitude, mechant.longitude]}
            icon={mechantItem}
          ></Marker>
        );
      })}

      {jsonTemplate.items.map((item, id) => {
        console.log(item);
        let iconItem = "";
        if (item.name === "ghost") {
          iconItem = ghostIcon;
        } else if (item.name === "lunettes") {
          iconItem = lunettesIcon;
        } else if (item.name === "sac") {
          iconItem = sacIcon;
        } else {
          iconItem = loupeIcon;
        }
        return (
          <Marker
            key={id}
            position={[item.latitude, item.longitude]}
            icon={iconItem}
          ></Marker>
        );
      })}
      {joueurs.map((joueur, id) => {
        console.log(joueur);

        return (
          <Marker key={id} position={joueur.coordonnees} icon={playerIcon}>
            <Popup>Joueur : {joueur.pseudo}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
//<button onClick={()=> document.location.href="/choiceTeam"}>Aller au choix des équipes</button>
renderOnDomLoaded(
  <Game
    MERCURE_PORT={document.querySelector("#MERCURE_PORT").value}
    DB_PORT={document.querySelector("#DB_PORT").value}
  />,
  "GameRoot"
);
