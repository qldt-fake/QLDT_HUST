import {
  setGenericPassword,
  getGenericPassword,
  resetGenericPassword,
  UserCredentials
} from 'react-native-keychain';

export const saveTokenIntoKeychain = async (key: string, token: string) =>
  setGenericPassword(key, token);

export const getTokenFromKeychain = async () => {
  const credentials = (await getGenericPassword()) as UserCredentials;
  return credentials?.password;
};
export const deleteTokenFromKeychain = async () => resetGenericPassword();
