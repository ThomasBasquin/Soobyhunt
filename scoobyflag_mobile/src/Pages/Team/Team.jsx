import {useState} from 'react';
import {Pressable, ActivityIndicator, Text, View, Image} from 'react-native';
import COLORS from '../../Constantes/colors';
import useUrl from '../../Constantes/Hooks/useUrl';
import useServer from '../../Constantes/Hooks/useServer';

function Team({navigation}) {
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [test, setTest] = useState(true);
  const [server, setServer] = useServer();
  const {API} = useUrl();

  function loadMap() {
    setIsLoading(true);
    fetch(API.getTemplate.replace('{game}', 4))
      .then(res => res.json())
      .then(e => setServer({...server, map: e.gameTemplate.json}))
      .finally(() => setIsLoading(false));
  }

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
      <Pressable
        style={{
          opacity: isLoading ? .7 : 1,
          marginVertical: '1%',
          padding: 10,
          width: '48%',
          backgroundColor: COLORS.primary,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        disabled={isLoading}
        onPress={loadMap}>
        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.secondary} />
        ) : (
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: COLORS.white,
            }}>
            Charger la configuration
          </Text>
        )}
      </Pressable>
    </View>
  );
}

export default Team;
