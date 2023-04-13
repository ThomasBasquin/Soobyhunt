import {useEffect, useState} from 'react';
import {TouchableOpacity, Text, View, Image} from 'react-native';
import COLORS from '../../Constantes/colors';
import URLS from '../../Constantes/URLS';

function Team({navigation}) {
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [test, setTest] = useState(true);

  useEffect(() => {
    fetch(URLS.getTemplate.replace('{game}', 7))
      .then(res => res.json())
      .then(e => setConfig(e.gameTemplate))
      .finally(() => setIsLoading(false));
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
      <Text>{test}</Text>
      {isLoading ? <Text>Chargement...</Text> : null}
    </View>
  );
}

export default Team;
