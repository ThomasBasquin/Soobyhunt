import Geolocation from '@react-native-community/geolocation';
import {useState, useEffect, useCallback} from 'react';
import {View} from 'react-native';
import {DateTime} from 'luxon';
import MapView, {PROVIDER_DEFAULT, UrlTile} from 'react-native-maps';
import {
  getEffects,
  reset,
  setEffect as setEffectStorage,
} from '../../Constantes/effectUtils';
import GAME_CONFIG from '../../Constantes/gameConfig';
import {NOTIF_IN_MAP} from '../../Constantes/notif';
import {pointInCircle, pointInPolygon} from '../../Constantes/utils';
import ActualEffect from './ActualEffect';
import ItemLayout from './ItemLayout';
import NotifInApp from './NotifInApp';
import {ITEMS, MAP_COORDINATE, MARKERS} from '../../Constantes/mocked';
import Marker from './mapComponents/Marker';
import Polygon from './mapComponents/Polygon';
import Circle from './mapComponents/Circle';

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
  const [mapCoordinates, setMapCoordinates] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [notifInApp, setNotifInApp] = useState(false);
  const [isMountedMap, setIsMountedMap] = useState(null);
  const [items, setItems] = useState(ITEMS);
  const [actualEffects, setActualEffects] = useState(null);

  useEffect(() => {
    refreshActualEffect();
    // reset();
    setMapCoordinates(MAP_COORDINATE);
    getCurrentPosition(true);
  }, []);

  console.log('jaime les q');

  function setEffect(type, time) {
    const now = DateTime.now();
    setEffectStorage(type, now, now.plus({seconds: time})).then(e =>
      setActualEffects(cur => [...cur, e]),
    );
  }

  function refreshActualEffect() {
    getEffects().then(effects => setActualEffects(effects));
  }

  function updateUserLocation(e) {
    setCurrentPosition({
      latitude: e.coordinate.latitude,
      longitude: e.coordinate.longitude,
    });
    if (!markers.length || !mapCoordinates.length) return;
    const nearMarker = markers.filter(marker =>
      pointInCircle(e.latitude, e.longitude, {
        circleLat: marker.coordinates.latitude,
        circleLng: marker.coordinates.longitude,
        circleRadius: GAME_CONFIG.visibilityRange.flag / 1000,
      }),
    );
    const outOfMap = pointInPolygon(e, mapCoordinates);

    if (!outOfMap) {
      setNotifInApp(NOTIF_IN_MAP.outOfMap);
    } else {
      if (nearMarker.length) {
        setNotifInApp(NOTIF_IN_MAP.nearAObject);
      } else {
        setNotifInApp(null);
      }
    }
  }

  useEffect(() => {}, [currentPosition]);

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
        setMarkers(MARKERS(pos));
      },
      error => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
      {enableHighAccuracy: true},
    );
  }

  const renderMarkers = useCallback(() => {
    return markers
      .filter(marker =>
        pointInCircle(
          marker.coordinates.latitude,
          marker.coordinates.longitude,
          {
            circleLat: currentPosition.latitude,
            circleLng: currentPosition.longitude,
            circleRadius: GAME_CONFIG.visibilityRange.user / 1000,
          },
        ),
      )
      .map((marker, i) => <Marker marker={marker} key={i} />);
  }, [markers, currentPosition]);

  const visibilityZone = useCallback(() => {
    return <Circle currentPosition={currentPosition} />;
  }, [currentPosition]);

  const gameZone = useCallback(() => {
    return <Polygon mapCoordinates={mapCoordinates} />;
  }, [mapCoordinates]);

  const EffectComponent = useCallback(
    () =>
      actualEffects?.length ? (
        <ActualEffect
          actualEffects={actualEffects}
          setActualEffects={setActualEffects}
        />
      ) : null,
    [actualEffects],
  );

  const ItemComponent = useCallback(
    () => (
      <ItemLayout
        isMountedMap={isMountedMap}
        items={items}
        setEffect={setEffect}
      />
    ),
    [isMountedMap, items],
  );

  const notifComponent = useCallback(
    () => <NotifInApp isMountedMap={isMountedMap} notifInApp={notifInApp} />,
    [isMountedMap, notifInApp],
  );

  return region.longitude &&
    region.latitude &&
    markers.length &&
    mapCoordinates.length ? (
    <View>
      {EffectComponent()}
      {ItemComponent()}
      {notifComponent()}
      <MapView
        onMapReady={() => setIsMountedMap(true)}
        showsUserLocation={true}
        provider={PROVIDER_DEFAULT}
        style={{width: '100%', height: '100%'}}
        userLocationUpdateInterval={GAME_CONFIG.map.refreshUserLocation}
        userLocationFastestInterval={GAME_CONFIG.map.refreshUserLocation}
        mapType={'none'}
        minZoomLevel={GAME_CONFIG.map.minZoom}
        maxZoomLevel={GAME_CONFIG.map.maxZoom}
        pitchEnabled={false}
        followsUserLocation={true}
        onUserLocationChange={({nativeEvent: e}) => updateUserLocation(e)}
        initialRegion={region}
        showsCompass={false}>
        <UrlTile
          urlTemplate={'https://b.tile.openstreetmap.de/{z}/{x}/{y}.png'}
          maximumZ={19}
          shouldReplaceMapContent={true}
        />
        {gameZone()}
        {visibilityZone()}
        {renderMarkers()}
      </MapView>
    </View>
  ) : null;
}
