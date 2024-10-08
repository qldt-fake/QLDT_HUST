import { Appbar, IconButton } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFont from 'react-native-vector-icons/FontAwesome6';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import {
  AddMoneyNavigationName,
  AppNaviagtionName,
  ChatNavigationName,
  SearchNavigationName
} from 'src/common/constants/nameScreen';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from 'src/redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { useSelector } from 'react-redux';
import database from '@react-native-firebase/database';
import { formatNumber } from 'src/utils/helper';

function Header() {


  return (
    <Appbar.Header style={{ height: 40, marginTop: 8 }}>
      <Appbar.Content
        title='facebook'
        color={color.primary}
        titleStyle={{ fontWeight: 'bold', fontSize: 28 }}
      />

      <View
      >
        <IconButton
          icon={() => <IconFont name='plus' color={color.iconButtonColor} size={20} />}
          containerColor={color.iconButtonBackgroundColor}
          size={20}
        />
        <TouchableOpacity
          style={[{ flexDirection: 'row', alignItems: 'center', gap: 7, paddingRight: 10 }]}
          activeOpacity={0.8}
        >
          <Text style={{ color: color.iconButtonColor, fontWeight: 'bold', fontSize: 16 }}>
          </Text>
          <IconFont name='coins' color={color.iconButtonColor} size={16} />
        </TouchableOpacity>
      </View>
      <IconButton
        mode='contained'
        icon={() => <Icon name='search' color={color.iconButtonColor} size={20} />}
        containerColor={color.iconButtonBackgroundColor}
        size={25}
      />
      <IconButton
        mode='contained'
        icon='facebook-messenger'
        containerColor={color.iconButtonBackgroundColor}
        iconColor={color.iconButtonColor}
        size={25}
      />
    </Appbar.Header>
  );
}

export default Header;
