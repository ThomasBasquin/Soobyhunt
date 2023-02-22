import AsyncStorage from "@react-native-async-storage/async-storage";


export async function getEffects(){
    return await AsyncStorage.getItem("effects")
    .then(e => e ? JSON.parse(e) : [])
}


export async function setEffect(effect){
    return await AsyncStorage.getItem("effects")
    .then(e => e ? JSON.parse(e) : [])
    .then(effects => [...effects,effect])
    .then(effects => AsyncStorage.setItem("effects",JSON.stringify(effects)));
}

export async function removeEffect(id){

    return await AsyncStorage.getItem("effects")
    .then(e => e ? JSON.parse(e) : [])
    .then(effects => effects.filter(e => e.id !== id))
    .then(effects => AsyncStorage.setItem("effects",JSON.stringify(effects)));
}

export async function modifyEffect(effect){

    return await AsyncStorage.getItem("effects")
    .then(e => e ? JSON.parse(e) : [])
    .then(effects => effects.map(e => e.id == effect.id ? effect : e))
    .then(effects => AsyncStorage.setItem("effects",JSON.stringify(effects)));
}