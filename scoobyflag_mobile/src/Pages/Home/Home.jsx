import {View} from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';

export default function Home({navigation}) {
  return (
    <View>
    <MapView
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}>
       <UrlTile
        urlTemplate="http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
        maximumZ={19}
        />
      </MapView>
    </View>
  );
}
