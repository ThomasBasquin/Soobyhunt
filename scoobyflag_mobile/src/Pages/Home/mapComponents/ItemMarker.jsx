import React, { memo, useRef } from "react";
import {Marker as MarkerComponent} from 'react-native-maps';
import {Image, Text} from 'react-native';
import { findPiture } from "../../../Constantes/utils";

const ItemMarker = memo(function ItemMarker({item, openModal}){
    
    const picture= useRef(findPiture("loupe"));

    return (
        <MarkerComponent
          onPress={() => openModal(item)}
          tappable={false}
          zIndex={500}
          coordinate={{latitude:parseFloat(item.latitude),longitude:parseFloat(item.longitude)}}>
            <Image source={picture.current} style={{width: 50, height: 70}} />
        </MarkerComponent>

    )
})

export default ItemMarker;