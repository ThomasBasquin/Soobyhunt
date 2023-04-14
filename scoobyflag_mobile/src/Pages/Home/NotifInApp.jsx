import { useRef, useEffect } from "react";
import { Animated, Easing, Text, View } from "react-native";
import COLORS from "../../Constantes/colors";

export default function NotifInApp({isMountedMap, notifInApp}) {

  const transitionAnim=useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    notifInApp ? showNotif() : hideNotif();
  }, [notifInApp]);

  function showNotif(){
    Animated.timing(transitionAnim, {
      toValue: 50,
      duration: 500,
      easing:Easing.elastic(),
      useNativeDriver: true,
    }).start();
  }

  function hideNotif(){
    Animated.timing(transitionAnim, {
      toValue: -150,
      duration: 500,
      easing:Easing.back(),
      useNativeDriver: true,
    }).start();
  }
    
  return isMountedMap ? (
    <Animated.View
      style={{
        width: '95%',
        position: 'absolute',
        backgroundColor: 'rgba(252, 252, 214,.9)',
        zIndex: 1,
        margin: '2.5%',
        borderRadius: 15,
        transform:[{translateY:transitionAnim}],
        borderWidth: 2,
        padding: '3%',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLORS.primary,
      }}>
      <Text style={{fontSize: 20,alignSelf:"flex-start",fontWeight:"600",color:COLORS.primary}}>{notifInApp!== null ? notifInApp.title : ""}</Text>
      <Text style={{fontSize: 15, color:COLORS.black}}>{notifInApp!== null ? notifInApp.desc : ""}</Text>
    </Animated.View>
  ) : null;
}
