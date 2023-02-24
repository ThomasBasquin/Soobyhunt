import React from "react";
import {Polygon as PolygonComponent} from 'react-native-maps';

function Polygon({mapCoordinates}){

    return (
        <PolygonComponent
        zIndex={1}
        strokeWidth={3}
        geodesic={true}
        strokeColor={'rgba(255, 77, 77,.9)'}
        fillColor={'rgba(154, 229, 154,0)'}
        coordinates={mapCoordinates}
      />
    )
}

export default Polygon;