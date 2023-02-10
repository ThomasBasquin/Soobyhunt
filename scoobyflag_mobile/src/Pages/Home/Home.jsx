import Geolocation from '@react-native-community/geolocation';
import {useState, useEffect, useCallback} from 'react';
import {Image, View, Text} from 'react-native';
import MapView, {
  Circle,
  Marker,
  Polygon,
  PROVIDER_DEFAULT,
  UrlTile,
} from 'react-native-maps';
import COLORS from '../../Constantes/colors';
import GAME_CONFIG from '../../Constantes/gameConfig';
import {pointInCircle} from '../../Constantes/utils';

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
  const [isNearAObject, setIsNearAObject] = useState(false);

  useEffect(() => {
    if (!markers.length) return;
    const nearMarker = markers.filter(marker =>
      pointInCircle(currentPosition.latitude, currentPosition.longitude, {
        circleLat: marker.coordinates.latitude,
        circleLng: marker.coordinates.longitude,
        circleRadius: GAME_CONFIG.visibilityRange.flag / 1000,
      }),
    );

    if (nearMarker.length) {
      setIsNearAObject(true);
    } else {
      setIsNearAObject(true);
    }
  }, [currentPosition]);

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
              latitude: pos.coords.latitude + 0.00001,
              longitude: pos.coords.longitude + 0.00001,
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
    return markers
      .filter(marker =>
        pointInCircle(currentPosition.latitude, currentPosition.longitude, {
          circleLat: marker.coordinates.latitude,
          circleLng: marker.coordinates.longitude,
          circleRadius: GAME_CONFIG.visibilityRange.flag / 1000,
        }),
      )
      .map((marker, i) => (
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
          <Image
            source={require('./flag.png')}
            style={{width: 50, height: 70}}
          />
        </Marker>
      ));
  }, [markers, currentPosition]);

  const visibilityZone = useCallback(() => {
    return (
      <Circle
        center={currentPosition}
        radius={GAME_CONFIG.visibilityRange.user}
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
      <View
        style={{
          width: '95%',
          height: 100,
          position: 'absolute',
          backgroundColor: 'rgba(252, 252, 214,.9)',
          zIndex: 1,
          margin: '2.5%',
          borderRadius: 15,
          bottom: 0,
          borderWidth: 2,
          borderColor: COLORS.primary,
        }}
      />
      {isNearAObject ? (
        <View
          style={{
            width: '95%',
            height: 75,
            position: 'absolute',
            backgroundColor: 'rgba(252, 252, 214,.9)',
            zIndex: 1,
            margin: '2.5%',
            borderRadius: 15,
            top: 0,
            borderWidth: 2,
            padding:"5%",
            justifyContent:"center",
            alignItems:"center",
            borderColor: COLORS.primary,
          }}
        >
          <Text style={{fontSize:20}}>Un object est près de vous !</Text>
        </View>
      ) : null}
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
        showsCompass={false}>
        <UrlTile
          urlTemplate={'https://b.tile.openstreetmap.de/{z}/{x}/{y}.png'}
          maximumZ={19}
          shouldReplaceMapContent={true}
        />
        <Polygon
          zIndex={1}
          strokeWidth={3}
          geodesic={true}
          strokeColor={'rgba(255, 77, 77,.9)'}
          fillColor={'rgba(154, 229, 154,0)'}
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
