import { Divider, Text } from 'react-native-paper';
import { ScrollView, View } from 'react-native';
import FunctionItem from '../components/FunctionItem';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface IFuctionItem {
  title: string;
  children: [
    {
      iconName: string;
      title: string;
      subtitle: string;
      onPress?: () => any;
    }
  ];
}

function SettingSecurityLogin() {
  const navigation: NavigationProp<SettingNavigationType> = useNavigation();
  const onPressChangePassword = () => navigation.navigate('SettingPassword');
  const ListFunctionItem: IFuctionItem[] = [
    {
      title: 'Đề xuất',
      children: [
        {
          title: 'Chọn bạn bè để liên hệ nếu bạn không đăng nhập được',
          subtitle:
            'Chúng tôi khuyên mọi người nên chọn từ 3 đến 5 người bạn để giúp mình trong trường hợp không thể đăng nhập',
          iconName: 'account-supervisor-outline'
        }
      ]
    },
    {
      title: 'Đăng nhập',
      children: [
        {
          title: 'Đổi mật khẩu',
          subtitle: 'Bạn nên sử dụng mật khẩu mạnh mà mình chưa sử dụng ở nơi khác',
          iconName: 'key-outline',
          onPress: onPressChangePassword
        }
      ]
    }
  ];
  return (
    <ScrollView>
      <Text style={{ fontSize: 24, fontWeight: '700', paddingVertical: 16, paddingLeft: 10 }}>
        Bảo mật và đăng nhập
      </Text>
      {ListFunctionItem.map((item, index) => (
        <View key={index}>
          <Text style={{ fontSize: 16, fontWeight: '700', paddingLeft: 10, marginBottom: 8 }}>
            {item.title}
          </Text>
          {item.children.map((child, i) => (
            <View key={i}>
              <FunctionItem
                title={child.title}
                subtitle={child.subtitle}
                leftIconName={child.iconName}
                rightIcon
                onPress={child?.onPress}
              />
              <Divider />
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

export default SettingSecurityLogin;
