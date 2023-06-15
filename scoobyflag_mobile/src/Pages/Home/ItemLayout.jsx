import {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import BasicModal from '../../Components/BasicModal';
import COLORS from '../../Constantes/colors';
import GAME_CONFIG from '../../Constantes/gameConfig';
import { findPiture } from '../../Constantes/utils';

export default function ItemLayout({isMountedMap, items, setEffect}) {
  const [itemModal, setItemModal] = useState({open: false, item: null});

  return isMountedMap ? (
    <>
      {itemModal.open ? (
        <BasicModal
          visible={itemModal.open}
          title={'Utiliser un objet'}
          onRequestClose={() => setItemModal({...itemModal, open: false})}
          onSubmit={() => setEffect(itemModal.item)}>
          <Text style={{fontSize: 17, color: COLORS.black}}>
            Voulez-vous vraiment utiliser la loupe ?
          </Text>
        </BasicModal>
      ) : null}

      <View
        style={{
          width: '95%',
          height: 100,
          position: 'absolute',
          backgroundColor: 'rgba(252, 252, 214,.9)',
          zIndex: 1,
          margin: '2.5%',
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
          }}>{`Mon sac à dos (${items.reduce((acc,i)=>acc+i.quantite,0)}/${GAME_CONFIG.item.max}) :`}</Text>
        <View style={{flexDirection: 'row'}}>
          {items.map((item, i) => {
            const picture=findPiture("loupe");
            return (
              <TouchableOpacity
                key={i}
                style={{flexDirection: 'row'}}
                onPress={() => setItemModal({open: true, item})}>
                <Image
                  source={picture}
                  style={{width: 50, height: 50}}
                />
                <Text
                  style={{
                    fontWeight: '900',
                    position: 'relative',
                    color: '#000',
                    right: 10,
                  }}>{`x${item.quantite}`}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </>
  ) : null;
}
