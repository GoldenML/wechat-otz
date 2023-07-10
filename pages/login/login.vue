<template>
	<view class="login-form">
		<view class="login-form__title">
			OTZ
		</view>
		<uni-forms :modelValue="form" ref="form">
			<uni-forms-item name="email">
				<uni-easyinput v-model="form.email" placeholder="请输入邮箱"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="code">
				<view style="width: 60%;display: inline-block;vertical-align: middle;">
					<uni-easyinput v-model="form.code" placeholder="请输入验证码" type="password">
					</uni-easyinput>
				</view>
				<view class="get-code">
					<view @click="getCode" v-if="counter === 0">
						获取验证码
					</view>
					<view v-else>
						剩余{{counter}}秒
					</view>
				</view>
			</uni-forms-item>
		</uni-forms>
		<view class="login-form__login">
			<button @click="login">登录</button>
		</view>

	</view>
</template>

<script setup>
	import {
		getCurrentInstance,
		onBeforeMount,
		onBeforeUnmount,
		onMounted,
		reactive,
		ref
	} from "vue";
	import {
		post
	} from '@/utils/request.js'
	import ApiPath from '@/common/ApiPath.js'
	const {
		proxy
	} = getCurrentInstance()
	const counter = ref(0)
	const form = reactive({
		email: '',
		code: ''
	})
	onMounted(() => {
		post(ApiPath.USER_LOGIN_STATUS, {}).then(res => {
			if (res.user_info) {
				uni.reLaunch({
					url: '/pages/console/console'
				})
			}
		})
	})
	const login = () => {
		post(ApiPath.USER_LOGIN, {
			login_type: 2,
			email: form.email,
			verify_code: form.code
		}).then(res => {
			if (res.code === 0) {
				uni.reLaunch({
					url: '/pages/console/console'
				})
			}
		})
	}
	const getCode = () => {
		
		post(ApiPath.SEND_VERIFY_CODE, {
			email: form.email,
		}).then(res => {
			if (res.code === 0) {
				counter.value = 60
				const timer = setInterval(() => {
					counter.value--
					if (counter.value === 0) {
						clearInterval(timer)
					}
				}, 1000)
			}
		})
	}
</script>

<style lang="scss">
	.login-form {
		position: absolute;
		left: 50%;
		top: 40%;
		width: 80%;
		transform: translate(-50%, -50%);

		&__title {
			text-align: center;
			margin-bottom: 50px;
			font-size: 30px;
		}

		&__login {
			margin-top: 50px;
		}

		.get-code {
			width: 35%;
			margin-left: 10px;
			display: inline-block;
			border: 1px solid gray;
			line-height: 32px;
			text-align: center;
			cursor: pointer;
		}
	}
</style>