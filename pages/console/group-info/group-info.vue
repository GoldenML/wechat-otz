<template>
	<view>
		<TopBar left-icon="left" :title="title" @back="back"></TopBar>
		<view style="display: flex;flex-wrap: wrap;padding: 0 10px">
			<view style="margin: 10px" v-for="(item,key) in obj" :key="key">
				<image style="width: 40px; height: 40px;" :src="item.avatar"></image>
				<view style="font-size: 12px; width: 40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
					{{item.nickname}}
				</view>
			</view>
			<view style="margin: 10px">
				<image @click="plusMember" style="width: 40px; height: 40px;" src="./plus.png"></image>
			</view>
			<view style="margin: 10px">
				<image @click="minusMember" style="width: 40px; height: 40px;" src="./minus.png"></image>
			</view>
			
		</view>
		<view v-if="showMore" @click="showMoreMember" style="text-align: center;font-size: 14px;margin-top: 10px">查看更多群成员<uni-icons type="forward" size="14"></uni-icons>
		</view>
		<view style="padding: 20px 10px">
			<uni-forms ref="baseForm" :modelValue="groupForm" :label-width="80">
				<uni-forms-item label="群聊名称" required>
					<uni-easyinput disabled v-model="groupForm.groupName" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item label="群简介" required>
					<uni-easyinput disabled v-model="groupForm.groupIntro" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item label="群公告" required>
					<uni-easyinput disabled v-model="groupForm.groupNotice" placeholder="请输入姓名" />
				</uni-forms-item>
			</uni-forms>
		</view>
	</view>
</template>

<script setup>
	import TopBar from '@/components/TopBar.vue'
	import {
		computed,
		onMounted,
		reactive,
		ref,
		toRefs,
		watch
	} from "vue";
	import {
		userStore
	} from '@/store/userStore';
	import _ from 'lodash';
	import {
		post
	} from '@/utils/request';
	import ApiPath from '@/common/ApiPath.js'
	const store = userStore()
	const keys = ref([])
	const title = computed(() => {
		return `聊天信息（${keys.value.length}）`
	})
	const showMore = ref(false)
	const obj = ref({})
	const groupForm = reactive({
		groupName: '',
		groupIntro: '',
		groupNotice: ''
	})
	const {
		groupName,
		groupIntro,
		groupNotice
	} = toRefs((groupForm))
	onMounted(async () => {
		handleShowMember()
		const res = await post(ApiPath.USER_GROUP_GET_INFO, {
			group_id: store.operateUsername
		})
		if (res.code === 0) {
			groupName.value = res.group_info.group_name
			groupIntro.value = res.group_info.group_intro
			groupNotice.value = res.group_info.group_notice
		}
	})
	watch(() => store.groupMember[store.operateUsername], () => {
		handleShowMember()
	}, {
		deep: true
	})
	const handleShowMember = () => {
		keys.value = Object.keys(store.groupMember[store.operateUsername])
		if (keys.value.length > 15) {
			showMore.value = true
			const arr = keys.value.slice(0, 15)
			arr.forEach(v => {
				obj.value[v] = store.groupMember[store.operateUsername][v]
			})
		} else {
			obj.value = _.cloneDeep(store.groupMember[store.operateUsername])
		}
	}
	const back = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	const showMoreMember = () => {
		uni.navigateTo({
			url: '/pages/console/group-member/group-member'
		})
	}
	const plusMember = () => {
		uni.navigateTo({
			url: '/pages/console/plus-member/plus-member'
		})
	}
	const minusMember = () => {
		uni.navigateTo({
			url: '/pages/console/minus-member/minus-member'
		})
	}
</script>

<style>
</style>