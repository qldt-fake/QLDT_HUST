import { useCallback, useEffect, useState } from 'react';
import { IBodyResponse } from 'src/interfaces/common.interface';
import { useAppDispatch } from 'src/redux';
import { setMessage } from 'src/redux/slices/appSlice';
import { handShowErrorMessage } from 'src/utils/helper';

function useHandleCallApi<T>(callApiFunction: () => Promise<IBodyResponse<T>>) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoaidng] = useState<boolean>(false);
  const [res, setRes] = useState<IBodyResponse<T> | null>(null);
  const callApi = useCallback(async () => {
    try {
      setIsLoaidng(true);
      const res = await callApiFunction();
      if (res.success) {
        return setRes(res);
      } else {
        dispatch(setMessage(handShowErrorMessage(parseInt(res.code as unknown as string))));
      }
    } catch (err) {
      dispatch(setMessage('Vui lòng kiểm tra lại kết nối'));
    } finally {
      setIsLoaidng(false);
    }
  }, [callApiFunction, dispatch]);
  useEffect(() => {
    callApi();
  }, [callApi]);
  return { isLoading, res };
}

export default useHandleCallApi;
