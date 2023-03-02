import {Text, View} from 'react-native';
import BasicModal from '../../Components/BasicModal';

export default function VilainModal({state, onRequestClose, onSubmit}) {
  return (
    <>
      <BasicModal
        visible={state.isOpen}
        onRequestClose={onRequestClose}
        title={"Capturer un vilain"}
        onSubmit={() => onSubmit(state.vilain)}>
        <Text style={{marginVertical: 10, fontSize: 20}}>
          Voulez-vous capturé le vilain ?
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 16}}>{`Equipe actuelle : `}</Text>
          <Text style={{fontWeight: '700', fontSize: 16}}>
            {state.vilain.team ? state.vilain.team : 'aucune'}
          </Text>
        </View>
      </BasicModal>
    </>
  );
}
