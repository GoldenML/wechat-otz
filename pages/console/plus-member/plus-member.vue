<template>
	<view style="position: relative;">
		<TopBar left-icon="closeempty" title="选择联系人" @back="back"></TopBar>
	</view>
	<view style="position: relative; " :style="{height: height}">
		<uni-indexed-list label="nickname" value="username" :options="list" :show-select="true" @click="bindClick" />
	</view>
	<view style="position: absolute;right: 10px;bottom: 20px">
		<button @click="addGroupMember" type="primary" :disabled="selected.length === 0"
			style="font-size:14px; width: 80px">添 加</button>
	</view>
</template>

<script setup>
	import TopBar from '@/components/TopBar.vue'
	import {
		computed,
		getCurrentInstance,
		onMounted,
		ref
	} from "vue";
	import {
		userStore
	} from '@/store/userStore';
	import {
		post
	} from '@/utils/request';
	import ApiPath from '@/common/ApiPath.js'
	const {
		proxy
	} = getCurrentInstance()
	const store = userStore()
	const list = ref([])
	const selected = ref([])
	const height = ref(0)
	onMounted(() => {
		const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
		height.value = `calc(100vh - 60px - ${menuButtonInfo.height + 60}px)`
		const groupedFriends = store.friendInfos.reduce((acc, friend) => {
			if(store.groupMember[store.operateUsername][friend.username]) {
				return acc;
			}
			const firstLetter = friend.nickname.charAt(0).toUpperCase(); // 获取首字母并转为大写

			if (!acc[firstLetter]) {
				acc[firstLetter] = [];
			}
			
			acc[firstLetter].push(friend);
			return acc;
		}, {})
		console.log(333, groupedFriends);
		list.value = Object.keys(groupedFriends).map((letter) => ({
			letter: letter,
			data: groupedFriends[letter]
		}))
		proxy.$nextTick(() => {

		})
	})
	const bindClick = (v) => {
		selected.value = v.select
	}
	const back = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	const addGroupMember = () => {
		post(ApiPath.GROUP_ADD_USER, {
			group_id: store.operateUsername,
			member_usernames: selected.value.map(e => e.element.username)
		}).then(res => {
			if (res.code === 0) {
				back()
				post(ApiPath.USER_GROUP_GET_MEMBERS, {
					group_id: store.operateUsername,
				}).then(res1 => {
					if (res1.code === 0) {
						const obj = {
							[store.operateUsername]: {}
						}
						res1.members.forEach(v => {
							obj[store.operateUsername][v.username] = v
						})
						store.updateGroupMember(Object.assign(store.groupMember, obj))
					}
				})
			}
		})
	}
</script>

<style>

</style>