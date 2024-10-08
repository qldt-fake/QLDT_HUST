import { Appbar, AppbarContentProps } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
export type BaseHeaderProps = Partial<AppbarContentProps> & { backgroundColor?: boolean };
function BaseHeader(props: BaseHeaderProps) {
  const navigation = useNavigation();
  return props?.backgroundColor ? (
    <Appbar.BackAction onPress={() => navigation.goBack()} />
  ) : (
    <LinearGradient
      colors={color.linearBackgroundColor}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Appbar.BackAction onPress={() => navigation.goBack()} />
    </LinearGradient>
  );
}

export default BaseHeader;
