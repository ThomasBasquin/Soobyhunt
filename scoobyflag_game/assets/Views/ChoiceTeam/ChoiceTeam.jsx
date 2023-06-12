import React from "react";
import { useState, useEffect, useCallback } from "react";
import renderOnDomLoaded from "../../Utils/renderOnDomLoaded";
import Loader from "../../Components/Loader";

function ChoiceTeam() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [teams, setTeams] = useState([]);
  const [joueursConnectes, setjoueursConnectes] = useState([]);
  const [selected, setSelected] = useState(null);
  
  const [nomPartie, setnomPartie] = useState("Hudog");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/team")
      .then((res) => res.json())
      .then(setTeams)
      .finally(() => setIsLoading(false));

      
      
  }, []);
 useEffect(()=> {
  teams.map(
    (t)=> {
      {!t.id ? setjoueursConnectes(t.players) : ""}
    }
  )
  
 })
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
      "http://hugoslr.fr:16640/.well-known/mercure".concat("?topic=", topic)
    );

    eventSource.onopen = (event) => {
      console.log("Open SSE connection.");
    };

    eventSource.onmessage = (event) => {
      const user = JSON.parse(JSON.parse(event.data));
      console.log(user);
      console.log(teams);
      if (!user.id || user.isReady == null || !user.pseudo) return;

      onMessageListen(user);
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
}) => {
  useEffect(() => {}, [joueursConnectes, teams]);

  const placerJoueur = (id) => {
    // newListeEquipe[id].listeDesJoueurs.push(joueursConnectes[selected-1]);
    // setNomsEquipe(newListeEquipe);
    console.log(id);
    console.log(joueursConnectes);
    console.log();

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
          Partie de {nomPartie}
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
            marginTop : 10,
            
          }}
          className="lancerPartie"

          onClick={()=> document.location.href="/game"}
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
              </div>) : (<></>);
          })}
        </div>
        <h1 style={{ textAlign: "center", marginBottom: 40 }}>
          Rejoindre :{" "}
          <span style={{ fontSize: 50, color: "red" }}>
            {window.location.href.substring(0, window.location.href.length - 1)}
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
renderOnDomLoaded(<ChoiceTeam />, "HomeRoot");
