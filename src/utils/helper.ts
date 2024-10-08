import isPlainObject from 'lodash/isPlainObject';
import mapKeys from 'lodash/mapKeys';
import trim from 'lodash/trim';
import { HttpStatus } from 'src/common/constants';
import {
  FILE_SIZE_TOO_BIG,
  FILE_UPLOAD_FAILED,
  MAX_NUMBER_OF_IMAGES,
  NOT_ENOUGHT_COINS,
  POST_INVALID_POLICY,
  POST_LIMIT_ACCESS_COUNTRY,
  POST_NOT_EXISTED,
  USER_IS_EXISTED,
  USER_NOT_FOUND
} from 'src/common/constants/responseCode';

export function isValidJSON(str: string) {
  try {
    const object = JSON.parse(str);
    if (object && typeof object === 'object') return true;
    return false;
  } catch (error) {
    return false;
  }
}

export function trimData(body: any): void {
  const trimValue = (item: any) => {
    mapKeys(item, (value, key) => {
      // remove string contain only space characters
      if (typeof value === 'string') {
        item[key] = value.trim();
      }

      // iterate array
      else if (Array.isArray(value)) {
        value.forEach((subValue, index) => {
          // remove string contain only space characters
          if (typeof subValue === 'string') {
            value[index] = trim(subValue);
          } else if (isPlainObject(subValue)) {
            trimValue(subValue);
          }
        });
      } else if (isPlainObject(value)) {
        trimValue(value);
      }
    });
  };

  trimValue(body);
}

export function isStringify<T>(obj: T | Record<string, unknown>): boolean {
  try {
    JSON.stringify(obj);
  } catch (e) {
    return false;
  }
  return true;
}

export function hasPermissionToAccessRoute(requiredPermissions: string[]): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;

  // TODO: implement logic later
  return true;
}

export const getAvatarUri = (uri: string) =>
  uri ? { uri: uri } : require('src/assets/avatar-default.jpg');

export const getCoverUri = (uri: string) =>
  uri ? { uri: uri } : require('src/assets/cover-default.jpg');

export function removeDiacritics(str: string) {
  const AccentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ',
    'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ',
    'DĐ',
    'eèẻẽéẹêềểễếệ',
    'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị',
    'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ',
    'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự',
    'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ',
    'YỲỶỸÝỴ'
  ];
  for (let i = 0; i < AccentsMap.length; i++) {
    const re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
    const char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}

export function removeSpaces(str: string) {
  return str.replace(/\s/g, '');
}

export const handShowErrorMessage = (code: number): string => {
  switch (code) {
    case HttpStatus.NETWORK_ERROR:
      return 'Vui lòng kiểm tra kết nối internet';
    case POST_NOT_EXISTED:
      return 'Bài viết không tồn tại.';
    case POST_INVALID_POLICY:
      return 'Bài viết vi phạm chính sách của Fakebook';
    case POST_LIMIT_ACCESS_COUNTRY:
      return 'Bài viết không thể truy cập từ quốc gia này';
    case USER_NOT_FOUND:
      return 'Người dùng không tồn tại';
    case USER_IS_EXISTED:
      return 'Người dùng đã tồn tại';
    case FILE_SIZE_TOO_BIG:
      return 'Tập tin vượt quá kích thước cho phép. Vui lòng chọn lại';
    case FILE_UPLOAD_FAILED:
      return 'Không thể tải lên tập tin';
    case MAX_NUMBER_OF_IMAGES:
      return 'Vượt quá số ảnh cho phép. Vui lòng không đăng quá 4 ảnh';
    case NOT_ENOUGHT_COINS:
      return 'Bạn không đủ coins. Vui lòng nạp thêm coins để tiếp tục';
    default:
      return 'Vui lòng kiểm tra kết nối internet';
  }
};

export const formatDate = (date: string) => {
  const dateObject = new Date(date);
  const dayOfYear = Math.floor(
    (Date.UTC(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate()) -
      Date.UTC(dateObject.getUTCFullYear(), 0, 0)) /
      86400000
  );
  if (dateObject.getUTCDay() < 5) {
    return `T${dateObject.getUTCDay()} LÚC ${dateObject.getUTCHours()}:${dateObject.getUTCMinutes()}`;
  } else if (dayOfYear === 365) {
    return `${dateObject.getUTCDate()} THG ${
      dateObject.getUTCMonth() + 1
    } LÚC ${dateObject.getUTCHours()}:${dateObject.getUTCMinutes()}`;
  } else {
    return `${dateObject.getUTCDate()} THG ${
      dateObject.getUTCMonth() + 1
    }, ${dateObject.getUTCFullYear()}`;
  }
};

export function formatNumber(number: string): string {
  if (!number || number === 'NaN' || parseInt(number) < 0) {
    return '0';
  }
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
