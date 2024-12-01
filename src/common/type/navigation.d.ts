import { RegisterClass } from 'src/screens/classes/general/RegisterClass';
import { SubmitSurvey } from 'src/screens/classes/Survey/SubmitSurvey';
/* eslint-disable no-unused-vars */
type AppNavigationType = {
  AuthNavigation: { screen: AuthNavigationName };
  TabNavigation: { screen: TabNavigationName };
  SettingNavigation: { screen: SettingNavigationName };
  FriendNavigation: { screen: FriendNavigationName };
  ProfileNavigation:
  | { screen: ProfileNavigationName.Profile }
  | {
    screen: ProfileNavigationName.SettingProfile;
    params: { user_id: number; username?: string };
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
  NotificationNavigation: {
    screen: NotificationNavigationName;
    params: {
      title: string;
      content: string;
    };
  };
  MessageNavigation: {
    screen: MessageNavigationName;
    params: {
      userId: any;
      userName: any;
    }
  }
};

type AuthNavigationType = {
  HomeAuth: undefined;
  Login: undefined;
  VerifyOTPScreen: { verifyCode: string; email: string; password: string };
  SaveInfoAccountScreen: { email: string; password: string };
  ForgetPasswordScreen: undefined;
  FirstScreen: undefined
  AccountLogin: {
    username: string;
    email: string;
    avatar: string;
  };
};

type PropfileNavigationType = {
  Profile: undefined;
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
type NotificationNavigationType = {
  NotificationDetail: {
    title: string;
    content: string;
  };
};
type MessageNavigationType = {
  MessageBox:{
    userId: any;
    userName: any;
  }
}
type HomeNavigationType = {
  Class: undefined;
};

type ClassNavigationType = {
  ClassDetail: { classId: string };
  EditClass: { classId: string };
  AddStudent: { token: string, class_id: string },
  GetStudentInfor: { account_id: string }
  RegisterClass: undefined;
  OthersTabInClass: { classId: string };
};


type SurveyNavigationType = {
  CreateSurvey: { classId: string };
  EditSurvey: {  id: string, title: string, description: string, deadline: string, file_url: string; classId: string };
  StudentAssignment: undefined;
  SubmitSurvey : { id: string, title: string, description: string, deadline: string, file_url: string }
  SubmissionList: { id: string };
  SubmissionDetail: { id: string, title: string, deadline: string, file_url: string, description: string, class_id: string, is_submitted: boolean },
  GradeSubmission: { assignment_id: string, submission_time: string, text_response: string, file_url: string, student_account: any, id: string }
}

type MaterialNavigationType = {
  EditMaterial: { materialId: string, classId: string },
  UploadMaterial: { classId: string }
}

type AbsenceNavigationType = {
  AllAbsenceRequestsForStudent: undefined;
  AbsenceRequest: { classId: string };
  ReviewAbsence: { request: any };
  AbsenceRequestList: { classId: string };
  AbsenceRequestDetail: { id: string, class_id: string, student_id: string, absence_date: string, reason: string, status: string }
}
