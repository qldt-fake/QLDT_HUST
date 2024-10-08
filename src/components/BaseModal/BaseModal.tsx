import { View } from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';

export type BaseModalProps = Partial<ModalProps>;

function BaseModal(props: BaseModalProps) {
  const { isVisible, onBackdropPress, children, ...remainProps } = props;
  return (
    <Modal
      {...remainProps}
      isVisible={isVisible}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      backdropOpacity={0.5}
      onBackdropPress={onBackdropPress}
      style={{ justifyContent: 'flex-end', margin: 0 }}
    >
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 20,
          paddingBottom: 12,
          paddingTop: 20
        }}
      >
        {children}
      </View>
    </Modal>
  );
}

export default BaseModal;
