import {useState, useEffect} from 'react';
import {Pressable, ActivityIndicator, Text, View} from 'react-native';
import COLORS from '../../Constantes/colors';
import useUrl from '../../Constantes/Hooks/useUrl';
import useServer from '../../Constantes/Hooks/useServer';

function Team({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [server, setServer] = useServer();
  const {API, GAME} = useUrl();

  useEffect(() => {
    // fetch(GAME)
  }, []);

  function loadMap() {
    setIsLoading(true);
    fetch(API.getTemplate.replace('{game}', 4))
      .then(res => res.json())
      .then(e => setServer({...server, map: e.gameTemplate.json}))
      .finally(() => setIsLoading(false));
  }

  return (
    <View style={{width: '100%', flex: 1}}>
      <Pressable
        style={{
          position: 'absolute',
          bottom: 10,
          opacity: isLoading ? 0.7 : 1,
          marginVertical: '5%',
          marginHorizontal: '25%',
          padding: 10,
          width: '50%',
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
            Se mettre prêt
          </Text>
        )}
      </Pressable>
    </View>
  );
}

export default Team;
