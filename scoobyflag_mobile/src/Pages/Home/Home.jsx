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
import {
  findInfoItem,
  pointInCircle,
  pointInPolygon,
} from '../../Constantes/utils';
import ActualEffect from './ActualEffect';
import ItemLayout from './ItemLayout';
import NotifInApp from './NotifInApp';
import GameMapPolygon from './mapComponents/GameMapPolygon';
import Circle from './mapComponents/Circle';
import VilainModal from './VilainModal';
import VilainMarker from './mapComponents/VilainMarker';
import UserMarker from './mapComponents/UserMarkers';
import ItemMarker from './mapComponents/ItemMarker';
import ItemModal from './ItemModal';
import useVilain from '../../Constantes/Hooks/useVilain';
import useItem from '../../Constantes/Hooks/useItem';
import usePlayer from '../../Constantes/Hooks/usePlayer';
import UnauthorizedMapPolygon from './mapComponents/UnauthorizedMapPolygon';
import {MAP_COORDINATE, USER_MARKERS} from '../../Constantes/mocked';
import EventSource, {EventSourceListener} from 'react-native-sse';
import URLS from '../../Constantes/URLS';

export default function Home({route, navigation}) {
  const [currentPosition, setCurrentPosition] = useState({
    latitude: null,
    longitude: null,
  }); //MERCURE SEND
  const [region, setRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [mapCoordinates, setMapCoordinates] = useState();
  const [unauthorizedZone, setUnauthorizedZone] = useState([]);
  const [vilainMarkers, setVilainMarkers] = useVilain(); //MERCURE SEND AND RETRIEVE
  const [itemMarkers, setItemMarkers] = useItem([]); //MERCURE SEND AND RETRIEVE
  const [userMarkers, setUserMarkers] = useState([]); //USER_MARKERS //MERCURE RETRIEVE
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
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {

    if(!currentUser)return;
    const topic = encodeURIComponent('https://scoobyflag/user/'+currentUser.id);
    
    const eventSource = new EventSource(
      'http://hugoslr.fr:16640/.well-known/mercure'.concat('?topic=', topic)
    );

    eventSource.addEventListener('open', event => {
      // console.debug("Open SSE connection.");
    });

    eventSource.addEventListener('message', event => {
      const user=JSON.parse(JSON.parse(event.data));

      const alreadyInParty=userMarkers.find(u => {console.log(u); return u.id==user.id});
      setUserMarkers(cur => alreadyInParty ? cur.map(u => u.id==user.id ? user : u) : [...cur,user]);
    });
    
    eventSource.addEventListener('error', event => {
      if (event.type === 'error') {
        console.error('Connection error:', event.message);
      } else if (event.type === 'exception') {
        console.error('Error:', event.message, event.error);
      }
    });

    eventSource.addEventListener('close', event => {
      // console.debug("Close SSE connection.");
    });

    return () => {
      eventSource.removeAllEventListeners();
      eventSource.close();
    };
  }, [currentUser]);

  useEffect(() => {
    if (!route.params.gameConfiguration) {
      Alert.alert('Une configuration est requise');
      navigation.navigate('Team');
      return;
    }
    fetch(URLS.joinGame,{
      method:"POST",
      headers:{
        "Content-type" : "Application/json"
      },
      body:JSON.stringify({pseudo:"coiquoubé"})
    })
    .then(res => res.json())
    .then(user => {
      setCurrentUser(user);
    })
    
    refreshActualEffect();
    // reset();
    const config = route.params.gameConfiguration;
    setMapCoordinates(
      config.json.authorizedZone.map(zone => ({
        latitude: zone.latitude,
        longitude: zone.longitude,
      })),
    );
    // setUnauthorizedZone(
    //   config.json.unauthorizedZone.map(unauthorizedZone =>
    //     unauthorizedZone.map(zone => ({
    //       latitude: zone.lat,
    //       longitude: zone.lng,
    //     })),
    //   ),
    // );
    setVilainMarkers(
      config.json.mechants.map(mechant => ({
        ...mechant,
        coordonnees: {latitude: mechant.latitude, longitude: mechant.longitude},
      })),
    );
    setItemMarkers(
      config.json.items.map(zone => ({
        ...zone,
        quantite: 5,
        coordonnees: {latitude: zone.latitude, longitude: zone.longitude},
      })),
    );
    getCurrentPosition(true);

  }, []);

  function setEffect(item) {
    if (item.quantite > 1) {
      setItemsUser(
        itemsUser.map(i =>
          i.name == item.name ? {...i, quantite: i.quantite - 1} : i,
        ),
      );
    } else {
      setItemsUser(itemsUser.filter(i => i.name !== item.name));
    }
    const time = findInfoItem(item.name).time;
    const now = DateTime.now();
    setEffectStorage(item.name, now, now.plus({seconds: time})).then(e =>
      setActualEffects(cur => [...cur, e]),
    );
  }

  function refreshActualEffect() {
    getEffects().then(effects => setActualEffects(effects));
  }

  function updateUserLocation(e) {
    fetch(URLS.putPosition.replace("{userId}",currentUser.id),{
      method:"PUT",
      headers:{
        "Content-type" : "Application/json"
      },
      body:JSON.stringify({latitude: e.coordinate.latitude, longitude: e.coordinate.longitude})
    });


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
    const nearItem = itemMarkers
      .filter(marker => {
        return pointInCircle(
          marker.coordonnees.latitude,
          marker.coordonnees.longitude,
          {
            circleLat: e.coordinate.latitude,
            circleLng: e.coordinate.longitude,
            circleRadius: GAME_CONFIG.visibilityRange.nearRangeItem / 1000,
          },
        );
      })
      .filter(marker => marker.quantite);
    const outOfMap = pointInPolygon(e.coordinate, mapCoordinates);

    if (!outOfMap) {
      setNotifInApp(NOTIF_IN_MAP.outOfMap);
    } else {
      if ([...nearVilain, ...nearItem].length) {
        setNotifInApp(NOTIF_IN_MAP.nearAObject);
      } else {
        setNotifInApp(null);
      }
    }
  }

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
  }, [userMarkers]);

  const renderVilainMarkers = useCallback(() => {
    return vilainMarkers
      .filter(marker =>
        pointInCircle(currentPosition.latitude, currentPosition.longitude, {
          circleLat: marker.coordonnees.latitude,
          circleLng: marker.coordonnees.longitude,
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
      .filter(marker => {
        return pointInCircle(
          currentPosition.latitude,
          currentPosition.longitude,
          {
            circleLat: marker.coordonnees.latitude,
            circleLng: marker.coordonnees.longitude,
            circleRadius:
              GAME_CONFIG.visibilityRange.visibilityRangeItem / 1000,
          },
        );
      })
      .filter(marker => marker.quantite > 0)
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
    return <GameMapPolygon mapCoordinates={mapCoordinates} />;
  }, [mapCoordinates]);

  const renderUnauthorizedZone = useCallback(() => {
    return unauthorizedZone.map((coordonates, i) => (
      <UnauthorizedMapPolygon key={i} mapCoordinates={coordonates} />
    ));
  }, [unauthorizedZone]);

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
          onSubmit={vilain =>
            setVilainMarkers(
              vilainMarkers.map(v =>
                v.id == vilain.id ? {...v, team: 'MOUGOU'} : v,
              ),
            )
          } //TODO : Récupérer l'équipe du joueur
          onRequestClose={() =>
            setStateVilainModal({...stateVilainModal, isOpen: false})
          }
        />
      ) : null}
      {stateItemModal.isOpen ? (
        <ItemModal
          onSubmit={() => {
            setItemMarkers(
              itemMarkers.map(i =>
                i.id == stateItemModal.item.id
                  ? {...i, quantite: i.quantite - 1}
                  : i,
              ),
            );
            const indexItemUser = itemsUser.findIndex(
              i => i.name == stateItemModal.item.name,
            );
            if (indexItemUser !== -1) {
              setItemsUser(
                itemsUser.map((i, index) =>
                  index == indexItemUser ? {...i, quantite: i.quantite + 1} : i,
                ),
              );
            } else {
              setItemsUser([
                ...itemsUser,
                {...stateItemModal.item, quantite: 1},
              ]);
            }
          }}
          state={stateItemModal}
          onRequestClose={() =>
            setStateItemModal({...stateItemModal, isOpen: false})
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
        {renderUnauthorizedZone()}
        {gameZone()}
        {/* {visibilityZone()} */}
        {renderItemMarkers()}
        {renderVilainMarkers()}
        {renderUserMarkers()}
      </MapView>
    </View>
  ) : null;
}
