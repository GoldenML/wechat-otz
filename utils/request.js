import operate from '../common/operate.js'
// vuex 的使用  详情参考官网 https://uniapp.dcloud.io/vue-vuex
import store from '../store/index.js'

export const post = (url, data, headers, other) => {
	let hideLoading = false
	if (!other?.hideToast && !hideLoading) {
		uni.showLoading({
			title: '加载中...'
		});
	}
	console.log('cookie===> ', wx.getStorageSync('cookie'));
	return new Promise((resolve, reject) => {
		uni.request({
			url: operate.api + url,
			data,
			method: 'POST',
			header: {
				'Content-Type': 'application/json;charset=UTF-8',
				Cookie: wx.getStorageSync('cookie'),
				...headers
			},
			success: (res) => {
				if (res.statusCode && res.statusCode != 200) {
					uni.showToast({
						title: "api错误" + res.errMsg,
						icon: 'none'
					});
					return;
				}
				if (res.header['Set-Cookie']) {
					wx.setStorageSync('cookie', res.header['Set-Cookie'])
				}
				resolve(res.data)
			},
			fail: (e) => {
				uni.showToast({
					title: "" + e.data.msg,
					icon: 'none'
				});
				resolve(e.data);
			},
			complete() {
				if (!hideLoading) {
					uni.hideLoading();
				}
				resolve();
				return;
			}
		})
	})
}