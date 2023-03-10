import React from 'react';
import {Polygon as PolygonComponent} from 'react-native-maps';

function UnauthorizedMapPolygon({mapCoordinates}) {
  console.log(mapCoordinates);
  return (
    <PolygonComponent
      zIndex={3}
      strokeWidth={3}
      geodesic={true}
      strokeColor={'rgba(26, 156, 22,.9)'}
      fillColor={'rgba(154, 229, 154,0)'}
      coordinates={mapCoordinates}
    />
  );
}

export default UnauthorizedMapPolygon;
