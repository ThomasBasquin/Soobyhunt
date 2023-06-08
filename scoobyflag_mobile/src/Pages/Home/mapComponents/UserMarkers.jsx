import React, { memo } from "react";
import {Marker as MarkerComponent} from 'react-native-maps';
import {Image, View} from 'react-native';

const UserMarker=  memo(function UserMarker({user, team}){

  console.log(user.id,  team.id, user.team.id);

  return (
        <MarkerComponent
          tappable={false}
          zIndex={2}
          pinColor={'navy'}
          title={user.pseudo}
          coordinate={{latitude:user.latitude,longitude:user.longitude}} >
            <View style={{width:15,height:15,borderRadius:50, backgroundColor:team.id == user.team.id ? "#181fde" : "#ff0000", borderColor:"#FFFFFF",borderWidth:1}} />
          </MarkerComponent>

    )
});

export default UserMarker;