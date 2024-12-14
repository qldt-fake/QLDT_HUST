import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { color } from 'src/common/constants/color';
import { useAppSelector } from 'src/redux';

const LoadingOverlay: React.FC = () => {
  const isLoading = useAppSelector(state => state.loading.isLoading);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5, 
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500, 
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim,isLoading]);

  return (
    <Modal transparent={true} visible={isLoading}>
      <View style={styles.overlay}>
        {/* Biểu tượng thu nhỏ/phóng to với hiệu ứng */}
        <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Thu nhỏ/Phóng to')}>
          <Animated.Image
            source={require('src/assets/logo.png')} // Đường dẫn tới icon của bạn
            style={[styles.iconImage, { transform: [{ scale: scaleAnim }] }]} // Kết hợp hiệu ứng scale
          />
        </TouchableOpacity>

        {/* Loading spinner */}
        <ActivityIndicator size="large" color={color.white} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iconButton: {
    position: 'absolute',
    top: '40%', // Đặt vị trí icon phía trên ActivityIndicator
    alignSelf: 'center',
    zIndex: 2,
    padding: 8,
  },
  iconImage: {
    width: 40, // Kích thước ban đầu của icon
    height: 40,
    resizeMode: 'contain',
  },
});

export default LoadingOverlay;
