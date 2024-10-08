import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Avatar, Card, CardTitleProps, TouchableRipple, Text } from 'react-native-paper';
import { AppNaviagtionName, ProfileNavigationName } from 'src/common/constants/nameScreen';
import { getAvatarUri } from 'src/utils/helper';
export type UserItemProps = CardTitleProps & {
  avatar?: string;
  id: string;
  onPress?: () => void;
};
function UserItem(props: UserItemProps) {
  const { title, avatar, id, onPress, ...remainProps } = props;
  const navigation: NavigationProp<AppNavigationType, AppNaviagtionName.ProfileNavigation> =
    useNavigation();
  const handleNavigateUserProfile = (user_id: string) => {
    navigation.navigate(AppNaviagtionName.ProfileNavigation, {
      screen: ProfileNavigationName.Profile,
      params: { user_id }
    });
  };
  return (
    <TouchableRipple
      onPress={
        onPress ??
        (() => {
          handleNavigateUserProfile(id);
        })
      }
    >
      <Card.Title
        {...remainProps}
        title={<Text variant='titleMedium'>{title}</Text>}
        left={() => (
          <Avatar.Image
            source={getAvatarUri(avatar as string)}
            size={40}
            style={{ opacity: 0.8 }}
          />
        )}
      />
    </TouchableRipple>
  );
}

export default UserItem;
