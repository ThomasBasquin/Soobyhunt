import {Text, View} from 'react-native';

export default function Signup({navigation}) {
  return (
    <View>
      <Text>Signup</Text>
      <Button title="Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Signup" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
}
