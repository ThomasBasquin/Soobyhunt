import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import COLORS from '../../Constantes/colors';
import useServer from '../../Constantes/Hooks/useServer';
import {useEffect, useMemo, useState} from 'react';
import useUrl from '../../Constantes/Hooks/useUrl';
/** @ts-ignore */
import { DateTime } from "luxon";

function Party({route, navigation}: any) {
  const [{idUser}, setServer] = useServer();
  const [isLoading, setIsLoading] = useState(true);
  const {GAME} = useUrl();
  const [party, setParty] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if(!party?.game.startAt)return;
    
      const interval = setInterval(()=>{
        const endAt = DateTime.fromISO(party.game.startAt).plus({seconds : party.game.limitTime});
        
        
        const diff = endAt.diff(DateTime.now(), ["minutes"]);
        
        
        setTimeLeft(diff.toFormat("hh'h' mm"));
      },1000);


      return () =>  clearInterval(interval);
  }, [party]);
  

  useEffect(()=>{
    refresh()
    const interval = setInterval(refresh,60000);

    return () => clearInterval(interval);
  },[]);

  function refresh(){
    fetch(GAME.getInfo)
    .then(res => res.json())
    .then(info => {
      setParty(info);
    })
    .finally(() => setIsLoading(false));
  }
  

  return (
    <ScrollView style={{backgroundColor: COLORS.secondary}}>
      {isLoading || !party ? <ActivityIndicator size="large" color={COLORS.primary} /> :
      <>
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
      <Text style={{fontSize: 30, fontWeight: '800', color: '#fff',marginLeft:20}}>
        {party.game.name}
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
            <Text style={{color:"#000"}}>Nom du serveur :</Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                fontWeight: '700',
                color: COLORS.primary,
              }}>
              {party.game.name}
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
            <Text style={{color:"#000"}}>Mode de jeu :</Text>
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
            <Text style={{color:"#000"}}>Nombre d'équipe :</Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                fontWeight: '700',
                color: COLORS.primary,
              }}>
              {party.teams.length}
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
            <Text style={{color:"#000"}}>Début de la partie :</Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                fontWeight: '700',
                color: COLORS.primary,
              }}>{DateTime.fromISO(party.game.startAt).toLocaleString(DateTime.DATETIME_SHORT)}</Text>
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
        <Text style={{color:"#000"}}>TEMPS RESTANT :</Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            fontWeight: '700',
            color: COLORS.primary,
          }}>
          {timeLeft}
        </Text>
      </View>
      <View style={{margin: '2.5%'}}>
        <Text style={{color: '#fff'}}>MON EQUIPE</Text>
        {party.teams.map((team:any) => {
          if(!team.playersScore.find((user:any) => user.id == idUser))return;
          return (
            <View style={style.card}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5,
            }}>
            <Text style={{fontSize: 25, fontWeight: '700', color:"#000"}}>{team.team}</Text>
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
                {team.playersScore.reduce((acc:any, val:any) => val.score + acc, 0)}
              </Text>
              <Image
                source={require('../../Assets/Icon/fleurPoint.png')}
                style={{width: 25, aspectRatio: 1}}
              />
            </View>
          </View>
          {team.playersScore
            .sort((a:any, b:any) => (a.score < b.score ? 1 : -1))
            .map((p:any) => (
              <View
                key={p.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderBottomColor: '#e0e0e0',
                  borderBottomWidth: 1,
                  padding: 5,
                }}>
                <Text style={{color:"#000"}}>{p.pseudo}</Text>
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
                    {p.score}
                  </Text>
                  <Image
                    source={require('../../Assets/Icon/fleurPoint.png')}
                    style={{aspectRatio: 1}}
                  />
                </View>
              </View>
            ))}
        </View>
        )})}
        </View>
      <View style={{margin: '2.5%'}}>
        <Text style={{color: '#fff'}}>CLASSEMENT</Text>
        <View style={style.card}>
          {party.teams.sort((a:any,b:any) => a.playersScore.reduce((acc:any, val:any) => val.score + acc, 0) < b.playersScore.reduce((acc:any, val:any) => val.score + acc, 0) ? 1 : -1).map((t:any, i:any) => (
            <View
              key={t.team}
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
                  {t.team}
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
                  {t.playersScore.reduce((acc:any, val:any) => val.score + acc, 0)}
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
      </>
      }
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
