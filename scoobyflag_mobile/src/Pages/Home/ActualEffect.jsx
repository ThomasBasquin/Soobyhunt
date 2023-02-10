import { Text, View } from "react-native";
import COLORS from "../../Constantes/colors";


export default function ActualEffect({ActualEffect,setActualEffect}){

    return (
        <View style={{position:"absolute",width:"90%",marginHorizontal:"5%", bottom:125,zIndex:2,flexDirection:"row"}}>
            {ActualEffect.map((effect,i) => (
                <View key={i} style={{backgroundColor:COLORS.primary,borderRadius:15,marginHorizontal:5,padding:5,flexDirection:"row",justifyContent:"center"}}>
                    <Text style={{color: COLORS.white}}>{effect.type}</Text>
                    <Text style={{color: COLORS.white}}>{effect.time}</Text>
                </View>
            ))}
        </View>
    )
}