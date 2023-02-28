import Geolocation from '@react-native-community/geolocation';
import {useState, useEffect, useCallback} from 'react';
import {View, Alert} from 'react-native';
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
import Polygon from './mapComponents/Polygon';
import Circle from './mapComponents/Circle';
import VilainModal from './VilainModal';
import VilainMarker from './mapComponents/VilainMarker';
import UserMarker from './mapComponents/UserMarkers';
import ItemMarker from './mapComponents/ItemMarker';

export default function Home({route}) {
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
  const [mapCoordinates, setMapCoordinates] = useState();
  const [vilainMarkers, setVilainMarkers] = useState([]);
  const [itemMarkers, setItemMarkers] = useState([]);
  const [userMarkers, setUserMarkers] = useState([]); //USER_MARKERS
  const [notifInApp, setNotifInApp] = useState(false);
  const [isMountedMap, setIsMountedMap] = useState(null);
  const [itemsUser, setItemsUser] = useState([]);
  const [actualEffects, setActualEffects] = useState(null);
  const [stateVilainModal, setStateVilainModal] = useState({
    isOpen: false,
    vilain: null,
  });
  const [stateItemModal, setStateItemModal] = useState({
    isOpen: false,
    item: null,
  });

  useEffect(() => {
    if (!route.params.gameConfiguration)
      Alert.alert('Une configuration est requise');
    refreshActualEffect();
    // reset();
    const config = route.params.gameConfiguration;
    setMapCoordinates(config.authorizedZone);
    setVilainMarkers(config.mechants.map(m => ({...m, equip: null})));
    setVilainMarkers(config.mechants.map(m => ({...m, equip: null})));
    setItemMarkers(config.items);
    getCurrentPosition(true);
  }, []);

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
    if (!vilainMarkers.length && !itemMarkers.length && !mapCoordinates.length)
      return;
    const nearVilain = vilainMarkers.filter(marker =>
      pointInCircle(marker.latitude, marker.longitude, {
        circleLat: e.coordinate.latitude,
        circleLng: e.coordinate.longitude,
        circleRadius: GAME_CONFIG.visibilityRange.nearRangeFlag / 1000,
      }),
    );
    const nearItem = itemMarkers.filter(marker =>
      pointInCircle(marker.latitude, marker.longitude, {
        circleLat: e.coordinate.latitude,
        circleLng: e.coordinate.longitude,
        circleRadius: GAME_CONFIG.visibilityRange.nearRangeItem / 1000,
      }),
    );
    const outOfMap = pointInPolygon(e.coordinate, mapCoordinates);

    if (!outOfMap) {
      setNotifInApp(NOTIF_IN_MAP.outOfMap);
    } else {
      if ([...nearVilain,...nearItem].length) {
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
      },
      () =>
        Alert.alert(
          "Pour que l'application fonctionne correctement, veuillez activer la localisation",
        ),
      {enableHighAccuracy: true},
    );
  }

  const renderUserMarkers = useCallback(() => {
    return userMarkers.map((user, i) => <UserMarker key={i} user={user} />);
  });

  const renderVilainMarkers = useCallback(() => {
    return vilainMarkers
      .filter(marker =>
        pointInCircle(currentPosition.latitude, currentPosition.longitude, {
          circleLat: marker.latitude,
          circleLng: marker.longitude,
          circleRadius: GAME_CONFIG.visibilityRange.visibilityRangeFlag / 1000,
        }),
      )
      .map((vilain, i) => (
        <VilainMarker
          vilain={vilain}
          openModal={vilain => setStateVilainModal({isOpen: true, vilain})}
          key={i}
        />
      ));
  }, [vilainMarkers, currentPosition]);

  const renderItemMarkers = useCallback(() => {
    return itemMarkers
      .filter(marker =>
        pointInCircle(currentPosition.latitude,currentPosition.longitude, {
          circleLat: marker.latitude,
          circleLng:  marker.longitude,
          circleRadius: GAME_CONFIG.visibilityRange.visibilityRangeItem / 1000,
        }),
      )
      .map((item, i) => (
        <ItemMarker
          item={item}
          openModal={item => setStateItemModal({isOpen: true, item})}
          key={i}
        />
      ));
  }, [itemMarkers, currentPosition]);

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
          setActualEffects={effect =>
            setActualEffects(cur => cur.filter(e => e.id !== effect.id))
          }
        />
      ) : null,
    [actualEffects],
  );

  const ItemComponent = useCallback(
    () => (
      <ItemLayout
        isMountedMap={isMountedMap}
        items={itemsUser}
        setEffect={setEffect}
      />
    ),
    [isMountedMap, itemsUser],
  );

  const notifComponent = useCallback(
    () => <NotifInApp isMountedMap={isMountedMap} notifInApp={notifInApp} />,
    [isMountedMap, notifInApp],
  );

  return region.longitude &&
    region.latitude &&
    vilainMarkers.length &&
    mapCoordinates.length ? (
    <View>
      {stateVilainModal.isOpen ? (
        <VilainModal
          state={stateVilainModal}
          onRequestClose={() =>
            setStateVilainModal({...stateVilainModal, isOpen: false})
          }
        />
      ) : null}
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
        {/* {visibilityZone()} */}
        {renderItemMarkers()}
        {renderVilainMarkers()}
        {renderUserMarkers()}
      </MapView>
    </View>
  ) : null;
}
