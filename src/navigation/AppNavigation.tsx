import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';

import TabNavigationWrapper from './TabNavigation';
import SettingNavigationWrapper from './SettingNavigation';
import SearchNavigationWrapper from './SearchNavigation';
import AuthNavigation from './AuthNavigation';
import VerifyOTPAfterLogin from 'src/screens/pending-sigup/VerifyOTPAfterLogin';
// import ChangeInfoAfterSignUpScreen from 'src/screens/pending-sigup/ChangeInfoAfterSignUp';
import NotFoundScreen from 'src/screens/notfound/NotFoundScreen';

import Header from 'src/screens/tab-bar/components/Header';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { getProfile, selectAuth, setAuthentication } from 'src/redux/slices/authSlice';
import { AppNaviagtionName, ClassNavigationName } from 'src/common/constants/nameScreen';
import { useEffect } from 'react';
import { AccountStatus } from 'src/common/enum/commom';
import BaseModalError from 'src/components/BaseModalError';
import { deleteMessage, selectApp, setMessage } from 'src/redux/slices/appSlice';
import ChangeInfoAfterSignUpScreen from 'src/screens/pending-sigup/ChangeInfoAfterSignUp/ChangeInfoAfterSignUp';
import axiosInstance from 'src/services/axiosInstance';
import { Snackbar } from 'react-native-paper';
import { useNetInfoInstance } from '@react-native-community/netinfo';
import ClassListPage from 'src/screens/classes/classes-for-teacher/ClassListPage';
import ClassDetail from 'src/screens/classes/classes-for-teacher/ClassDeatail';
import ClassNavigation from './ClassNavigation';
import NotificationNavigationWrapper from 'src/navigation/NotificationNavigation';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  const auth = useAppSelector(selectAuth);
  const appRedux = useAppSelector(selectApp);
  const dispatch = useAppDispatch();

  // handle token expiration
  axiosInstance.interceptors.response.use((response: any) => {
    if (response?.code === '9998') {
      dispatch(setAuthentication(false));
      dispatch(setMessage('Phiên đăng nhập hết hạn'));
    }
    return {
      ...response
    };
  });

  // handle wifi info

  // useEffect(() => {
  //   if (auth.user?.active === AccountStatus.Active) {
  //     dispatch(getProfile({ user_id: auth.user.id }));
  //     const data: IGetUserFriends = {
  //       index: 0,
  //       count: 100,
  //       user_id: auth.user.id
  //     };
  //     dispatch(getUserFriends(data));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [auth.user?.active, dispatch]);

  const onBackdropPress = () => {
    dispatch(deleteMessage());
  };

  const {
    netInfo: { isConnected },
    refresh
  } = useNetInfoInstance();

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'vertical'
        }}
      >
        {auth.isAuthenticated ? (
          auth.user?.status === AccountStatus.Inactive ? (
            <Stack.Screen
              name={AppNaviagtionName.VerifyOTPAfterLogin}
              component={VerifyOTPAfterLogin}
              options={{ headerShown: false }}
            />
          ) : (
            // ) : auth.user?.active === AccountStatus.Pending ? (
            //   <Stack.Screen
            //     name={AppNaviagtionName.ChangeProfileAfterSign}
            //     options={{ headerShown: false }}
            //     component={ChangeInfoAfterSignUpScreen}
            //   />
            <>
              <Stack.Screen
                name={AppNaviagtionName.TabNavigation}
                options={{ headerShown: false, header: () => <Header /> }}
                component={TabNavigationWrapper}
              />

              <Stack.Screen
                name={AppNaviagtionName.SettingNavigation}
                component={SettingNavigationWrapper}
              />
              <Stack.Screen
                name={AppNaviagtionName.NotificationNavigation}
                component={NotificationNavigationWrapper}
              />
              <Stack.Screen
                name={AppNaviagtionName.SearchNavigation}
                component={SearchNavigationWrapper}
              />
              <Stack.Screen
                name={AppNaviagtionName.NotFoundScreen}
                component={NotFoundScreen}
                options={{ headerTitle: 'Không tìm thấy nội dung' }}
              />
              {ClassNavigation()}
            </>
          )
        ) : (
          <Stack.Screen
            name='AuthNavigation'
            options={{ headerShown: false }}
            component={AuthNavigation}
          />
        )}
      </Stack.Navigator>
      <BaseModalError
        isVisible={!!appRedux.message}
        onBackdropPress={onBackdropPress}
        title={appRedux.message}
      />
      <Snackbar
        visible={!isConnected as boolean}
        onDismiss={() => {}}
        action={{
          label: 'Thử lại',
          onPress: () => {
            refresh();
          }
        }}
      >
        Không có kết nối internet.Vui lòng thử lại!
      </Snackbar>
    </>
  );
}

export default AppNavigation;
export { axiosInstance };
