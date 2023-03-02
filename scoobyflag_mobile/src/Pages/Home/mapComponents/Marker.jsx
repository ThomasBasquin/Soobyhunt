import React from "react";
import {Marker as MarkerComponent} from 'react-native-maps';
import {Image} from 'react-native';

function Marker({marker}){

    return (
        <MarkerComponent
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
            source={require('./../../../Assets/maps/VILAIN.png')}
            style={{width: 50, height: 70}}
          />
        </MarkerComponent>

    )
}

export default Marker;