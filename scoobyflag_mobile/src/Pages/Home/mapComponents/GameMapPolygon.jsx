import React, { memo } from "react";
import {Polygon as PolygonComponent} from 'react-native-maps';

const GameMapPolygon= memo(function GameMapPolygon({mapCoordinates}){

    return (
        <PolygonComponent
        zIndex={1}
        strokeWidth={3}
        geodesic={true}
        strokeColor={'rgba(26, 156, 22,.9)'}
        fillColor={'rgba(154, 229, 154,0)'}
        coordinates={mapCoordinates}
      />
    )
});

export default GameMapPolygon;