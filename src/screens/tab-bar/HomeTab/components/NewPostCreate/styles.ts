import { StyleSheet } from 'react-native';
import { color } from 'src/common/constants/color';
const styles = StyleSheet.create({
  wrapperCreatePost: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingVertical: 4,
    backgroundColor: color.sureface
  },
  createPostButton: {
    marginLeft: 8,
    flex: 1,
    padding: 10,
    borderColor: color.borderColor,
    borderWidth: 1,
    borderRadius: 30
  }
});

export default styles;
