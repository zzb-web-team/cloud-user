<template>
	<div class="modal_content" v-if="isShow" :class="transion ? ds : ''">
		<i
			class="el-icon-upload2 quan"
			@click="set_pop_height"
			v-if="!transion"
		></i>
		<i
			class="el-icon-download quan"
			@click="set_pop_height"
			v-if="transion"
		></i>
		<i class="el-icon-close close_btn" @click="hide"></i>
		<div class="title">{{ con_text.name }}</div>
		<div v-html="con_text.con" class="content"></div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			isShow: false,
			transion: false,
			ds: 'ds',
		};
	},
	props: {
		con_text: {
			type: Object,
			default: '',
		},
	},
	components: {},
	filters: {},
	watch: {},
	computed: {},
	created() {},
	mounted() {},
	methods: {
		set_pop_height() {
			this.transion = !this.transion;
		},
		// 调用show方法展示
		show() {
			this.isShow = true;
		},
		// 消失后移除自身所占资源
		hide() {
			this.isShow = false;
		},
	},
};
</script>
<style lang="scss" scoped>
.modal_content {
	position: fixed;
	bottom: 10px;
	right: 25px;
	margin-left: -25%;
	width: 460px;
	height: 720px;
	min-width: 31.125rem;
	min-height: 18.625rem;
	border-radius: 8px;
	background-color: #ffffff;
	z-index: 2;
	box-sizing: border-box;
	padding: 20px;
	box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
	overflow: hidden;
	.close_btn {
		font-size: 20px;
		font-weight: 600;
		position: absolute;
		right: 10px;
		top: 10px;
		background: rgb(252, 112, 112);
		border-radius: 8px;
		padding: 3px;
	}
	.quan {
		font-size: 20px;
		font-weight: 600;
		position: absolute;
		right: 50px;
		top: 10px;
		background: rgb(164, 196, 255);
		border-radius: 8px;
		padding: 3px;
	}
	.title {
		text-align: center;
		font-size: 14px;
		font-weight: bold;
		margin-bottom: 20px;
	}
	.content {
		height: 630px;
		text-align: left;
		line-height: 32px;
		overflow-y: scroll;
		box-sizing: border-box;
		padding: 20px;
		margin-bottom: 40px;
	}
	.content::-webkit-scrollbar {
		display: none;
	}
}
.ds {
    height: 80%;
    width: 35%;
	.content {
		height: 92%;
	}
}
</style>
