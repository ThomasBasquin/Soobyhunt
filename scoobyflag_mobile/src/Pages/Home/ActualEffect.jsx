import { ScrollView, Text, View } from "react-native";
import {useEffect} from "react";
import ActualEffectItem from "./ActualEffectItem";
import { decrement } from "../../Constantes/effectUtils";


export default function ActualEffect({actualEffects, refreshActualEffect}){

    useEffect(()=>{
        const removeInterval=setInterval(()=>{
            decrement();
        },1000);

        return () => clearInterval(removeInterval);
    },[]);

    return (
        <ScrollView horizontal={true} style={{position:"absolute",paddingHorizontal:"5%", bottom:125,zIndex:2,flexDirection:"row"}}>
            {actualEffects.map((effect,index) => (
                <ActualEffectItem effect={effect} index={index} refreshActualEffect={refreshActualEffect} />
            ))}
        </ScrollView>
    )
}