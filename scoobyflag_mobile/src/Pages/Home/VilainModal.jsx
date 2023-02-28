import {Text, View} from 'react-native';
import BasicModal from '../../Components/BasicModal';

export default function VilainModal({state, onRequestClose}) {
  return (
    <>
      <BasicModal
        visible={state.isOpen}
        onRequestClose={onRequestClose}
        title={"Capturer un vilain"}
        onSubmit={() => console.log('submit')}>
        <Text style={{marginVertical: 10, fontSize: 20}}>
          Voulez-vous capturé Willy ?
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 16}}>{`Equipe actuelle : `}</Text>
          <Text style={{fontWeight: '700', fontSize: 16}}>
            {state.vilain.equip ? state.vilain.equip : 'aucune'}
          </Text>
        </View>
      </BasicModal>
    </>
  );
}
