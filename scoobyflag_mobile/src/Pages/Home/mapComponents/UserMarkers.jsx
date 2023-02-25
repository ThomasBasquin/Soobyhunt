import React from "react";
import {Marker as MarkerComponent} from 'react-native-maps';
import {Image, View} from 'react-native';

function UserMarker({user}){
    return (
        <MarkerComponent
          tappable={false}
          zIndex={2}
          pinColor={'navy'}
          title={user.name}
          coordinate={user.coordinates} >
            <View style={{width:15,height:15,borderRadius:50, backgroundColor:"#181fde", borderColor:"#FFFFFF",borderWidth:1}} />
          </MarkerComponent>

    )
}

export default UserMarker;