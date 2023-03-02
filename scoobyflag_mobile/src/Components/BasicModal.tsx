import {Modal, Text, TouchableOpacity, View} from 'react-native';
import COLORS from '../Constantes/colors';

interface IProps {
  visible: boolean;
  children: any;
  onRequestClose: () => void;
  title?: string;
  onSubmit?: () => void;
}

export default function BasicModal({
  visible,
  children,
  onRequestClose,
  title,
  onSubmit,
}: IProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onRequestClose}>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,.7)',
          flex: 1,
        }}
        onPress={onRequestClose}>
        <View
          style={{
            padding: '2.5%',
            marginHorizontal: '10%',
            minHeight: '15%',
            backgroundColor: COLORS.white,
            borderRadius: 15,
            justifyContent: 'space-between',
          }}>
          {title ? (
            <Text
              style={{
                alignSelf: 'center',
                marginBottom: 15,
                fontSize: 25,
                fontWeight: '700',
                color: COLORS.primary,
              }}>
              {title}
            </Text>
          ) : null}
          <View style={{marginVertical: 20}}>{children}</View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            {onSubmit ? (
              <>
                <TouchableOpacity
                  style={{
                    margin: '1%',
                    width: '48%',
                    backgroundColor: COLORS.primary,
                    height: 40,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    onSubmit();
                    onRequestClose();
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '600',
                      color: COLORS.white,
                    }}>
                    Valider
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    margin: '1%',
                    width: '48%',
                    backgroundColor: COLORS.secondary,
                    height: 40,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={onRequestClose}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '600',
                      color: COLORS.black,
                    }}>
                    Annuler
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
