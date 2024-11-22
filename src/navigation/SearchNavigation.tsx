import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import { SearchNavigationName } from 'src/common/constants/nameScreen';
import WraperScreen from 'src/components/WraperScreen';

const Stack = createNativeStackNavigator();

function SearchNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }}
    ></Stack.Navigator>
  );
}

const SearchNavigationWrapper = () => (
  <WraperScreen paddingBottom={0} paddingHorizontal={0}>
    <SearchNavigation />
  </WraperScreen>
);

export default SearchNavigationWrapper;
