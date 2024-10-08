import { NavigationProp, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { Card, Divider, IconButton, Text, TouchableRipple } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import { useAppSelector } from 'src/redux';
import { selectAuth } from 'src/redux/slices/authSlice';

interface IListItemInfo {
  title: string;
  subtitle: string;
  onPress?: () => any;
}

function SettingInfo() {
  const navigation: NavigationProp<SettingNavigationType> = useNavigation();
  const auth = useAppSelector(selectAuth);

  const onPressInfoName = () => navigation.navigate('SettingInfoName');
  const listItem: IListItemInfo[] = [
    {
      title: 'Tên',
      subtitle: auth.user?.username as string,
      onPress: onPressInfoName
    },
    {
      title: 'Thông tin liên hệ',
      subtitle: 'Quản lí số điện thoại và email'
    },
    {
      title: 'Xác nhận danh tính',
      subtitle: 'Xác nhận danh tính của bạn trên Facebook'
    },
    {
      title: 'Quản lí tài khoản',
      subtitle: 'Cài đăt cách vô hiệu hóa và người liên hệ thừa kế'
    }
  ];
  return (
    <>
      <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 10, paddingVertical: 10 }}>
        Thông tin cá nhân
      </Text>
      <Divider />
      {listItem.map((item, i) => (
        <View key={i}>
          <TouchableRipple underlayColor={color.borderColor} onPress={item.onPress ?? (() => {})}>
            <Card.Title
              title={item.title}
              subtitle={item.subtitle}
              titleVariant='titleMedium'
              subtitleVariant='bodySmall'
              subtitleStyle={{ color: color.activeOutlineColor }}
              subtitleNumberOfLines={3}
              right={props => (
                <IconButton {...props} icon='chevron-right' iconColor={color.activeOutlineColor} />
              )}
            />
          </TouchableRipple>
          <Divider />
        </View>
      ))}
    </>
  );
}

export default SettingInfo;
