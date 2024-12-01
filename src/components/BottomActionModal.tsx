import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';
import { useModal } from '../hooks/useBottomModal';
interface ActionModalProps {
  isVisible: boolean;
  title: string;
  actions: { icon: string; text: string; onPress: () => void }[];
  onBackdropPress: () => void;
}

const BottomActionModal: React.FC<ActionModalProps> = ({
  isVisible,
  title,
  actions,
  onBackdropPress
}) => {
  const {hideModal} = useModal();
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType='slide'
      onRequestClose={onBackdropPress}
    >
      <Pressable style={styles.modalContainer} onPress={onBackdropPress}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modalOption}
              onPress={() => {
                action.onPress();
                hideModal();
              }}
            >
              <Icon name={action.icon} size={20} color={color.primary} />
              <Text style={styles.actionText}>{action.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12
  },
  actionText: {
    fontSize: 16,
    marginLeft: 10,
    color: color.primary
  }
});

export default BottomActionModal;
