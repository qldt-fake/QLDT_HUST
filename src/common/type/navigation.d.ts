/* eslint-disable no-unused-vars */
type AppNavigationType = {
  AuthNavigation: { screen: AuthNavigationName };
  TabNavigation: { screen: TabNavigationName };
  SettingNavigation: { screen: SettingNavigationName };
  FriendNavigation: { screen: FriendNavigationName };
  ProfileNavigation:
    | { screen: ProfileNavigationName.Profile; params: { user_id: string } }
    | {
        screen: ProfileNavigationName.SettingProfile;
        params: { user_id: string; username: string };
      }
    | { screen: ProfileNavigationName.EditProfile };
  PostNavigation:
    | { screen: PostNavigationName; params?: { selectedItem?: CardData } }
    | { screen: PostNavigationName.ListImageDetail; params: { data: PostProps } }
    | { screen: PostNavigationName.EditPostScreen; params: { data: PostProps } }
    | {
        screen: PostNavigationName.ListImageEditScreen;
        params: {
          oldImage: { id: string; url: string }[];
          newImage: string[];
          newMediaFiles: MediaFileType[];
          listImage: string[];
          imageDel?: string[];
          onUpdate: (
            updateImageList: string[],
            updateNewMediaFiles: MediaFileType[],
            updateImageDel?: string[],
            updateOldImage?: { id: string; url: string }[],
            updateNewImage?: string[]
          ) => void;
        };
      }
    | {
        screen: PostNavigationName.ListImageScreen;
        params: {
          imageList: string[];
          mediaFiles: MediaFileType[];
          onUpdate: (updateImageList: string[], updateMediaFiles: MediaFileType[]) => void;
        };
      }
    | { screen: PostNavigationName.EnAScreen }
    | { screen: PostNavigationName.ListFeelScreen; params: { postId: string } }
    | { screen: PostNavigationName.AllPostDetail; params: { postId: string } };

  SearchNavigation: { screen: SearchNavigationName };
  ReportNavigation: {
    screen: ReportNavigationName;
    params: { id: string; username: string; userId: string };
  };
  ChatNavigation:
    | { screen: ChatNavigationName.InboxScreen; params: { contact: Contact } }
    | { screen: ChatNavigationName.InboxListScreen };
  VerifyOTPAfterLogin: undefined;
  ChangeProfileAfterSign: undefined;
  NotFoundScreen: undefined;
  AddMoneyNavigation: { screen: AddMoneyNavigationName };
};

type AuthNavigationType = {
  HomeAuth: undefined;
  Login: undefined;
  NameScreen: undefined;
  BirthdayScreen: { firstname: string; lastname: string };
  GenderScreen: { firstname: string; lastname: string };
  EmailScreen: { firstname: string; lastname: string; gender: Gender };
  PasswordScreen: { firstname: string; lastname: string; gender: Gender; email: string };
  ConfirmPolicyScreen: {
    firstname: string;
    lastname: string;
    dob: Date;
    gender: Gender;
    email: string;
    password: string;
  };
  VerifyOTPScreen: { verifyCode: string; email: string };
  SaveInfoAccountScreen: undefined;
  ForgetPasswordScreen: undefined;
  AccountLogin: {
    username: string;
    email: string;
    avatar: string;
  };
};

type PropfileNavigationType = {
  Profile: { user_id: string };
  EditProfile: undefined;
  SettingProfile: { user_id: string; username: string };
};

type SettingNavigationType = {
  SettingScreen: undefined;
  SettingInfo: undefined;
  BlockFriendScreen: undefined;
  SettingNotification: undefined;
  SettingPassword: undefined;
  SettingPushNotification: undefined;
  SettingSecurityLogin: undefined;
  SettingInfoName: undefined;
  SearchUserScreen: undefined;
};

type FriendNavigationType = {
  SuggestionsScreen: undefined;
  AllFriendScreen: undefined;
};
type PostNavigationType = {
  CreatePostScreen: { selectedItem: CardData } | undefined;
  EnAScreen: undefined;
  ListImageScreen: {
    imageList: string[];
    mediaFiles: MediaFileType[];
    onUpdate: (updateImageList: string[], updateMediaFiles: MediaFileType[]) => void;
  };
  ListImageEditScreen: {
    oldImage: { id: string; url: string }[];
    newImage: string[];
    newMediaFiles: MediaFileType[];
    listImage: string[];
    imageDel?: string[];
    onUpdate: (
      updateImageList: string[],
      updateNewMediaFiles: MediaFileType[],
      updateImageDel?: string[],
      updateOldImage?: { id: string; url: string }[],
      updateNewImage?: string[]
    ) => void;
  };
  ListImageDetail: { data: PostProps };
  EditPostScreen: { data?: PostProps; selectedItem?: CardData };
  AllPostDetail: { postId: string };
};

type TabNavigationType = {
  Home: undefined;
  Video: undefined;
  Friend: undefined;
  Notification: undefined;
  Setting: undefined;
};

type SearchNavigationType = {
  SearchScreen: undefined;
};

type ChatNavigationType = {
  InboxScreen: undefined;
  InboxListScreen: undefined;
};
type AddMoneyNavigationType = {
  AddMoneyScreen: undefined;
};

type ReportNavigationType = {
  ReportScreen: { id: string; username: string; userId: string };
};
