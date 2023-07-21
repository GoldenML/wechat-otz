<template>
	<view class="content" :style="{'margin-bottom': topHeight + 'px'}">
		<uni-nav-bar style="position: relative;" :style="{top: topHeight + 'px'}" dark :fixed="true" color="#000000" shadow :left-icon="leftIcon" :left-text="leftText"
			:background-color="backgroundColor" :border="false" :height="60" :title="title" @clickLeft="back" :stat="stat" >
			<view style="line-height:60px;margin: auto;" @click="clickTitle">
				{{title}}<view style="display: inline-block;" v-if="isGroup">（{{num}}）</view>
			</view>
		</uni-nav-bar>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref,
		computed,
		watch
	} from "vue";
	import {userStore} from '@/store/userStore'
	const topHeight = ref(0)
	const props = defineProps({
		title: String,
		backgroundColor: {
			type: String,
			default: "rgb(255, 255, 255)"
		},
		leftIcon: String,
		leftText: String,
		stat: Boolean,
		isGroup: Boolean
	})
	const store = userStore()
	const num = ref(0)
	const emits = defineEmits(['back', 'click-title'])
	defineExpose({
		topHeight
	})
	onMounted(() => {
		if(props.isGroup) {
			num.value = Object.keys(store.groupMember[store.operateUsername]).length
		}
		const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
		topHeight.value = menuButtonInfo.height
	})
	watch(() => store.groupMember[store.operateUsername], (value) => {
		num.value = Object.keys(value).length
	}, {
		deep: true
	})
	const back = () => {
		emits('back')
	}
	const clickTitle = () => {
		emits('click-title')
	}
</script>

<style lang="scss">
	.content{
		position: relative
	}
	::v-deep .uni-navbar--shadow {
		box-shadow: 0 1px 0px #ccc !important;
	} 
</style>