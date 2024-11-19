import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  background: {
    backgroundColor: '#b22727', // Đổi màu nền thành đỏ thẫm
    flex: 1, // Đảm bảo phủ toàn bộ màn hình
    padding: 20
  },
  logo: {
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'column-reverse'
  },
  formGroup: {
    flex: 3,
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center'
  },

  bottom: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: 4
  }
});
export default styles;
