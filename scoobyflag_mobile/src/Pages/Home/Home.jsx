import Geolocation from '@react-native-community/geolocation';
import {useState, useEffect} from 'react';
import {Image, Text, View} from 'react-native';
import MapView, {
  Marker,
  Polygon,
  PROVIDER_DEFAULT,
  UrlTile,
} from 'react-native-maps';

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

  return region.longitude && region.latitude ? (
    <View>
      <MapView
        showsUserLocation={true}
        provider={PROVIDER_DEFAULT}
        style={{width: '100%', height: '100%'}}
        mapType={'none'}
        minZoomLevel={11}
        maxZoomLevel={18}
        pitchEnabled={false}
        followsUserLocation={true}
        initialRegion={region}
        showsCompass={true}>
        <UrlTile
          urlTemplate={'https://b.tile.openstreetmap.de/{z}/{x}/{y}.png'}
          maximumZ={19}
          shouldReplaceMapContent={true}
        />
        <Polygon
          zIndex={100}
          strokeWidth={3}
          geodesic={true}
          strokeColor={'rgba(255, 0, 0,0.9)'}
          fillColor={'rgba(255, 102, 102,.3)'}
          coordinates={[
            {
              latitude: currentPosition.latitude + 0.01,
              longitude: currentPosition.longitude + 0.01,
            },
            {
              latitude: currentPosition.latitude + 0.02,
              longitude: currentPosition.longitude + 0.02,
            },
            {
              latitude: currentPosition.latitude + 0.01,
              longitude: currentPosition.longitude - 0.01,
            },
            {
              latitude: currentPosition.latitude - 0.01,
              longitude: currentPosition.longitude - 0.01,
            },
            {
              latitude: currentPosition.latitude - 0.01,
              longitude: currentPosition.longitude + 0.01,
            },
          ]}
        />
        <Marker
          tappable={false}
          coordinate={{
            latitude: currentPosition.latitude + 0.001,
            longitude: currentPosition.longitude + 0.001,
          }}
          description={"Le vilan est possédé par l'équipe MOUGOU"}
          title={"Le grand méchant vilan"}
        >
          <Image source={require("./flag.png")} style={{width:100,height:140}} />
        </Marker>
        <Marker
          tappable={false}
          coordinate={{
            latitude: currentPosition.latitude - 0.001,
            longitude: currentPosition.longitude - 0.001,
          }}
        />
        <Marker
          tappable={false}
          coordinate={{
            latitude: currentPosition.latitude - 0.001,
            longitude: currentPosition.longitude + 0.001,
          }}
        />
      </MapView>
    </View>
  ) : null;
}
