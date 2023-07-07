
const getApi = function (path) {
  return `/otz/im/web_proxy/${path}`
}

const otz = {
  USER_LOGIN_STATUS: getApi('login_status'),
  SEND_VERIFY_CODE: getApi('verify_code'),
  USER_LOGIN: getApi('login'),
  USER_GET_INFO: getApi('get_user_info'),
  USER_GET_FRIEND: getApi('get_user_friends'),
  USER_ADD_FRIEND: getApi('add_friend'),
  USER_GET_MSGS: getApi('get_user_msgs'),
  USER_SEND_MSG: getApi('send_msg'),
  USER_ADD_HISTORY: getApi('add_friend_history'),
  USER_ADD_HANDLE: getApi('handle_add_friend'),
  USER_DELETE_FRIEND: getApi('delete_friend'),
  USER_LOGOUT: getApi('logout'),
  WS_CONNECT: getApi('sync_notify'),
  USER_CREATE_GROUP: getApi('create_group'),
  USER_GROUP_GET_INFO: getApi('get_group_info'),
  USER_GET_GROUP_LIST: getApi('get_user_group'),
  USER_GROUP_GET_MEMBERS: getApi('get_group_members'),
  USER_UPLOAD_FILE: getApi('upload_file'),
  USER_UPDATE: getApi('update_user_info'),
  GROUP_ADD_USER: getApi('add_group_member'),
  GROUP_REMOVE_USER: getApi('remove_group_member'),
  GROUP_UPDATE_INFO: getApi('update_group_info')
}

export default otz
