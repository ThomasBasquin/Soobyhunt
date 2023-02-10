import { View } from "react-native";
import COLORS from "../../Constantes/colors";


export default function ItemLayout({isMountedMap}){
    return isMountedMap ?
        <View
        style={{
          width: '95%',
          height: 100,
          position: 'absolute',
          backgroundColor: 'rgba(252, 252, 214,.9)',
          zIndex: 1,
          margin: '2.5%',
          borderRadius: 15,
          bottom: 0,
          borderWidth: 2,
          borderColor: COLORS.primary,
        }}
      /> : null;
}