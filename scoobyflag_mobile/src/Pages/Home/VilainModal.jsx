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
        <Text style={{marginVertical: 10, fontSize: 20, color:"#000"}}>
          Voulez-vous capturé le vilain ?
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 16, color:"#000"}}>{`Equipe actuelle : `}</Text>
          <Text style={{fontWeight: '700', fontSize: 16, color:"#000"}}>
            {state.vilain.user?.team?.name ? state.vilain.user?.team?.name : 'aucune'}
          </Text>
        </View>
      </BasicModal>
    </>
  );
}
