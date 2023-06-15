import {Text, View} from 'react-native';
import BasicModal from '../../Components/BasicModal';
import { findInfoItem } from '../../Constantes/utils';

export default function ItemModal({onSubmit,state, onRequestClose}) {

  return (
    <>
      <BasicModal
        visible={state.isOpen}
        onRequestClose={onRequestClose}
        title={findInfoItem(state.item.name).slug}
        onSubmit={onSubmit}>
        <Text style={{marginVertical: 10, fontSize: 20, color:"#000"}}>
          Voulez-vous prendre l'objet {state.item.type} ?
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 16, color:"#000"}}>{`Objet restant : `}</Text>
          <Text style={{fontWeight: '700', fontSize: 16, color:"#000"}}>
            {state.item.quantity ? state.item.quantity : 'aucune'}
          </Text>
        </View>
      </BasicModal>
    </>
  );
}
