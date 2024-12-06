/* eslint-disable no-unused-vars */
export const baseUrl: string = 'http://157.66.24.126:8080';

export enum AuthAPi {
  LOGIN = '/it4788/login',
  SIGNUP = '/it4788/signup',
  LOGOUT = '/it4788/logout',
  CHANGEPASSWORD = '/it4788/change_password',
  GETVERIFYTOKEN = '/it4788/get_verify_code',
  CHECKVERIFYTOKEN = '/it4788/check_verify_code',
  RESETPASSWORD = '/reset_password',
  CHECK_EMAIL = '/check_email'
}

export enum ProfileApi {
  CHANGE_PROFILE_AFTER_SIGNUP = '/it4788/change_profile_after_signup',
  GET_USER_INFO = '/it4788/get_user_info',
  SET_USER_INFO = '/set_user_info'
}

export enum PostApi {
  ADD_POST = '/add_post',
  GET_POST = '/get_post',
  GET_LIST_POSTS = '/get_list_posts',
  EDIT_POST = '/edit_post',
  GET_LIST_VIDEOS = '/get_list_videos',
  DELETE_POST = '/delete_post',
  REPORT_POST = '/report_post',
  GET_NEW_POSTS = '/get_new_posts',
  SET_VIEWED_POST = '/set_viewed_post'
}

export enum SearchApi {
  SEARCH = '/search',
  GET_SAVE_SEARCH = '/get_saved_search',
  DEL_SAVE_SEARCH = '/del_saved_search',
  SEARCH_USER = '/search_user'
}

export enum FriendApi {
  GET_REQUESTED_FRIENDS = '/get_requested_friends',
  SET_REQUEST_FRIEND = '/set_request_friend',
  SET_ACCEPT_FRIEND = '/set_accept_friend',
  GET_USER_FRIENDS = '/get_user_friends',
  GET_SUGGESTED_FRIENDS = '/get_suggested_friends',
  UNFRIEND = '/unfriend',
  DEL_REQUEST_FRIEND = '/del_request_friend'
}

export enum BlockApi {
  GET_LIST_BLOCKS = '/get_list_blocks',
  SET_BLOCK = '/set_block',
  UN_BLOCK = '/unblock'
}

export enum SettingsApi {
  SET_DEVTOKEN = '/set_devtoken',
  BUY_COINS = 'buy_coins',
  GET_PUSH_SETTINGS = '/get_push_settings',
  SET_PUSH_SETTINGS = '/set_push_settings'
}

export enum CommentApi {
  GET_MARK_COMMENT = '/get_mark_comment',
  SET_MARK_COMMENT = '/set_mark_comment',
  FEEL = '/feel',
  GET_LIST_FEELS = '/get_list_feels',
  DELETE_FEEL = '/delete_feel'
}

export enum NotificationApi {
  SEND_NOTIFICATIONS = '/it5023e/send_notification',
  GET_NOTIFICATIONS = '/it5023e/get_notifications',
  MARK_NOTIFICATION_AS_READ = '/it5023e/mark_notification_as_read',
  GET_UNREAD_NOTIFICATION_COUNT = '/it5023e/get_unread_notification_count'
}
export enum MessageApi {
  GET_LIST_CONVERSATIONS = '/it5023e/get_list_conversation',
  GET_CONVERSATION = '/it5023e/get_conversation',
  DELETE_MESSAGE = '/it5023e/delete_message'
}

export enum ClassApi {
  CREATE_CLASS = '/it5023e/create_class',
  GET_CLASS = '/it5023e/get_class_info',
  GET_CLASS_LIST = '/it5023e/get_class_list',
  EDIT_CLASS = '/it5023e/edit_class',
  DELETE_CLASS = '/it5023e/delete_class',
  GET_CLASS_DETAIL = '/it5023e/get_class_detail',
  REGISTER_CLASS = '/it5023e/register_class',
  GET_BASIC_CLASS_INFO = '/it5023e/get_basic_class_info',
  GET_CLASS_OPEN = '/it5023e/get_open_classes',
  FILTER_CLASS_OPEN = '/it5023e/get_classes_by_filter',
  SEARCH_ACCOUNT = '/it5023e/search_account',
  ADD_STUDENT_TO_CLASS = '/it5023e/add_student',
  GET_USER_INFOR = '/it4788/get_user_info'
}

export enum SurveyApi {
  CREATE_SURVEY = '/it5023e/create_survey',
  GET_ALL_SURVEYS = '/it5023e/get_all_surveys',
  EDIT_SURVEY = '/it5023e/edit_survey',
  DELETE_SURVEY = '/it5023e/delete_survey',
  GET_SURVEY_RESPONSE = '/it5023e/get_survey_response',
  GET_SUBMISSION = '/it5023e/get_submission',
  SUBMIT_SURVEY = '/it5023e/submit_survey',
  GET_STUDENT_ASSIGNMENTS = '/it5023e/get_student_assignments'
}

export enum MaterialApi {
  UPLOAD_MATERIAL = '/it5023e/upload_material',
  GET_MATERIAL_INFO = '/it5023e/get_material_info',
  GET_MATERIAL_LIST = '/it5023e/get_material_list',
  EDIT_MATERIAL = '/it5023e/edit_material',
  DELETE_MATERIAL = '/it5023e/delete_material'
}

export enum AbsenceApi {
  REQUEST_ABSENCE = '/it5023e/request_absence',
  GET_ABSENCE_REQUESTS = '/it5023e/get_absence_requests',
  REVIEW_ABSENCE_REQUEST = '/it5023e/review_absence_request',
  GET_STUDENT_ABSENCE_REQUESTS = '/it5023e/get_student_absence_requests'
}
export enum AttendanceApi {
  TAKE_ATTENDANCE = '/it5023e/take_attendance',
  GET_ATTENDANCE_LIST = '/it5023e/get_attendance_list',
  GET_ATTENDANCE_RECORD = '/it5023e/get_attendance_record',
  SET_ATTENDANCE_STATUS = '/it5023e/set_attendance_status',
  GET_DATE_ATTENDACE = '/it5023e/get_attendance_dates'
}
