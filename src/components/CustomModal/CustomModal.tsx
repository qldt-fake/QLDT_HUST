import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, PanResponder } from 'react-native';
import Modal from 'react-native-modal';
import OptionCard from 'src/screens/profile/Profile/component/OptionCard';

interface Option {
  icon: string;
  title: string;
}

interface CustomModalProps {
  options: Option[];
  isVisible: boolean;
  onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ options, isVisible, onClose }) => {
  const modalHeight = options.length * 300;
  const translateY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: translateY }], {
        useNativeDriver: false
      }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < 0) {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: false }).start();
        } else {
          onClose();
        }
      }
    })
  ).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(translateY, { toValue: 0, useNativeDriver: false }).start();
    }
  }, [isVisible, translateY]);

  return (
    <Modal
      isVisible={isVisible}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <Animated.View
        style={[
          styles.modalContent,
          {
            height: 200,
            transform: [{ translateY: translateY }]
          }
        ]}
        {...panResponder.panHandlers}
      ></Animated.View>
      {options.map((option, index) => (
        <TouchableOpacity key={index} onPress={() => console.log(`Selected: ${option.title}`)}>
          <View style={[styles.option, { height: modalHeight }]}>
            <OptionCard icon={option.icon} title={option.title} />
          </View>
        </TouchableOpacity>
      ))}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  option: {
    paddingHorizontal: 20
  }
});

export default CustomModal;
