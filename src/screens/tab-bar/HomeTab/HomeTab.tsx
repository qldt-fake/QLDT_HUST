import Post from 'src/components/Post';
import NewPostCreate from './components/NewPostCreate/NewPostCreate';
import { useEffect, useRef, useState } from 'react';
import BaseFlatList from 'src/components/BaseFlatList';
// import { PanResponder } from 'react-native';
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
  useScrollToTop
} from '@react-navigation/native';
import { AppNaviagtionName } from 'src/common/constants/nameScreen';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { ProgressBar } from 'react-native-paper';
import { color } from 'src/common/constants/color';
// import { ToastAndroid } from 'react-native';

function HomeTab() {
  

  return (
    <></>
  );
}

export default HomeTab;
