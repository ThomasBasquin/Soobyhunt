import React from "react";
import { useState, useEffect, useCallback } from "react";
import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";
import Loader from "../../Components/Loader";

function ChoiceTeam({ MERCURE_PORT, HOST_PORT, IP, ID }) {
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [joueursConnectes, setjoueursConnectes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [nomPartie, setNomPartie] = useState("Hudog");
  const [start, setStart] = useState(false);
  const [count, setCount] = useState(5);

  useEffect(() => {
    if(!start)return;

    const interval = setInterval(()=> setCount(cur => cur > 0 ? cur - 1 : cur),1000);
    
    return () => clearInterval(interval);
  }, [start]);

  useEffect(() => {
    if(count == 0){
      document.location.href = "/game";
    }
  }, [count]);

  useEffect(() => {
    fetch("http://207.154.194.125:" + HOST_PORT + "/team")
      .then((res) => res.json())
      .then(setTeams);

    fetch("http://207.154.194.125:" + HOST_PORT + "/game/info")
      .then((res) => res.json())
      .then(res => {
        if(res.game.startAt){
          document.location.href = "/game";
        }
      });

      fetch("http://207.154.194.125:" + HOST_PORT + "/team")
      .then((res) => res.json())
      .then(setTeams);

    fetch("https://scoobyhunt.fr/game/" + ID)
      .then((res) => res.json())
      .then((json) => {
        setNomPartie(json.json.name);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    teams.map((t) => {
      {
        !t.id ? setjoueursConnectes(t.players) : "";
      }
    });
  }, [joueursConnectes]);

  const onMessageListen = useCallback(
    (user) => {
      if (!user.team) {
        setjoueursConnectes([...joueursConnectes, user]);
        console.log(joueursConnectes);
      }
      const teamUser = teams.find((t) =>
        t.players.find((p) => p.id == user.id)
      );
      if (teamUser) {
        if (teamUser.id == user.team.id) {
          setTeams((cur) =>
            cur.map((t) =>
              t.id == teamUser.id
                ? {
                    ...t,
                    players: t.players.map((p) =>
                      p.id == user.id ? { ...p, isReady: user.isReady } : p
                    ),
                  }
                : t
            )
          );
        } else {
          setTeams((cur) =>
            cur.map((t) =>
              t.id == user.team.id
                ? {
                    ...t,
                    players: [
                      ...t.players,
                      {
                        pseudo: user.pseudo,
                        id: user.id,
                        isReady: user.isReady,
                      },
                    ],
                  }
                : t.id == teamUser.id
                ? { ...t, players: t.players.filter((p) => p.id !== user.id) }
                : t
            )
          );
        }
      } else {
        if (user.team) {
          setjoueursConnectes(
            joueursConnectes.filter((person) => person.id !== user.id)
          );
          setTeams((cur) =>
            cur.map((t) =>
              t.id == user.team.id
                ? {
                    ...t,
                    players: [
                      ...t.players,
                      {
                        pseudo: user.pseudo,
                        id: user.id,
                        isReady: user.isReady,
                      },
                    ],
                  }
                : t
            )
          );
        }
      }
    },
    [teams, joueursConnectes]
  );

  useEffect(() => {
    const topic = encodeURIComponent("https://scoobyflag/user/0");

    const eventSource = new EventSource(
      "http://207.154.194.125:" +
        MERCURE_PORT +
        "/.well-known/mercure".concat("?topic=", topic)
    );

    eventSource.onopen = (event) => {
      console.log("Open SSE connection.");
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!teams.length) return;
      if(data.start){
        setStart(true);
      }else{
        onMessageListen(JSON.parse(data));
      }
    };

    eventSource.onerror = (event) => {
      if (event.type === "error") {
        console.error("Connection error:", event.message);
      } else if (event.type === "exception") {
        console.error("Error:", event.message, event.error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [teams, joueursConnectes]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "linear-gradient(#6B2B94, #EE9158)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      {start ?
      <div style={{backgroundColor:"rgba(0,0,0,.7)",display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center", position:"absolute", top:0, bottom:0, right:0, left:0, zIndex:100}}>
        <p style={{fontSize: "3rem", color:"#fff"}}>La partie commence dans ...</p>
        <p style={{fontSize: "4rem", color:"#fff"}}>{count}</p>
      </div>: null}
      <ListeJoueurs
        selected={selected}
        setSelected={setSelected}
        joueursConnectes={joueursConnectes}
      />

      <ChoixEquipe
        nomPartie={nomPartie}
        teams={teams}
        selected={selected}
        setSelected={setSelected}
        joueursConnectes={joueursConnectes}
        setjoueursConnectes={setjoueursConnectes}
        setNomsEquipe={setTeams}
        HOST_PORT={HOST_PORT}
        MERCURE_PORT={MERCURE_PORT}
      />
    </div>
  );
}

const ChoixEquipe = ({
  nomPartie,
  teams,
  selected,
  setSelected,
  joueursConnectes,
  setjoueursConnectes,
  setNomsEquipe,
  HOST_PORT,
  MERCURE_PORT,
}) => {

  function startParty(){
    fetch("http://207.154.194.125:" + HOST_PORT + "/team")
  }

  const placerJoueur = (id) => {
    // newListeEquipe[id].listeDesJoueurs.push(joueursConnectes[selected-1]);
    // setNomsEquipe(newListeEquipe);    

    fetch("http://127.0.0.1:8000/user/" + selected + "/team/" + id, {
      method: "PUT",
    });
    setjoueursConnectes(
      joueursConnectes.filter((person) => person.id !== selected)
    );
    setSelected(null);
  };

  return (
    <div className="boxBlanche">
      <span
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            textDecoration: "underline",
            fontSize: 40,
          }}
        >
          {nomPartie}
        </h1>
        <div
          style={{
            background: "#6b2b94",
            position: "fixed",
            right: 70,
            top: 60,
            padding: 10,
            fontSize: 30,
            color: "white",
            marginTop: 10,
          }}
          className="lancerPartie"
          onClick={startParty}
        >
          Lancer la partie
        </div>
      </span>
      <div style={{ height: "83%", width: "100%", marginBottom: 20 }}>
        <div className="listeEquipe">
          {teams.map((noms) => {
            console.log(noms);

            return noms.id ? (
              <div className="equipe" key={noms.id}>
                <p className="titreEquipe">{noms.name}</p>
                {selected && noms.players.length < noms.nbPlayers ? (
                  <div
                    className="buttonRejoindre"
                    onClick={() => placerJoueur(noms.id)}
                  >
                    Rejoindre
                  </div>
                ) : (
                  <div></div>
                )}
                <div className="scroll">
                  {noms.players.length == 0 ? (
                    <div className="messageAucunJoueur">
                      Aucun joueur dans l'équipe actuellement.
                    </div>
                  ) : (
                    <div>
                      {noms.players.map((player) => {
                        return (
                          <div
                            style={{
                              width: "90%",
                              paddingLeft: 10,
                              backgroundColor: "black",
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 10,
                              marginLeft: 10,
                              color: "white",
                              textAlign: "center",
                              fontSize: 20,
                              borderRadius: 15,
                            }}
                          >
                            <p>{player.pseudo}</p>
                            <span style={{ marginRight: 5 }}>
                              {player.isReady ? (
                                <p style={{ color: "green" }}>Prêt</p>
                              ) : (
                                <p style={{ color: "red" }}>Pas prêt</p>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <></>
            );
          })}
        </div>
        <h1 style={{ textAlign: "center", marginBottom: 40 }}>
          Rejoindre :{" "}
          <span style={{ fontSize: 50, color: "red" }}>
            {HOST_PORT.substr(-3) + MERCURE_PORT.substr(-3)}
          </span>
        </h1>
      </div>
    </div>
  );
};

const ListeJoueurs = ({ selected, setSelected, joueursConnectes }) => {
  return (
    <div className="listeJoueurs">
      <h2
        style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: 30,
          textDecoration: "underline",
        }}
      >
        Liste des joueurs connectés
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        className="scrollJoueurs"
      >
        {joueursConnectes.map((j) => (
          <ItemJoueurs
            key={j.id}
            nom={j}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </div>
    </div>
  );
};

const ItemJoueurs = ({ nom, selected, setSelected }) => {
  return (
    <div
      onClick={() => {
        if (selected == nom.id) {
          setSelected("");
        } else {
          setSelected(nom.id);
        }
      }}
      className={selected === nom.id ? "selected itemJoueur" : "itemJoueur"}
    >
      <p style={{ marginLeft: 10, fontSize: 20 }}>{nom.pseudo}</p>
      {selected === nom.id ? (
        <img src="img/fleur.png" style={{ width: 60 }} />
      ) : (
        <div></div>
      )}
    </div>
  );
};
renderOnDomLoaded(
  <ChoiceTeam
    MERCURE_PORT={document.querySelector("#MERCURE_PORT").value}
    HOST_PORT={document.querySelector("#HOST_PORT").value}
    IP={document.querySelector("#IP").value}
    ID={document.querySelector("#ID").value}
  />,
  "HomeRoot"
);
