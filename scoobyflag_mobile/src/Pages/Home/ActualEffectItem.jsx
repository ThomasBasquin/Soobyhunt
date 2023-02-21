import {Text, View} from 'react-native';
import {useState, useEffect} from 'react';
import COLORS from '../../Constantes/colors';
import {getEffect, removeEffect} from '../../Constantes/effectUtils';

export default function ActualEffectItem({effect, index, refreshActualEffect}) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const removeInterval = setInterval(() => {
      getEffect(effect.id).then(e => {
        if (e?.time >= 0) {
          setTime(e.time);
        } else {
          removeEffect(e.id).then(refreshActualEffect);
        }
      });
    }, 1000);

    return () => clearInterval(removeInterval);
  }, [effect]);

  return time ? (
    <View
      key={index}
      style={{
        backgroundColor: COLORS.primary,
        borderRadius: 15,
        marginHorizontal: 5,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: COLORS.white,
          paddingHorizontal: 2,
        }}>{`${effect.type} :`}</Text>
      <Text style={{color: COLORS.white, paddingHorizontal: 2}}>{time}</Text>
    </View>
  ) : null;
}
