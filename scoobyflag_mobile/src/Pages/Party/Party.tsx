import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import COLORS from '../../Constantes/colors';
import useServer from '../../Constantes/Hooks/useServer';
import {useMemo} from 'react';

function Party({route, navigation}: any) {
  const [server, setServer] = useServer();

  const teams = useMemo(
    () => [
      {
        name: 'Equipe 1',
        players: [
          {player: 'Roméo', point: 3},
          {player: 'Hugo', point: 10},
          {player: 'Lucas', point: 2},
          {player: 'Thomas', point: 1},
          {player: 'Gaytan', point: 0},
        ],
      },
      {
        name: 'Equipe 2',
        players: [
          {player: 'Roméo', point: 10},
          {player: 'Hugo', point: 0},
          {player: 'Lucas', point: 3},
          {player: 'Thomas', point: 4},
          {player: 'Gaytan', point: 2},
        ],
      },
      {
        name: 'Equipe 3',
        players: [
          {player: 'Roméo', point: 7},
          {player: 'Hugo', point: 2},
          {player: 'Lucas', point: 0},
          {player: 'Thomas', point: 0},
          {player: 'Gaytan', point: 0},
        ],
      },
      {
        name: 'Equipe 4',
        players: [
          {player: 'Roméo', point: 15},
          {player: 'Hugo', point: 5},
          {player: 'Lucas', point: 4},
          {player: 'Thomas', point: 3},
          {player: 'Gaytan', point: 1},
        ],
      },
    ],
    [],
  );

  return (
    <ScrollView style={{backgroundColor: COLORS.secondary}}>
      <View style={{flexDirection: 'row-reverse'}}>
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={{
            padding: 10,
            margin: 10,
            zIndex: 10,
            borderRadius: 10,
            backgroundColor: COLORS.primary,
          }}>
          <Text style={{fontWeight: '600', fontSize: 20, color: '#fff'}}>
            Carte
          </Text>
        </Pressable>
      </View>
      {/* TODO : nom de la partie */}
      <Text style={{fontSize: 30, fontWeight: '800', color: '#fff'}}>
        Partie de Roméo
      </Text>
      <View style={{margin: '2.5%'}}>
        <Text style={{color: '#fff'}}>CONFIGURATION</Text>
        <View style={style.card}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: '#e0e0e0',
              borderBottomWidth: 1,
              padding: 5,
            }}>
            <Text>Nom du serveur :</Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                fontWeight: '700',
                color: COLORS.primary,
              }}>
              jeu.romeo.fr:8000
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: '#e0e0e0',
              borderBottomWidth: 1,
              padding: 5,
            }}>
            <Text>Mode de jeu :</Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                fontWeight: '700',
                color: COLORS.primary,
              }}>
              TIME
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: '#e0e0e0',
              borderBottomWidth: 1,
              padding: 5,
            }}>
            <Text>Nombre d'équipe :</Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                fontWeight: '700',
                color: COLORS.primary,
              }}>
              4
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: '#e0e0e0',
              borderBottomWidth: 1,
              padding: 5,
            }}>
            <Text>Maître du jeu :</Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                fontWeight: '700',
                color: COLORS.primary,
              }}>
              Roméo Probstate
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: '#e0e0e0',
              borderBottomWidth: 1,
              padding: 5,
            }}>
            <Text>Début de la partie :</Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                fontWeight: '700',
                color: COLORS.primary,
              }}>{`${new Date().toLocaleDateString()} à ${new Date()
              .toLocaleTimeString()
              .replace(':', 'h')
              .substring(0, 5)}`}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          margin: '2.5%',
          ...style.card,
          padding: 15,
        }}>
        <Text>TEMPS RESTANT :</Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            fontWeight: '700',
            color: COLORS.primary,
          }}>
          1h52
        </Text>
      </View>
      <View style={{margin: '2.5%'}}>
        <Text style={{color: '#fff'}}>MON EQUIPE</Text>
        <View style={style.card}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5,
            }}>
            <Text style={{fontSize: 25, fontWeight: '700'}}>Equipe 1</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'right',
                  fontWeight: '700',
                  color: COLORS.primary,
                  fontSize: 25,
                  marginRight: 5,
                }}>
                {teams[0].players.reduce((acc, val) => val.point + acc, 0)}
              </Text>
              <Image
                source={require('../../Assets/Icon/fleurPoint.png')}
                style={{width: 25, aspectRatio: 1}}
              />
            </View>
          </View>
          {teams[0].players
            .sort((a, b) => (a.point < b.point ? 1 : -1))
            .map(p => (
              <View
                key={p.player}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderBottomColor: '#e0e0e0',
                  borderBottomWidth: 1,
                  padding: 5,
                }}>
                <Text>{p.player}</Text>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'right',
                      fontWeight: '700',
                      color: COLORS.primary,
                      marginRight: 5,
                    }}>
                    {p.point}
                  </Text>
                  <Image
                    source={require('../../Assets/Icon/fleurPoint.png')}
                    style={{aspectRatio: 1}}
                  />
                </View>
              </View>
            ))}
        </View>
      </View>
      <View style={{margin: '2.5%'}}>
        <Text style={{color: '#fff'}}>CLASSEMENT</Text>
        <View style={style.card}>
          {teams.sort((a,b) => a.players.reduce((acc, val) => val.point + acc, 0) < b.players.reduce((acc, val) => val.point + acc, 0) ? 1 : -1).map((t, i) => (
            <View
              key={t.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: i == 0 ? COLORS.primary : COLORS.secondary,
                borderRadius: 15,
                padding: i == 0 ? 15 : 5,
                marginVertical: 5,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: i == 0 ? 30 : 25,
                    fontWeight: '700',
                    color:
                      i == 0
                        ? '#e6e600'
                        : i == 1
                        ? '#bfbfbf'
                        : i == 2
                        ? '#CD7F32'
                        : '#fff',
                    marginRight: 10,
                  }}>
                  {i + 1} |
                </Text>
                <Text
                  style={{
                    fontSize: i == 0 ? 30 : 25,
                    fontWeight: '700',
                    color: i == 0 ? '#fff' : "#fff",
                  }}>
                  {t.name}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    fontWeight: '700',
                    color: i == 0 ? '#fff' : "#fff",//TODO : hey
                    fontSize: i == 0 ? 30 : 25,
                    marginRight: 5,
                  }}>
                  {t.players.reduce((acc, val) => val.point + acc, 0)}
                </Text>
                <Image
                  source={require('../../Assets/Icon/fleurPoint.png')}
                  style={{width: 25, aspectRatio: 1}}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
      <Pressable
        onPress={() => setServer({})}
        style={{
          padding: 10,
          margin: 10,
          zIndex: 10,
          borderRadius: 10,
          backgroundColor: COLORS.primary,
        }}>
        <Text style={{textAlign: 'center', fontWeight: '700', color: '#fff'}}>
          Quitter la partie en cours
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 13,
  },
});

export default Party;
