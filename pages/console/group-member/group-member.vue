<template>
	<view>
		<TopBar left-icon="left" :title="title" @back="back"></TopBar>
		<view style="display: flex;flex-wrap: wrap;padding: 0 10px">
			<view style="margin: 10px" v-for="(item,key) in store.groupMember[store.operateUsername]" :key="key">
				<image style="width: 40px; height: 40px;" :src="item.avatar"></image>
				<view style="font-size: 12px; width: 40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
					{{item.nickname}}
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import TopBar from '@/components/TopBar.vue'
	import {
		computed
	} from "vue";
	import {
		userStore
	} from '@/store/userStore';
	const store = userStore()
	const title = computed(() => {
		const num = Object.keys(store.groupMember[store.operateUsername]).length
		return `群成员（${num}）`
	})
	const back = () => {
		uni.navigateBack({
			delta: 1
		})
	}
</script>

<style>

</style>