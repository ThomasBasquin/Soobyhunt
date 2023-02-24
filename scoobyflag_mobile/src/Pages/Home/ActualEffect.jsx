import {useState} from 'react';
import {ScrollView, Text, View, Image} from 'react-native';
import {DateTime} from 'luxon';
import COLORS from '../../Constantes/colors';
import useInterval from '../../Constantes/Hooks/useInterval';
import { findPiture } from '../../Constantes/utils';

export default function ActualEffect({actualEffects, setActualEffects}) {
  const [now, setNow] = useState(DateTime.now());

  useInterval(() => {
    setNow(DateTime.now());
  }, 1000);

  return (
    <ScrollView
      horizontal={true}
      style={{
        position: 'absolute',
        paddingHorizontal: '5%',
        bottom: 125,
        zIndex: 2,
        flexDirection: 'row',
      }}>
      {actualEffects.map((effect, index) => {
        const endAt = DateTime.fromISO(effect.endAt);
        if (endAt.valueOf() <= now.valueOf()) {
          setActualEffects(cur => cur.filter(e => e.id !== effect.id));
        }
        const timeLeft = endAt.diff(now, ['seconds']).toObject();
        const picture=findPiture(effect.type);
        return (
          <View
            key={index}
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 15,
              borderColor:COLORS.primary,
              borderWidth:2,
              marginHorizontal: 5,
              padding: 5,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems:"center"
            }}>
            <Image source={picture} style={{width: 30, height: 30}} />
            <Text
              style={{
                color: COLORS.black,
                fontWeight:"700",
                paddingHorizontal: 6,
              }}>{`${timeLeft.seconds.toFixed(0)}s`}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
