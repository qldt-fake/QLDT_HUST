import { useCallback, useEffect, useState } from 'react';
import { COUNT_ITEM } from 'src/common/constants';
import { IListBodyResponse } from 'src/interfaces/common.interface';
import { useAppDispatch } from 'src/redux';
import { setMessage } from 'src/redux/slices/appSlice';
import { handShowErrorMessage } from 'src/utils/helper';

function useLoadingListApi<T>(
  // eslint-disable-next-line no-unused-vars
  callbackFunc: (data: any) => Promise<IListBodyResponse<T>>,
  arg?: object
) {
  const dispatch = useAppDispatch();
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
        const res = await callbackFunc({ ...arg, index: 0, count: COUNT_ITEM });
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
  }, [arg, callbackFunc, dispatch]);

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
        const res = await callbackFunc({ ...arg, index: skip, count: COUNT_ITEM });
        if (res.success) {
          setData(res.data);
        } else {
          dispatch(setMessage(handShowErrorMessage(parseInt(res.code as unknown as string))));
        }
      } catch (err) {
        dispatch(setMessage('Vui lòng kiểm tra lại kết nối'));
      } finally {
        setRefreshing(false);
      }
    }
    getRefreshing();
  }, [arg, callbackFunc, dispatch, skip]);

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
        const res = await callbackFunc({ ...arg, index: skip + COUNT_ITEM, count: COUNT_ITEM });
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
