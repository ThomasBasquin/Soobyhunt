import React, { useRef } from "react";
import {Marker as MarkerComponent} from 'react-native-maps';
import {Image} from 'react-native';
import { findPiture } from "../../../Constantes/utils";

function ItemMarker({item, openModal}){
    
    const picture= useRef(findPiture(item.name));

    return (
        <MarkerComponent
        onPress={() => openModal(item)}
          tappable={false}
          zIndex={2}
          coordinate={{latitude:item.latitude,longitude:item.longitude}}>
          <Image
            source={picture.current}
            style={{width: 50, height: 70}}
          />
        </MarkerComponent>

    )
}

export default ItemMarker;