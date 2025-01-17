import { DATE_TIME_FORMAT } from './../common/constants/index';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
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
import { Alert } from 'react-native';
import dayjs from 'dayjs';
import { DatePickerProps } from 'react-native-date-picker';

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
export const convertGoogleDriveLink = (uri?: string) => {
  if (!uri) return '';
  const fileIdMatch = uri.match(/\/d\/(.*?)\//);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
  } else {
    console.error('Invalid Google Drive URL');
    return null;
  }
};

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

// export const handShowErrorMessage = (code: string): string => {
//   switch (code) {
//     case HttpStatus.NETWORK_ERROR:
//       return 'Vui lòng kiểm tra kết nối internet';
//     case POST_NOT_EXISTED:
//       return 'Bài viết không tồn tại.';
//     case POST_INVALID_POLICY:
//       return 'Bài viết vi phạm chính sách của Fakebook';
//     case POST_LIMIT_ACCESS_COUNTRY:
//       return 'Bài viết không thể truy cập từ quốc gia này';
//     case USER_NOT_FOUND:
//       return 'Người dùng không tồn tại';
//     case USER_IS_EXISTED:
//       return 'Người dùng đã tồn tại';
//     case FILE_SIZE_TOO_BIG:
//       return 'Tập tin vượt quá kích thước cho phép. Vui lòng chọn lại';
//     case FILE_UPLOAD_FAILED:
//       return 'Không thể tải lên tập tin';
//     case MAX_NUMBER_OF_IMAGES:
//       return 'Vượt quá số ảnh cho phép. Vui lòng không đăng quá 4 ảnh';
//     case NOT_ENOUGHT_COINS:
//       return 'Bạn không đủ coins. Vui lòng nạp thêm coins để tiếp tục';
//     default:
//       return 'Vui lòng kiểm tra kết nối internet';
//   }
// };

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

export const formatDateTime = (type: DATE_TIME_FORMAT, date: Date): string => {
  return dayjs(date).format(type);
};

export function formatNumber(number: string): string {
  if (!number || number === 'NaN' || parseInt(number) < 0) {
    return '0';
  }
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export async function selectFile(): Promise<DocumentPickerResponse | null> {
  try {
    const file = await DocumentPicker.pickSingle({
      type: [
        DocumentPicker.types.images,
        DocumentPicker.types.pdf,
        DocumentPicker.types.doc,
        DocumentPicker.types.docx,
        DocumentPicker.types.ppt,
        DocumentPicker.types.pptx,
        DocumentPicker.types.xls,
        DocumentPicker.types.xlsx,
        DocumentPicker.types.plainText,
        DocumentPicker.types.zip,
        DocumentPicker.types.audio,
        DocumentPicker.types.video
      ]
    });

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size && file.size > MAX_FILE_SIZE) {
      Alert.alert('Lỗi', 'Kích thước file không được vượt quá 10MB');
      return null;
    }

    return file;
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      return null;
    } else {
      throw error;
    }
  }
}


export function calculateDateAfterWeeks(startDate: string | Date, weeks: number): Date | null {
  if (!startDate || typeof weeks !== 'number' || weeks <= 0) {
    Alert.alert('Error', 'Vui lòng nhập đúng định dạng ngày và số tuần lớn hơn 0');
    return null;
  }

  const resultDate = dayjs(startDate).add(weeks * 7, 'day');
  return resultDate.toDate();
}

export function getTypeOfFile(type: string): string {
  const res = type.split('/').pop()?.toLowerCase();
  return res || '';
}
