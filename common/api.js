import Request from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'
let post = new Request().post
export default {
    login: function(data){
		return post(ApiPath.USER_LOGIN, data)
	},
	getCode: function(data){
		return post(ApiPath.SEND_VERIFY_CODE, data)
	},
	getLoginStatus: function(data = {}){
		return post(ApiPath.USER_LOGIN_STATUS, data)
	},
	getMsgs: function(data){
		return post(ApiPath.USER_GET_MSGS, data)
	},
	getFriends: function(data){
		return post(ApiPath.USER_GET_FRIEND, data)
	}
	
}