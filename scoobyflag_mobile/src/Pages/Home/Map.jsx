import React, {memo} from"react";
import GAME_CONFIG from "../../Constantes/gameConfig";
import MapView, { PROVIDER_DEFAULT, UrlTile } from "react-native-maps";

const Map = memo(function Map({region, onMapReady, updateUserLocation, renderUnauthorizedZone, gameZone, renderVilainMarkers, renderItemMarkers, renderUserMarkers}){

  return (
    <MapView
    onMapReady={onMapReady}
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
    {renderVilainMarkers()}
    {renderItemMarkers()}
    {renderUserMarkers()}
  </MapView>

  )
});

export default Map;
