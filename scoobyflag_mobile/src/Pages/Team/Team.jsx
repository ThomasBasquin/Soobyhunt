import {useState, useEffect} from 'react';
import {Pressable, ActivityIndicator, Text, View} from 'react-native';
import COLORS from '../../Constantes/colors';
import useUrl from '../../Constantes/Hooks/useUrl';
import useServer from '../../Constantes/Hooks/useServer';
import EventSource from 'react-native-sse';

function Team({navigation}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [server, setServer] = useServer();
  const [isReady, setIsReady] = useState(false);
  const [teams, setTeams] = useState([]);
  const {API, GAME} = useUrl();

  useEffect(() => {
    fetch(GAME.team)
      .then(res => res.json())
      .then(setTeams)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!server.idUser) return;
    const topic = encodeURIComponent(
      'https://scoobyflag/user/' + server.idUser,
    );

    const eventSource = new EventSource(
      'http://hugoslr.fr:16640/.well-known/mercure'.concat('?topic=', topic),
    );

    eventSource.addEventListener('open', event => {
      console.debug("Open SSE connection.");
    });

    eventSource.addEventListener('message', event => {
      const user = JSON.parse(JSON.parse(event.data));
      if (!user.id || !user.isReady || !user.team || !user.pseudo) return;
      if (!teams.length) return;
      console.log(user);
      const teamUser = teams.find(t => t.players.find(p => p.id == user.id));
      if (teamUser) {
        if (teamUser.id == user.team.id) {
          setTeams(cur =>
            cur.map(t =>
              t.id == teamUser.id
                ? {
                    ...t,
                    players: t.players.map(p =>
                      p.id == user.id ? {...p, isReady: user.isReady} : p,
                    ),
                  }
                : t,
            ),
          );
        } else {
          setTeams(cur =>
            cur.map(t =>
              t.id == user.team.id
                ? {
                    ...t,
                    players: [
                      ...t.players,
                      {pseudo: user.pseudo, id: user.id, isReady: user.isReady},
                    ],
                  }
                : t.id == teamUser.id
                ? {...t, players: t.players.filter(p => p.id !== user.id)}
                : t,
            ),
          );
        }
      } else {
        if (user.team) {
          setTeams(cur =>
            cur.map(t =>
              t.id == user.team.id
                ? {
                    ...t,
                    players: [
                      ...t.players,
                      {pseudo: user.pseudo, id: user.id, isReady: user.isReady},
                    ],
                  }
                : t,
            ),
          );
        }
      }
    });

    eventSource.addEventListener('error', event => {
      if (event.type === 'error') {
        console.error('Connection error:', event.message);
      } else if (event.type === 'exception') {
        console.error('Error:', event.message, event.error);
      }
    });

    eventSource.addEventListener('close', event => {
      // console.debug("Close SSE connection.");
    });

    return () => {
      eventSource.removeAllEventListeners();
      eventSource.close();
    };
  }, []);

  function loadMap() {
    setIsLoading(true);
    fetch(API.getTemplate.replace('{game}', 4))
      .then(res => res.json())
      .then(e => setServer({...server, map: e.gameTemplate.json}))
      .finally(() => setIsLoading(false));
  }

  function changeTeam(newTeam) {
    setReady(false);
    const team = teams.find(t => t.id == newTeam.id);
    setTeams(cur =>
      cur.map(t =>
        t.id == team.id
          ? {
              ...t,
              players: [
                ...t.players,
                {pseudo: server.pseudo, id: server.idUser},
              ],
            }
          : t.id == server.team?.id
          ? {...t, players: t.players.filter(p => p.id !== server.idUser)}
          : t,
      ),
    );
    setServer({...server, team: newTeam});
    fetch(
      GAME.changeTeam
        .replace('{team}', newTeam.id)
        .replace('{user}', server.idUser),
      {
        method: 'PUT',
        headers: {
          'content-type': 'aplication/json',
          accept: 'application/json',
        },
        body: JSON.stringify({}),
      },
    ).catch(() => setTeams(teams.map(t => (t.id == team.id ? team : t))));
  }

  function setReady(readyProps = null) {
    const ready = readyProps ?? !isReady;
    setIsReady(ready);
    fetch(GAME.ready.replace('{user}', server.idUser), {
      method: 'PUT',
      headers: {
        'content-type': 'aplication/json',
        accept: 'application/json',
      },
      body: JSON.stringify({}),
    }).catch(() => setIsReady(!ready));
  }

  if (isLoading)
    return <ActivityIndicator size="large" color={COLORS.secondary} />;

  return (
    <View style={{width: '100%', flex: 1}}>
      <Text
        style={{
          fontSize: 30,
          color: COLORS.primary,
          fontWeight: '600',
          marginVertical: 20,
        }}>
        Choix des équipe
      </Text>
      {isReady ? (
        <Pressable
          onPress={loadMap}
          style={{
            position: 'absolute',
            right: 30,
            top: 30,
            backgroundColor: 'lightgray',
            padding: 5,
          }}>
          <Text>Commencer</Text>
        </Pressable>
      ) : null}
      <View style={{flex: 1}}>
        {teams.map(team => {
          return (
            <View key={team.id} style={{marginVertical: 20}}>
              <Text
                style={{
                  borderBottomWidth: 2,
                  borderBottomColor: COLORS.primary,
                  fontSize: 20,
                  color: COLORS.primary,
                  marginHorizontal: 5,
                }}>
                {team.name}
              </Text>
              {team.players.map((player, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 15,
                    margin: 10,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 20,
                      fontWeight: player.id == server.idUser ? '700' : '400',
                    }}>
                    {player.pseudo +
                      (player.id == server.idUser ? ' (moi)' : '')}
                  </Text>
                  <Text
                    style={{
                      color: (
                        player.id == server.idUser ? isReady : player.isReady
                      )
                        ? 'green'
                        : 'red',
                      fontWeight: '600',
                    }}>
                    {(player.id == server.idUser ? isReady : player.isReady)
                      ? 'PRET'
                      : 'PAS PRET'}
                  </Text>
                </View>
              ))}
              {server.team?.id != team.id &&
              team.nbPlayer > team.players.length ? (
                <Pressable
                  onPress={() => changeTeam(team)}
                  style={{
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: COLORS.secondary,
                    marginHorizontal: '20%',
                    borderRadius: 15,
                  }}>
                  <Text style={{fontWeight: '600'}}>
                    Rejoindre cette équipe
                  </Text>
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </View>
      {server.team ? (
        <Pressable
          style={{
            position: 'absolute',
            bottom: 10,
            opacity: isLoadingMap ? 0.7 : 1,
            marginVertical: '5%',
            marginHorizontal: '25%',
            padding: 10,
            width: '50%',
            backgroundColor: COLORS.primary,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          disabled={isLoadingMap}
          onPress={() => setReady()}>
          {isLoadingMap ? (
            <ActivityIndicator size="small" color={COLORS.secondary} />
          ) : (
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: COLORS.white,
              }}>
              {isReady ? 'Pas prêt' : 'Prêt'}
            </Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

export default Team;
