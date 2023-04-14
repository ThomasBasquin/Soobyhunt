import {Text, View, Pressable} from 'react-native';
import COLORS from '../../Constantes/colors';
import useServer from '../../Constantes/Hooks/useServer';

function Party({route, navigation}: any) {
  const [server, setServer] = useServer();

  return (
    <View>
      <View style={{flexDirection: 'row-reverse'}}>
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={{
            padding: 10,
            margin: 10,
            zIndex: 10,
            borderRadius: 10,
            backgroundColor: COLORS.secondary,
          }}>
          <Text style={{fontWeight: '600', fontSize: 20}}>Carte</Text>
        </Pressable>
      </View>
      <Text>Heyy</Text>
      <Pressable
        onPress={() => setServer({})}
        style={{
          padding: 10,
          margin: 10,
          zIndex: 10,
          borderRadius: 10,
          backgroundColor: COLORS.secondary,
        }}>
        <Text style={{textAlign:"center", fontWeight:"700"}}>Quitter la party</Text>
      </Pressable>
    </View>
  );
}

export default Party;
