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
import mechant1 from "../../assets/mechant1.png";
import loupe from "../../assets/loupe.png";
import player from "../../assets/points.png";
import mechant2 from "../../assets/mechant2.png";
import ghost from "../../assets/ghost.png";
import lunettes from "../../assets/lunettes.png";
import sac from "../../assets/sac.png";
import Loader from "../../Components/Loader";

export default function Game({ MERCURE_PORT, ID, HOST_PORT }) {
  const [joueurs, setJoueurs] = useState([]);
  const [map, setMap] = useState(null);
  const [teams, setTeams] = useState(null);
  const [config, setConfig] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState(null);
  const [timeDepart, setTimeDepart] = useState(null);
  const [timeFin, setTimeFin] = useState(null);

  useEffect(() => {
    let promiseAll = [];

    /*promiseAll.push(() => fetch("http://207.154.194.125:" + HOST_PORT + "/team")
      .then((res) => res.json())
      .then(setTeams));
 
    promiseAll.push(() => fetch("https://scoobyhunt.fr/game/" + ID)
      .then((res) => res.json())
      .then((json) => {
        setConfig(json);
        console.log(json);
        setTime(json.limitTime)
      }
      ));
 
    Promise.all(promiseAll)
      .then(([res1, res2]) => {
 
      })
      .catch(() => { })
      .finally(() => { });*/

    fetch("http://207.154.194.125:" + HOST_PORT + "/team")
      .then((res) => res.json())
      .then(setTeams);

    fetch("https://scoobyhunt.fr/game/" + ID)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setConfig(json);
        setTime(json.json.limitTime)
        setIsLoading(false);
      })

    fetch("http://207.154.194.125:" + HOST_PORT + "/game/info")
      .then((res) => res.json())
      .then((json) => {
        setTimeDepart(new Date(json.game.startAt).getTime());
        console.log(new Date(json.game.startAt).getTime());
        console.log(Date.now());
        console.log(Date.now() - new Date(json.game.startAt).getTime());
      })

  }, []);

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
      //console.log(data);
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

  const InfosPartie = ({ time, setTime }) => {
    useEffect(() => {
      const interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
      return () => clearInterval(interval);
    }, [time]);

    var heures = 0;
    var minutes = 0;
    var secondes = 0;
    var total = time;

    if (total > 3600) {
      heures = Math.trunc(total / 3600);
      total -= heures * 3600;
    }
    if (total > 60) {
      minutes = Math.trunc(total / 60);
      total -= minutes * 60;
    }
    secondes = total;

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
        {heures}:{minutes}:{secondes}
      </div>
    );
  };

  return isLoading ? <Loader /> :
    <MapContainer center={[48.530437, 7.735647777777776]} zoom={16}>
      <InfosPartie time={time} setTime={setTime} />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polygon
        pathOptions={{ color: "#6b2b94" }}
        positions={config.json.authorizedZone.map((point) => [
          point.latitude,
          point.longitude,
        ])}
      />
      {config.json.unauthorizedZone.map((zone) => (
        <Polygon
          pathOptions={{ color: "#ee9158" }}
          positions={zone.map((point) => [point.latitude, point.longitude])}
        />
      ))}
      {config.json.mechants.map((mechant, id) => {
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

      {config.json.items.map((item, id) => {
        //console.log(item);
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
        //console.log(joueur);

        return (
          <Marker key={id} position={joueur.coordonnees} icon={playerIcon}>
            <Popup>Joueur : {joueur.pseudo}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
};
//<button onClick={()=> document.location.href="/choiceTeam"}>Aller au choix des équipes</button>
renderOnDomLoaded(
  <Game MERCURE_PORT={document.querySelector("#MERCURE_PORT").value}
    ID={document.querySelector("#ID").value}
    HOST_PORT={document.querySelector("#HOST_PORT").value} />,
  "GameRoot"
);
