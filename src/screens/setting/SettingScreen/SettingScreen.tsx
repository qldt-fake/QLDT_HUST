import { NavigationProp, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { Card, IconButton, TouchableRipple } from 'react-native-paper';
import { color } from 'src/common/constants/color';
export interface IListItem {
  title: string;
  subtitle: string;
  children: [
    {
      title: string;
      subtitle: string;
      icon: string;
      onPress?: () => any;
    }
  ];
}
function SettingScreen() {
  const navigation: NavigationProp<SettingNavigationType> = useNavigation();
  const onPressSettingInfo = () => navigation.navigate('SettingInfo');
  const onPressSettingSecurityLogin = () => navigation.navigate('SettingSecurityLogin');
  const listItem: IListItem[] = [
    {
      title: 'Cài đặt tài khoản',
      subtitle:
        'Quản lí thông tin tài khoản của bạn, các thanh khoản và danh bạ của bạn cũng như tài khoản nói chung',
      children: [
        {
          title: 'Thông tin cá nhân',
          subtitle:
            'Quản lí thông tin tài khoản của bạn, các thanh khoản và danh bạ của bạn cũng như tài khoản nói chung',
          icon: 'account-circle',
          onPress: onPressSettingInfo
        }
      ]
    },
    {
      title: 'Bảo mật',
      subtitle:
        'Đổi mật khẩu và thực hiện các hành động khác để tăng cường bảo mật cho tài khoản của bạn',
      children: [
        {
          title: 'Bảo mật và đăng nhập',
          subtitle:
            'Đổi mật khẩu và thực hiện các hành động khác để tăng cường bảo mật cho tài khoản của bạn',
          icon: 'shield-lock',
          onPress: onPressSettingSecurityLogin
        }
      ]
    }
  ];
  return (
    <>
      {listItem.map((item, index) => (
        <View
          style={{ backgroundColor: color.sureface, marginTop: 4, paddingVertical: 4 }}
          key={index}
        >
          <Card.Title
            title={item.title}
            titleVariant='titleMedium'
            titleStyle={{ fontSize: 18, fontWeight: '500' }}
            subtitleNumberOfLines={3}
            subtitleVariant='bodySmall'
            subtitleStyle={{ color: color.activeOutlineColor }}
            subtitle={item.subtitle}
          />

          {item.children.map((child, i) => (
            <TouchableRipple key={i} underlayColor={color.borderColor} onPress={child.onPress}>
              <Card.Title
                title={child.title}
                titleVariant='titleMedium'
                left={props => <IconButton {...props} icon={child.icon} />}
                subtitleVariant='bodySmall'
                subtitleStyle={{ color: color.activeOutlineColor }}
                subtitleNumberOfLines={3}
                subtitle={child.subtitle}
              />
            </TouchableRipple>
          ))}
        </View>
      ))}
    </>
  );
}

export default SettingScreen;
