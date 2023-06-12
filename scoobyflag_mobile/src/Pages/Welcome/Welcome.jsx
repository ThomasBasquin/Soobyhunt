import {useState} from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import COLORS from '../../Constantes/colors';
import useServer from '../../Constantes/Hooks/useServer';

function Welcome({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [codeParty, setCodeParty] = useState(null);
  const [, setServer] = useServer();

  function getConfig() {
    setIsLoading(true);
    const gameServer =
      'http://207.154.194.125:8' + codeParty.trim().substring(0, 3);
    const mercureServer =
      'http://207.154.194.125:9' + codeParty.trim().substring(3, 6);

    fetch(gameServer + '/user/join', {
      method: 'POST',
      headers: {
        'Content-type': 'Application/json',
      },
      body: JSON.stringify({pseudo: pseudo}),
    })
      .then(res => {
        return res.json();
      })
      .then(user => {
        setServer({idUser: user.id, pseudo, gameServer, mercureServer});
        navigation.navigate('Team');
      })
      .catch(err => console.log("err :"+err))
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
        onChangeText={e => setCodeParty(e)}
        value={codeParty}
        placeholder="ID de la partie"
        keyboardType="default"
      />
      <TouchableOpacity
        style={{
          opacity: isLoading || !codeParty ? 0.7 : 1,
          width: '50%',
          marginVertical: 20,
          padding: 10,
          backgroundColor: COLORS.primary,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        disabled={isLoading || !codeParty}
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
