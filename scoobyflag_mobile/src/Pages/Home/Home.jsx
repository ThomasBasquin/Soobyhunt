import {View, Text, Button} from 'react-native';
import {UrlTile} from 'react-native-maps';
import MapView from 'react-native-maps';

export default function Home({navigation}) {
  return (
    <View>
      <MapView
        style={{height: '100%', width: '100%'}}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <UrlTile
          //   urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />
      </MapView>

      <Button title="Signin" onPress={() => navigation.navigate('Signin')} />
      <Button title="Signup" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
}
