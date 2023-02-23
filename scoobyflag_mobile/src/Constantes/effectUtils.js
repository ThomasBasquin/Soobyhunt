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

export async function setEffect(type, startAt,endAt) {
  try {
    let jsonValue = await AsyncStorage.getItem('effects');
    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : null;
    if(!jsonValue)return null;
    const id=jsonValue.length ?  jsonValue[jsonValue.length -1].id+1 : 0;
    jsonValue = [...jsonValue,{id, type,startAt,endAt}];
    AsyncStorage.setItem('effects', JSON.stringify(jsonValue));
    return {id, type,startAt, endAt};
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

export async function reset() {
    try {
      await AsyncStorage.setItem('effects',JSON.stringify([]));
    } catch (e) {
      console.error('error in asyncStorage');
    }
  }