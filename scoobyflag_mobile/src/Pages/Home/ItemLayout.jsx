import {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import BasicModal from '../../Components/BasicModal';
import COLORS from '../../Constantes/colors';

export default function ItemLayout({isMountedMap, items, setEffect}) {
  const [itemModal, setItemModal] = useState({open: false, item: null});

  return isMountedMap ? (
    <>
      {itemModal.open ? (
        <BasicModal
          visible={itemModal.open}
          title={'Utiliser un objet'}
          onRequestClose={() => setItemModal({...itemModal, open: false})}
          onSubmit={() => setEffect(itemModal.item.type, itemModal.item.time)}>
          <Text style={{fontSize: 17, color: COLORS.black}}>
            Voulez-vous vraiment utiliser le {itemModal.item.type} ?
          </Text>
        </BasicModal>
      ):null}
      
      <View
        style={{
          width: '95%',
          height: 100,
          position: 'absolute',
          backgroundColor: 'rgba(252, 252, 214,.9)',
          zIndex: 1,
          margin: "2.5%",
          marginVertical: 20,
          borderRadius: 15,
          bottom: 0,
          borderWidth: 2,
          padding: '1%',
          borderColor: COLORS.primary,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            color: COLORS.primary,
          }}>{`Mon sac à dos (${items.length}/2) :`}</Text>
        <View style={{flexDirection: 'row'}}>
          {items.map((item, i) => {
            //TODO : changer l'image en fonction du type
            return (
              <TouchableOpacity
                key={i}
                style={{flexDirection: 'row'}}
                onPress={() => setItemModal({open: true, item})}>
                <Image
                  source={require('./../../Assets/items/SAC_A_DOS.png')}
                  style={{width: 50, height: 50}}
                />
                <Text
                  style={{
                    fontWeight: '900',
                    position: 'relative',
                    right: 10,
                  }}>{`x${item.qte}`}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </>
  ) : null;
}
