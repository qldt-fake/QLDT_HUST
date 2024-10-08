import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ActivityIndicator, Alert, TextInput, View, Keyboard } from 'react-native';
import { Appbar, Divider, IconButton, Text } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import BaseFlatList from 'src/components/BaseFlatList';
import { ISearchUserItem, searchUserAPi } from 'src/services/search.service';
import UserItem from './components/UserItem';
import { setBlockApi } from 'src/services/block.service';
import { blockComponent } from 'src/redux/slices/blockSlice';
import { useAppDispatch } from 'src/redux';
const COUNT_ITEM = 10;

function SearchUserScreen() {
  const [searchText, setSearchText] = useState<string>('');
  const [isStartSearch, setIsStartSearch] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [data, setData] = useState<ISearchUserItem[]>([]);
  const [isNextSearch, setIsNextSearch] = useState<boolean>(false);
  const [isNextFetch, setIsNextFetch] = useState<boolean>(true);
  const navigation = useNavigation();
  const _goBack = () => navigation.goBack();
  const dispatch = useAppDispatch();

  const handleTextChange = (e: string) => {
    setSearchText(e);
  };

  const handleTextClear = () => {
    setSearchText('');
    setData([]);
    setIsStartSearch(false);
  };

  const handleSearch = async () => {
    if (searchText !== '') {
      try {
        Keyboard.dismiss();
        setIsSearching(true);
        setIsStartSearch(true);
        const res = await searchUserAPi({ keyword: searchText, index: 0, count: COUNT_ITEM });
        if (res.success) {
          if (!res.data.length) {
            setIsNextFetch(false);
            return;
          }
          setData(res.data);
          setIsNextFetch(true);
          setSkip(COUNT_ITEM);
        }
      } catch (e) {
        return;
      } finally {
        setIsSearching(false);
      }
    }
  };
  async function onEndReadable() {
    if (searchText !== '' && isNextFetch) {
      try {
        setIsNextSearch(true);
        setSkip(skip => skip + COUNT_ITEM);
        const res = await searchUserAPi({ keyword: searchText, index: skip, count: COUNT_ITEM });
        if (res.success) {
          if (!res.data.length) {
            setIsNextFetch(false);
            return;
          }
          setData(data => [...data, ...res.data]);
        }
      } catch (e) {
        setSkip(skip => skip - COUNT_ITEM);
        return;
      } finally {
        setIsNextSearch(false);
      }
    }
  }

  // set block user
  const onPressUser = (item: ISearchUserItem) => {
    Alert.alert(
      'XÁC NHẬN',
      `Bạn có chắc chắn chặn  ${item.username} hay không?. Nếu có mọi thông tin về bạn sẽ ẩn với ${item.username}`,
      [
        {
          text: 'Hủy',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Chặn',
          onPress: async () => {
            try {
              await setBlockApi({ user_id: item.id });
              dispatch(blockComponent());
            } catch (error) {
              return;
            } finally {
              _goBack();
            }
          }
        }
      ]
    );
  };
  return (
    <View style={{ backgroundColor: color.white, flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: color.white, justifyContent: 'space-between' }}>
        <Appbar.BackAction onPress={_goBack} />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <TextInput
            placeholder='Tìm kiếm'
            clearButtonMode='always'
            onChangeText={handleTextChange}
            value={searchText}
            onSubmitEditing={handleSearch}
            style={{
              height: 40,
              width: 250,
              borderRadius: 50,
              backgroundColor: color.backgroundColor,
              paddingLeft: 10
            }}
          />
          {searchText !== '' && (
            <IconButton
              icon='close'
              size={20}
              iconColor={color.borderColor}
              style={{
                borderRadius: 5,
                position: 'absolute',
                right: 0
              }}
              onPress={handleTextClear}
            />
          )}
        </View>
        <Appbar.Action icon='magnify' onPress={handleSearch} />
      </Appbar.Header>
      {searchText === '' || !isStartSearch ? (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <IconButton icon='account-search' size={100} iconColor={color.borderColor} />
          <Text variant='titleMedium' style={{ color: color.borderColor }}>
            Tìm kiếm người dùng tại đây
          </Text>
        </View>
      ) : isSearching ? (
        <ActivityIndicator color={color.activeOutlineColor} style={{ marginTop: '50%' }} />
      ) : (
        <BaseFlatList
          ListEmptyComponent={
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <IconButton icon='account-off' size={100} iconColor={color.borderColor} />
              <Text variant='titleMedium' style={{ color: color.borderColor }}>
                Không tìm thấy người dùng
              </Text>
            </View>
          }
          data={data}
          keyExtractor={item => item.id}
          refreshing={false}
          renderItem={({ item }) => (
            <>
              <UserItem
                title={item.username}
                avatar={item.avatar}
                id={item.id}
                onPress={() => onPressUser(item)}
              />
              <Divider />
            </>
          )}
          isFootterLoading={isNextSearch}
          onEndReached={onEndReadable}
          onEndReachedThreshold={0.001}
        />
      )}
    </View>
  );
}

export default SearchUserScreen;
