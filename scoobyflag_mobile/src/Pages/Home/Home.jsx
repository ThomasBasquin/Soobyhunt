import Geolocation from '@react-native-community/geolocation';
import {useState, useEffect, useCallback} from 'react';
import {View, Alert, Text, Pressable} from 'react-native';
import {DateTime} from 'luxon';
import Map from './Map';
import {
  getEffects,
  reset,
  setEffect as setEffectStorage,
} from '../../Constantes/effectUtils';
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
import UnauthorizedMapPolygon from './mapComponents/UnauthorizedMapPolygon';
import EventSource from 'react-native-sse';
import useUrl from '../../Constantes/Hooks/useUrl';
import useServer from '../../Constantes/Hooks/useServer';
import COLORS from '../../Constantes/colors';

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
  const {GAME} = useUrl();
  const [stateItemModal, setStateItemModal] = useState({
    isOpen: false,
    item: null,
  });
  const [{idUser, map, team, mercureServer},setServer] = useServer();

  useEffect(() => {
    if (!idUser) return;
    const topic = encodeURIComponent('https://scoobyflag/user/' + idUser);

    const eventSource = new EventSource(
      mercureServer+'/.well-known/mercure'.concat('?topic=', topic),
    );

    eventSource.addEventListener('open', event => {
      // console.debug("Open SSE connection.");
    });

    eventSource.addEventListener('message', event => {
      const user = JSON.parse(JSON.parse(event.data));

      const alreadyInParty = userMarkers.find(u => {
        return u.id == user.id;
      });
      setUserMarkers(cur =>
        alreadyInParty
          ? cur.map(u => (u.id == user.id ? user : u))
          : [...cur, user],
      );
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
  }, [idUser]);

  useEffect(() => {
    if (currentPosition) return;
    const outOfMap = pointInPolygon(currentPosition.coordinate, mapCoordinates);
    let inUnauthorizedZone = false;
    unauthorizedZone.forEach(zone => {
      const inZone = pointInPolygon(currentPosition.coordinate, zone);
      if (inZone) {
        inUnauthorizedZone = true;
        return;
      }
    });

    if (inUnauthorizedZone) {
      setNotifInApp(NOTIF_IN_MAP.inUnauthorizedZone);
    } else if (!outOfMap) {
      setNotifInApp(NOTIF_IN_MAP.outOfMap);
    } else {
      if ([...vilainMarkers, ...itemMarkers].length) {
        setNotifInApp(NOTIF_IN_MAP.nearAObject);
      } else {
        setNotifInApp(null);
      }
    }
  }, [vilainMarkers, itemMarkers, currentPosition]);

  // setServer({});

  useEffect(() => {
    if (!map) {
      Alert.alert('Une configuration est requise');
      navigation.navigate('Team');
      return;
    }

    refreshActualEffect();
    // reset();
    setMapCoordinates(map.authorizedZone);
    setUnauthorizedZone(map.unauthorizedZone);
    setVilainMarkers(map.mechants);
    setItemMarkers(map.items);
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
    if (!idUser) return;
    fetch(GAME.putPosition.replace('{userId}', idUser), {
      method: 'PUT',
      headers: {
        'Content-type': 'Application/json',
      },
      body: JSON.stringify({
        latitude: e.coordinate.latitude,
        longitude: e.coordinate.longitude,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setCurrentPosition({
          latitude: e.coordinate.latitude,
          longitude: e.coordinate.longitude,
        });

        setVilainMarkers(data.mechants);
        setItemMarkers(data.items);
        setUserMarkers(data.users);
      });
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
    return userMarkers
      .filter(user => user.id !== idUser)
      .map((user, i) => <UserMarker key={i} user={user} team={team} />);
  }, [userMarkers]);

  const renderVilainMarkers = useCallback(() => {
    return vilainMarkers.map((vilain, i) => (
      <VilainMarker
        vilain={vilain}
        openModal={vilain => setStateVilainModal({isOpen: true, vilain})}
        key={i}
      />
    ));
  }, [vilainMarkers, currentPosition]);

  const renderItemMarkers = useCallback(() => {
    return itemMarkers.map((item, i) => (
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

  const renderBackParty = useCallback(() => (
    <Pressable
      onPress={() => navigation.navigate('Party')}
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 10,
        zIndex: 10,
        borderRadius: 10,
        backgroundColor: COLORS.secondary,
      }}>
      <Text style={{fontWeight: '800'}}>Retour</Text>
    </Pressable>
  ));

  return region.longitude && region.latitude && mapCoordinates.length ? (
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
      {renderBackParty()}
      {EffectComponent()}
      {ItemComponent()}
      {notifComponent()}
      <Map
        region={region}
        onMapReady={() => setIsMountedMap(true)}
        updateUserLocation={updateUserLocation}
        renderUnauthorizedZone={renderUnauthorizedZone}
        gameZone={gameZone}
        renderVilainMarkers={renderVilainMarkers}
        renderItemMarkers={renderItemMarkers}
        renderUserMarkers={renderUserMarkers}
      />
    </View>
  ) : null;
}
