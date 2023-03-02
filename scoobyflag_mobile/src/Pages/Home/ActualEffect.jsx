import {useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {DateTime} from 'luxon';
import COLORS from '../../Constantes/colors';
import useInterval from '../../Constantes/Hooks/useInterval';

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
        return (
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
            <Text
              style={{
                color: COLORS.white,
                paddingHorizontal: 2,
              }}>{`${timeLeft.seconds.toFixed(0)}s`}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
