import React, { memo } from "react";
import {Marker as MarkerComponent} from 'react-native-maps';
import {Image, View} from 'react-native';

const UserMarker=  memo(function UserMarker({user}){
  return (
        <MarkerComponent
          tappable={false}
          zIndex={2}
          pinColor={'navy'}
          title={"erfgthnj,"}
          coordinate={{latitude:user.latitude,longitude:user.longitude}} >
            <View style={{width:15,height:15,borderRadius:50, backgroundColor:"#181fde", borderColor:"#FFFFFF",borderWidth:1}} />
          </MarkerComponent>

    )
});

export default UserMarker;