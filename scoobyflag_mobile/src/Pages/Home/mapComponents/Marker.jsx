import React from "react";
import {Marker as MarkerComponent} from 'react-native-maps';
import {Image} from 'react-native';

function Marker({marker, openModal}){

    return (
        <MarkerComponent
        onPress={() => openModal(marker)}
          tappable={false}
          zIndex={2}
          coordinate={marker.coordinates}>
          <Image
            source={require('./../../../Assets/maps/VILAIN.png')}
            style={{width: 50, height: 70}}
          />
        </MarkerComponent>

    )
}

export default Marker;