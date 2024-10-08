import { useCallback, useEffect, useState } from 'react';
import { COUNT_ITEM } from 'src/common/constants';
import { IListBodyResponse } from 'src/interfaces/common.interface';

function useLoadingListApi<T>(
  // eslint-disable-next-line no-unused-vars
  callbackFunc: (data: { index: number; count: number }) => Promise<IListBodyResponse<T>>
) {
  const [data, setData] = useState<T[]>([]);
  const [isFetch, setIsFetch] = useState<boolean>(true);
  const [isLoadingFirstApi, setIsLoadingFirstAPi] = useState<boolean>(false);
  const [isNextFetchingApi, setNextFetchingAPi] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  const getListUsers = useCallback(() => {
    async function getFirstUsers() {
      try {
        setIsLoadingFirstAPi(true);
        const res = await callbackFunc({ index: 0, count: COUNT_ITEM });
        if (res.success) {
          setData(res.data);
          if (res.data.length < COUNT_ITEM) {
            setIsFetch(false);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoadingFirstAPi(false);
      }
    }
    getFirstUsers();
  }, [callbackFunc]);

  useEffect(() => {
    getListUsers();
  }, [getListUsers]);

  // onRefresh
  const onRefresh = () => {
    setRefreshing(true);
    setSkip(Math.floor(Math.random() * data.length));
  };

  const getRefreshingApi = useCallback(() => {
    async function getRefreshing() {
      try {
        const res = await callbackFunc({ index: skip, count: COUNT_ITEM });
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setRefreshing(false);
      }
    }
    getRefreshing();
  }, [callbackFunc, skip]);

  // gọi api khi refeshing
  useEffect(() => {
    if (refreshing) {
      getRefreshingApi();
    }
  }, [getRefreshingApi, refreshing]);

  async function onEndReadable() {
    if (isFetch) {
      try {
        setNextFetchingAPi(true);
        const res = await callbackFunc({ index: skip + COUNT_ITEM, count: COUNT_ITEM });
        if (res.success) {
          if (res.data.length === 0) {
            return setIsFetch(false);
          }
          setData(blockUsers => [...blockUsers, ...res.data]);
          setSkip(skip => skip + COUNT_ITEM);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setNextFetchingAPi(false);
      }
    }
  }

  return {
    data,
    onEndReadable,
    isLoadingFirstApi,
    isNextFetchingApi,
    refreshing,
    onRefresh
  };
}

export default useLoadingListApi;
