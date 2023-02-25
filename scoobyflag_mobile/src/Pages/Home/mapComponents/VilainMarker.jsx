import React from "react";
import {Marker as MarkerComponent} from 'react-native-maps';
import {Image} from 'react-native';

function VilainMarker({vilain, openModal}){

    return (
        <MarkerComponent
        onPress={() => openModal(vilain)}
          tappable={false}
          zIndex={2}
          coordinate={vilain.coordinates}>
          <Image
            source={require('./../../../Assets/maps/VILAIN.png')}
            style={{width: 50, height: 70}}
          />
        </MarkerComponent>

    )
}

export default VilainMarker;