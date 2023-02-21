import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getEffects() {
  try {
    let jsonValue = await AsyncStorage.getItem('effects');
    if(!jsonValue)AsyncStorage.setItem('effects',JSON.stringify([]));
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('error in asyncStorage');
  }
}

export async function getEffect(id) {
  try {
    let jsonValue = await AsyncStorage.getItem('effects');
    return jsonValue != null ? JSON.parse(jsonValue).find(e => e.id == id) : null;
  } catch (e) {
    console.error('error in asyncStorage');
  }
}

export async function setEffect(type, time) {
  try {
    let jsonValue = await AsyncStorage.getItem('effects');
    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : null;
    if(!jsonValue)return null;
    const id=jsonValue.length ?  jsonValue[jsonValue.length -1].id+1 : 0;
    jsonValue = [...jsonValue,{id, type,time}];
    AsyncStorage.setItem('effects', JSON.stringify(jsonValue));
    return {id, type,time};
  } catch (e) {
    console.error('error in asyncStorage');
  }
}

export async function removeEffect(id) {
  try {
    let jsonValue = await AsyncStorage.getItem('effects');
    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : null;
    if (jsonValue) {
        jsonValue = jsonValue.filter(e => e.id !== id);
        AsyncStorage.setItem('effects', JSON.stringify(jsonValue));
    }
  } catch (e) {
    console.error('error in asyncStorage');
  }
}


export async function decrement(effect) {
  try {
    let jsonValue = await AsyncStorage.getItem('effects');
    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : null;
    if(!jsonValue)return;
    jsonValue=jsonValue.map(e => e.time>=0 ?{...e,time:e.time-1} : e);
    AsyncStorage.setItem('effects', JSON.stringify(jsonValue));
  } catch (e) {
    console.error('error in asyncStorage');
  }
}

export async function reset() {
    try {
      await AsyncStorage.setItem('effects',JSON.stringify([]));
    } catch (e) {
      console.error('error in asyncStorage');
    }
  }