import React, { memo } from 'react';
import {Polygon as PolygonComponent} from 'react-native-maps';

const UnauthorizedMapPolygon = memo(function UnauthorizedMapPolygon({mapCoordinates}) {
  return (
    <PolygonComponent
      zIndex={3}
      strokeWidth={3}
      geodesic={true}
      strokeColor={'rgba(255, 0, 0, .9)'}
      fillColor={'rgba(255, 153, 153,.7)'}
      coordinates={mapCoordinates}
    />
  );
})

export default UnauthorizedMapPolygon;
