import React, { useEffect, useRef } from 'react';
import { View, Modal, Animated, PanResponder } from 'react-native';

type props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};
const PullDownModal = ({ visible, onClose, children }: props) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: (_, gestureState) =>
        gestureState.dy > 2 || gestureState.dy < -2,
      onPanResponderMove: Animated.event([null, { dy: translateY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: false
          }).start();
        }
      }
    })
  ).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType='slide' onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0)' }}>
        <Animated.View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            transform: [{ translateY }]
          }}
          {...panResponder.panHandlers}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};
export default PullDownModal;
