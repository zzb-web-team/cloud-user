<template>
	<div class="myradio">
		<el-radio-group v-model="radio" @change="settime()" size="small">
			<el-radio-button
				v-for="(item, index) in list"
				:label="item.label"
				:key="index"
				>{{ item.text }}</el-radio-button
			>
		</el-radio-group>
	</div>
</template>

<script>
export default {
	data() {
		return {
			radio: '1',
			list: [
				{
					label: '1',
					text: '使用流量',
				},
				{
					label: '2',
					text: '使用带宽',
				},
				{
					label: '3',
					text: '存储空间',
				},
			],
		};
	},
	props: {
		typelist: Array,
	},
	mounted() {
		if (this.typelist) {
			this.list = this.typelist;
		}
	},
	methods: {
		settime() {
			this.$emit('settab', this.radio);
		},
		setRadio(data) {
			this.radio = '1';
		},
	},
};
</script>

<style lang="scss" scoped>
.myradio {
	margin-top: 2px;
}
/deep/.myradio .el-radio-group {
	display: table;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	overflow: hidden;
	width: 221px;
}
/deep/.myradio .el-radio-button .el-radio-button__inner {
	border: none;
	box-shadow: none;
	padding: 9px 0;
	overflow: hidden;
	white-space: nowrap;
	width: 73px;
	text-overflow: ellipsis;
}

/deep/.myradio .is-active .el-radio-button__inner {
	border: #297aff 1px solid;
	color: #297aff;
	background-color: #e8f1ff;
	border-radius: 4px;
}
/deep/.el-radio-button--medium .el-radio-button__inner {
	padding: 9px 20px;
}
</style>
