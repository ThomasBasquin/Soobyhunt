import Geolocation from '@react-native-community/geolocation';
import {useState, useEffect, useCallback, useRef} from 'react';
import {View, Button} from 'react-native';
import MapView, {Marker, PROVIDER_DEFAULT, UrlTile} from 'react-native-maps';
import useInterval from '../../Constantes/Hooks/useInterval';

export default function Home({navigation}) {
  const [currentPosition, setCurrentPosition] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [region, setRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  function getCurrentPosition(fixPosition = false) {
    Geolocation.getCurrentPosition(
      pos => {
        if (fixPosition)
          setRegion({
            ...region,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        setCurrentPosition({
          ...currentPosition,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      error => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
      {enableHighAccuracy: true},
    );
  }

  useEffect(() => {
    getCurrentPosition(true);
  }, []);

  useInterval(() => {
    getCurrentPosition();
  }, 10000);

  return region.longitude && region.latitude ? (
    <View>
      <MapView
        showsUserLocation={true}
        provider={PROVIDER_DEFAULT}
        style={{width: '100%', height: '100%'}}
        mapType={'none'}
        minZoomLevel={5}
        maxZoomLevel={16}
        pitchEnabled={false}
        followsUserLocation={true}
        initialRegion={region}
        showsCompass={true}
        onRegionChange={setRegion}>
        <UrlTile
          style={{width: '100%', height: '100%'}}
          urlTemplate={`http://tile.stamen.com/terrain/{z}/{x}/{y}.png`}
          shouldReplaceMapContent={true}
          maximumZ={19}
          flipY={false}
        />
        {/* <Marker
          tappable={false}
          coordinate={{
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
          }} /> */}
      </MapView>
    </View>
  ) : null;
}
