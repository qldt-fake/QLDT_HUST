import BaseFlatList from 'src/components/BaseFlatList';
import BlockFirendItem from './components/BlockFirendItem';
import HeaderItem from './components/HeaderItem';
import { ActivityIndicator, Divider, Text } from 'react-native-paper';
import { IBlockUserData, getListBlockApi } from 'src/services/block.service';
import { color } from 'src/common/constants/color';
import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { SettingNavigationName } from 'src/common/constants/nameScreen';
import { useCallback, useEffect, useState } from 'react';
import { COUNT_ITEM } from 'src/common/constants';
import { useAppDispatch } from 'src/redux';
import { setMessage } from 'src/redux/slices/appSlice';
import { handShowErrorMessage } from 'src/utils/helper';

export interface IBlockFriend {
  id: string;
  avatar?: string;
  name: string;
}

function BlockFriendScreen() {
  // const { data, onEndReadable, isLoadingFirstApi, isNextFetchingApi } =
  //   useLoadingListApi(getListBlockApi);
  const [data, setData] = useState<IBlockFriend[]>([]);
  const [isFetch, setIsFetch] = useState<boolean>(true);
  const [isLoadingFirstApi, setIsLoadingFirstAPi] = useState<boolean>(false);
  const [isNextFetchingApi, setNextFetchingAPi] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);

  const dispatch = useAppDispatch();

  const getListUsers = useCallback(() => {
    async function getFirstUsers() {
      try {
        setIsLoadingFirstAPi(true);
        const res = await getListBlockApi({ index: 0, count: COUNT_ITEM });
        if (res.success) {
          setData(res.data);
          if (res.data.length < COUNT_ITEM) {
            setIsFetch(false);
          }
        } else {
          dispatch(setMessage(handShowErrorMessage(parseInt(res.code as unknown as string))));
        }
      } catch (err) {
        dispatch(setMessage('Vui lòng kiểm tra lại kết nối'));
      } finally {
        setIsLoadingFirstAPi(false);
      }
    }
    getFirstUsers();
  }, [dispatch]);
  const isFocus = useIsFocused();
  useEffect(() => {
    if (isFocus) {
      getListUsers();
    }
  }, [getListUsers, isFocus]);
  async function onEndReadable() {
    if (isFetch) {
      try {
        setNextFetchingAPi(true);
        const res = await getListBlockApi({ index: skip + COUNT_ITEM, count: COUNT_ITEM });
        if (res.success) {
          if (res.data.length === 0) {
            return setIsFetch(false);
          }
          setSkip(skip => skip + COUNT_ITEM);
          setData(data => [...data, ...res.data]);
        } else {
          dispatch(setMessage(handShowErrorMessage(parseInt(res.code as unknown as string))));
        }
      } catch (err) {
        dispatch(setMessage('Vui lòng kiểm tra lại kết nối'));
      } finally {
        setNextFetchingAPi(false);
      }
    }
  }
  // handle navigation search user screen
  const navigationSearchUser: NavigationProp<
    SettingNavigationType,
    SettingNavigationName.SearchUserScreen
  > = useNavigation();

  const onPessAddButton = () =>
    navigationSearchUser.navigate(SettingNavigationName.SearchUserScreen);
  return isLoadingFirstApi ? (
    <ActivityIndicator color={color.activeOutlineColor} style={{ marginTop: '50%' }} />
  ) : (
    <>
      <BaseFlatList
        ListHeaderComponent={<HeaderItem onPressAddItem={onPessAddButton} />}
        ListEmptyComponent={
          <Text variant='bodyLarge' style={{ textAlign: 'center', marginTop: 20 }}>
            Danh sách chặn trống
          </Text>
        }
        data={data}
        renderItem={({ item }: { item: IBlockUserData }) => (
          <>
            <BlockFirendItem title={item.name} avatar={item.avatar} id={item.id} />
            <Divider />
          </>
        )}
        keyExtractor={item => item.id}
        refreshing={false}
        onEndReached={onEndReadable}
        onEndReachedThreshold={0.05}
        isFootterLoading={isNextFetchingApi}
      />
    </>
  );
}

export default BlockFriendScreen;
