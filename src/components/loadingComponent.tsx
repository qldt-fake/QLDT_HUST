import React from 'react';
import { ActivityIndicator, Modal, View, StyleSheet } from 'react-native';
import { color } from 'src/common/constants/color';
import { useAppSelector } from 'src/redux';
const LoadingOverlay: React.FC = () => {
  const isLoading = useAppSelector(state => state.loading.isLoading);

  return (
    <Modal transparent={true} visible={isLoading}>
      <View style={styles.overlay}>
        <ActivityIndicator size='large' color={color.second} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});

export default LoadingOverlay;
