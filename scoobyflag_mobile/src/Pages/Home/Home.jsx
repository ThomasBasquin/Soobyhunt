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
import { getEffects, removeEffect, reset, setEffect as setEffectStorage } from '../../Constantes/effectUtils';
import GAME_CONFIG from '../../Constantes/gameConfig';
import {NOTIF_IN_MAP} from '../../Constantes/notif';
import {pointInCircle, pointInPolygon} from '../../Constantes/utils';
import ActualEffect from './ActualEffect';
import ItemLayout from './ItemLayout';
import NotifInApp from './NotifInApp';

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
  const [items, setItems] = useState([{id:0,type:"SAC_A_DOS",qte:2,time:15},{id:1,type:"LUNETTE_DE_VERRA",qte:3,time:10}]);
  const [actualEffects, setActualEffects] = useState(null);

  useEffect(() => {
    refreshActualEffect();
    setMapCoordinates([
      {
        latitude: 48.534234,
        longitude: 7.755552,
      },
      {
        latitude: 48.537757,
        longitude: 7.721906,
      },
      {
        latitude: 48.519682,
        longitude: 7.717357,
      },
      {
        latitude: 48.519057,
        longitude: 7.754779,
      }
    ]);
    getCurrentPosition(true);
  }, []);

  function setEffect(type,time){
    setEffectStorage(type, time).then(e => setActualEffects(cur => [...cur,e]))
  }

  function refreshActualEffect(){
    getEffects().then(effects => setActualEffects(effects))
  }

  useEffect(() => {
    if (!markers.length || !mapCoordinates.length) return;
    const nearMarker = markers.filter(marker =>
      pointInCircle(currentPosition.latitude, currentPosition.longitude, {
        circleLat: marker.coordinates.latitude,
        circleLng: marker.coordinates.longitude,
        circleRadius: GAME_CONFIG.visibilityRange.flag / 1000,
      }),
    );
    const outOfMap=pointInPolygon(currentPosition,mapCoordinates);

    if(!outOfMap){
      setNotifInApp(NOTIF_IN_MAP.outOfMap);
    }else{
      if (nearMarker.length) {
        setNotifInApp(NOTIF_IN_MAP.nearAObject);
      } else {
        setNotifInApp(null);
      }
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
            source={require('./../../Assets/maps/VILAIN.png')}
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

  const gameZone = useCallback(() => {
    return (
      <Polygon
      zIndex={1}
      strokeWidth={3}
      geodesic={true}
      strokeColor={'rgba(255, 77, 77,.9)'}
      fillColor={'rgba(154, 229, 154,0)'}
      coordinates={mapCoordinates}
    />
    );
  }, [mapCoordinates]);

  const EffectComponent=useCallback(()=>(
    actualEffects?.length ? <ActualEffect refreshActualEffect={refreshActualEffect} actualEffects={actualEffects} setActualEffect={setActualEffects}/> : null
  ),[actualEffects]);

  const ItemComponent=useCallback(()=>(
    <ItemLayout isMountedMap={isMountedMap} items={items} setEffect={setEffect} />
  ),[isMountedMap,items]);

  const notifComponent=useCallback(()=>(
    <NotifInApp isMountedMap={isMountedMap} notifInApp={notifInApp} />
  ),[isMountedMap,notifInApp]);

  return region.longitude && region.latitude && markers.length && mapCoordinates.length ? (
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
        {gameZone()}
        {visibilityZone()}
        {renderMarkers()}
      </MapView>
    </View>
  ) : null;
}
