/* eslint-disable no-unused-vars */
export enum AuthAPi {
  LOGIN = '/login',
  SIGNUP = '/signup',
  LOGOUT = '/logout',
  CHANGEPASSWORD = '/change_password',
  GETVERIFYTOKEN = '/get_verify_code',
  CHECKVERIFYTOKEN = '/check_verify_code',
  RESETPASSWORD = '/reset_password',
  CHECK_EMAIL = '/check_email'
}

export enum ProfileApi {
  CHANGE_PROFILE_AFTER_SIGNUP = '/change_profile_after_signup',
  GET_USER_INFO = '/get_user_info',
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
  CHECK_NEW_iTEMS = '/check_new_items',
  GET_NOTIFICATION = '/get_notification'
}
