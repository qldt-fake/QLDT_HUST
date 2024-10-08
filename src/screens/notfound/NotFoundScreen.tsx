import { NavigationProp, useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { color } from 'src/common/constants/color';

const NotFoundScreen = () => {
  const navigation: NavigationProp<AppNavigationType, 'TabNavigation'> = useNavigation();
  const navigateToHome = () => {
    navigation.navigate('TabNavigation');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.errorMessage}>
        Trang bạn yêu cầu không thể hiển thị ngay bây giờ. Nguyên nhân có thể là trang tạm thời
        không hoạt động, liên kết bạn nhấp bị hỏng, hết hạn hoặc bạn không có quyền xem trang này.
      </Text>
      <TouchableOpacity onPress={navigateToHome}>
        <Text style={styles.goBack}>Quay lại trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white
  },
  errorMessage: {
    color: color.errorText,
    backgroundColor: color.errorBackground,
    fontWeight: '400',
    fontSize: 14,
    padding: 7
  },
  goBack: {
    color: color.primary,
    fontSize: 14,
    padding: 7
  }
});

export default NotFoundScreen;
