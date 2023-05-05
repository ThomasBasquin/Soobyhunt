import {useState, useEffect} from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import COLORS from '../../Constantes/colors';
import URLS from '../../Constantes/URLS';
import useUrl from '../../Constantes/Hooks/useUrl';
import useServer from '../../Constantes/Hooks/useServer';

function Welcome({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [ipParty, setIpParty] = useState(null);
  const {GAME} = useUrl();
  const [server, setServer] = useServer();

  function getConfig() {
    setIsLoading(true);
    fetch(ipParty.trim() + '/user/join', {
      method: 'POST',
      headers: {
        'Content-type': 'Application/json',
      },
      body: JSON.stringify({pseudo: pseudo}),
    })
      .then(res => res.json())
      .then(user => {
        setServer({idUser: user.id, pseudo, server: ipParty.trim()});
        navigation.navigate('Team');
      })
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
      <TextInput
        style={{borderWidth: 1, borderRadius: 15, width: '50%'}}
        onChangeText={setPseudo}
        value={pseudo}
        placeholder="Pseudo"
        keyboardType="default"
      />
      <TextInput
        style={{borderWidth: 1, borderRadius: 15, width: '50%'}}
        onChangeText={e => setIpParty(e)}
        value={ipParty}
        placeholder="ID de la partie"
        keyboardType="default"
      />
      <TouchableOpacity
        style={{
          opacity: isLoading || !ipParty ? 0.7 : 1,
          width: '50%',
          marginVertical: 20,
          padding: 10,
          backgroundColor: COLORS.primary,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        disabled={isLoading || !ipParty}
        onPress={getConfig}>
        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.secondary} />
        ) : (
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: COLORS.white,
            }}>
            Rejoindre la partie
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default Welcome;
