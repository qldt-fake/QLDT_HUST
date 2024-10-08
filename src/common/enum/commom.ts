/* eslint-disable no-unused-vars */
export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other'
}

export enum NotificationType {
  FriendRequest = '1',
  FriendAccepted = '2',
  PostAdded = '3',
  PostUpdated = '4',
  PostFelt = '5',
  PostMarked = '6',
  MarkCommented = '7',
  VideoAdded = '8',
  PostCommented = '9'
}

export enum AccountStatus {
  Pending = '-1',
  Inactive = '0',
  Active = '1',
  Banned = '2'
}

export enum CategoryType {
  Posts = 0,
  Friends = 1,
  Videos = 2,
  Notifications = 3,
  Settings = 4
}

export const Costs = {
  createPost: 10,
  editPost: 10,
  deletePost: 10,
  createMark: 2,
  createFeel: 1
};

export enum DevTokenType {
  Android = 1,
  Ios = 0
}

export enum FeelType {
  Kudos = 1,
  Disappointed = 0
}

export enum MarkType {
  Trust = 1,
  Fake = 0
}

export enum VerifyCodeStatus {
  Inactive = 0,
  Active = 1
}

export enum ExistedEmail {
  IsExisted = '1',
  IsNotExisted = '0'
}

export enum GroupType {
  NavigationScreen = '1',
  UnNavigationScreen = '0'
}

export enum ReadNotification {
  Read = '1',
  UnRead = '0'
}

export enum booleanReponse {
  False = '0',
  True = '1'
}
