import { Text } from 'react-native-paper';
import { Image } from 'react-native';
import WraperAuthScreen from 'src/components/WraperScreen';
import BaseButton from 'src/components/BaseButton';
import { color } from 'src/common/constants/color';
import { useNavigation } from '@react-navigation/native';

function FirstScreen() {
  const navigation = useNavigation();
  return (
    <WraperAuthScreen linnerGradient>
      <Text variant='titleLarge' style={{ fontWeight: 'bold' }}>
        Tham gia Facebook
      </Text>
      <Image source={require('src/assets/first-screen-login-image.png')} />
      <Text variant='bodyMedium'>
        Tạo tài khoản để kết nối với bạn bè, người thân và cộng đồng có chung sở thích
      </Text>
      <BaseButton onPress={() => navigation.navigate('NameScreen' as never)}>Bắt đầu</BaseButton>
      <BaseButton
        mode='outlined'
        borderColor={color.outlineColor}
        textColor={color.textColor}
        isUseTextOutlineColor
        onPress={() => navigation.navigate('Login' as never)}
      >
        Tôi có tài khoản rồi
      </BaseButton>
    </WraperAuthScreen>
  );
}

export default FirstScreen;
