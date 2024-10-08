import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import { AppNaviagtionName, SearchNavigationName } from 'src/common/constants/nameScreen';

interface HeaderWithSearchProps {
  title: string;
  titleIsCenter: boolean;
}

const HeaderWithSearch: React.FC<HeaderWithSearchProps> = ({ title, titleIsCenter }) => {
  const navigation = useNavigation();
  const searchNavigation: NavigationProp<AppNavigationType, AppNaviagtionName.SearchNavigation> =
    useNavigation();
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSearchPress = () => {
    searchNavigation.navigate(AppNaviagtionName.SearchNavigation, {
      screen: SearchNavigationName.SearchScreen
    });
  };

  return (
    <Appbar.Header mode={titleIsCenter ? 'center-aligned' : 'small'} style={{ height: 52 }}>
      <Appbar.BackAction onPress={handleBackPress} size={30} />
      <Appbar.Content title={title} titleStyle={{ fontSize: 18, fontWeight: '700' }} />
      <Appbar.Action icon='magnify' onPress={handleSearchPress} size={30} />
    </Appbar.Header>
  );
};

export default HeaderWithSearch;
