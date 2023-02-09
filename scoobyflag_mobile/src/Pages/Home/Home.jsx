import Geolocation from '@react-native-community/geolocation';
import {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {Image, View} from 'react-native';
import MapView, {
  Circle,
  Marker,
  Polygon,
  PROVIDER_DEFAULT,
  UrlTile,
} from 'react-native-maps';

export default function Home({navigation}) {
  const [currentPosition, setCurrentPosition] = useState({
    latitude: null,
    longitude: null,
  });
  const [region, setRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markers, setMarkers] = useState([]);

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
        setMarkers([
          {
            title: 'Willy',
            equip: 'MOUGOU',
            coordinates: {
              latitude: pos.coords.latitude + 0.001,
              longitude: pos.coords.longitude + 0.001,
            },
          },
          {
            title: 'Billy',
            equip: null,
            coordinates: {
              latitude: pos.coords.latitude + 0.003,
              longitude: pos.coords.longitude - 0.003,
            },
          },
          {
            title: 'Slimane',
            equip: 'Lolo',
            coordinates: {
              latitude: pos.coords.latitude - 0.001,
              longitude: pos.coords.longitude + 0.001,
            },
          },
        ]);
      },
      error => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
      {enableHighAccuracy: true},
    );
  }

  const renderMarkers = useCallback(() => {
    return markers.map((marker, i) => (
      <Marker
        key={i}
        tappable={false}
        zIndex={2}
        coordinate={marker.coordinates}
        description={
          marker.equip
            ? `Le vilan est capturé par l'équipe ${marker.equip}`
            : "Le vilain n'ai pas capturé"
        }
        title={marker.title}>
        <Image source={require('./flag.png')} style={{width: 50, height: 70}} />
      </Marker>
    ));
  }, [markers]);

  const visibilityZone = useCallback(() => {
    return (
      <Circle
        center={currentPosition}
        radius={100}
        strokeColor={'rgba(0, 255, 0,0.9)'}
        fillColor={'rgba(102, 255, 102,.3)'}
        zIndex={2}
      />
    );
  }, [currentPosition]);

  useEffect(() => {
    getCurrentPosition(true);
  }, []);

  return region.longitude && region.latitude && markers.length ? (
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
        onUserLocationChange={({nativeEvent: e}) =>
          setCurrentPosition({
            latitude: e.coordinate.latitude,
            longitude: e.coordinate.longitude,
          })
        }
        initialRegion={region}
        showsCompass={true}>
        <UrlTile
          urlTemplate={'https://b.tile.openstreetmap.de/{z}/{x}/{y}.png'}
          maximumZ={19}
          shouldReplaceMapContent={true}
        />
        <Polygon
          zIndex={1}
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
        {visibilityZone()}
        {renderMarkers()}
      </MapView>
    </View>
  ) : null;
}
