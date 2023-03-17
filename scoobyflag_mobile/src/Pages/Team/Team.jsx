import {useMemo, useEffect, useState} from 'react';
import {TouchableOpacity, Text, View, Image} from 'react-native';
import COLORS from '../../Constantes/colors';
import usePlayer from '../../Constantes/Hooks/usePlayer';
import URLS from '../../Constantes/URLS';

function Team({navigation}) {
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const stest = {
    gameTemplate: {
      id: 6,
      name: 'Sprint 1',
      gameMaster: null,
      gameZones: [
        {
          id: 7,
          locations: [
            {id: 32, latitude: '48.528499756822', longitude: '7.7330231666565'},
            {id: 33, latitude: '48.528499756822', longitude: '7.7330231666565'},
            {id: 34, latitude: '48.528499756822', longitude: '7.7330231666565'},
            {id: 35, latitude: '48.528499756822', longitude: '7.7330231666565'},
          ],
          type: 'unauthorized',
        },
        {
          id: 8,
          locations: [
            {id: 28, latitude: '48.530887028951', longitude: '7.7333235740662'},
            {id: 29, latitude: '48.530823085629', longitude: '7.7383178472519'},
            {id: 30, latitude: '48.52835410116', longitude: '7.7384197711945'},
            {id: 31, latitude: '48.528499756822', longitude: '7.7330231666565'},
          ],
          type: 'authorized',
        },
      ],
      objectives: [
        {
          id: 6,
          latitude: '48.530379032552',
          longitude: '7.7366656064987',
          visionRange: 10,
          activeRange: 10,
        },
      ],
      items: [
        {
          visionRange: 10,
          activeRange: 10,
          longitude: '7.736890912056',
          latitude: '48.530244039645',
          name: 'loupe',
        },
      ],
      limitTime: 600,
      mode: 'time',
      private: true,
      teams: [
        {id: 11, name: 'equipe1', playerMax: 4},
        {id: 12, name: 'equipe2', playerMax: 8},
      ],
    },
  };

  useEffect(() => {
    
    // fetch(URLS.getTemplate.replace('{game}', 18))
    //   .then(res => res.json())
    //   .then(res => {
    //     console.log(res.gameTemplate.gameZones);
    //     return res;
    //   })
    //   .then((e)=>setConfig(e.gameTemplate))
    //   .finally(()=>setIsLoading(false))
  }, []);

  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flex: 1,
      }}>
      <Image
        source={require('../../Assets/LOGO.png')}
        style={{width: 150, height: 150, marginVertical: 50}}
      />
      <TouchableOpacity
        style={{
          marginVertical: '1%',
          padding: 10,
          width: '48%',
          backgroundColor: COLORS.primary,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        disabled={isLoading}
        onPress={() => {
          navigation.navigate('Home', {gameConfiguration: config});
        }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: COLORS.white,
          }}>
          Charger la configuration
        </Text>
      </TouchableOpacity>
      {isLoading ? <Text>Chargement...</Text> : null}
    </View>
  );
}

export default Team;
