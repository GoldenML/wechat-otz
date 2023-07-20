<template>
	<view class="content" :style="{'margin-bottom': topHeight + 'px'}">
		<uni-nav-bar style="position: relative;" :style="{top: topHeight + 'px'}" dark :fixed="true" color="#000000" shadow :left-icon="leftIcon" :left-text="leftText"
			:background-color="backgroundColor" :border="false" :height="60" :title="title" @clickLeft="back" />
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from "vue";
	const topHeight = ref(0)
	const props = defineProps({
		title: String,
		backgroundColor: {
			type: String,
			default: "rgb(255, 255, 255)"
		},
		leftIcon: String,
		leftText: String,
	})
	const emits = defineEmits(['back'])
	defineExpose({
		topHeight
	})
	onMounted(() => {
		const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
		topHeight.value = menuButtonInfo.height
	})
	const back = () => {
		emits('back')
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