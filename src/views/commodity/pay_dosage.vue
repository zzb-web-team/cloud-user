<template>
	<div class="pay_dosage" ref="box_rHeight">
		<div class="top_title">概览 > 流量包商城 > 按量计费包</div>
		<div class="second_title">
			当前配置
		</div>
		<div>
			<div class="parameter_item">
				<span>计费方式</span>
				<div>
					<el-radio
						v-model="valid_period"
						label="one"
						border
						size="small"
					>
						按流量计费</el-radio
					>
				</div>
			</div>
			<div class="parameter_item">
				<span>结算方式</span>
				<div class="item_radio">
					<el-radio
						v-model="pay_type"
						:label="item.id"
						border
						size="small"
						@change="change_paraer(item, index)"
						v-for="(item, index) in parameter_list"
						:key="index"
						v-bind:class="[index == 0 ? activeClass : '']"
					>
						{{ item.name }}</el-radio
					>
				</div>
			</div>
			<div class="parameter_item">
				<span>服务协议</span>
				<div>
					<el-checkbox v-model="checked"
						><span class="link_text"
							>点播加速服务协议</span
						></el-checkbox
					>
				</div>
			</div>
			<div class="parameter_item bottom_item">
				<span></span>
				<div>
					<el-checkbox v-model="pay_checked"
						>我已阅读并同意<span class="link_text"
							>《点播加速服务协议》</span
						></el-checkbox
					>
				</div>
			</div>
			<div class="parameter_item bottom_item_btn">
				<span></span>
				<div>
					<el-button
						type="primary"
						class="pay_btn"
						size="samll"
						@click="pay_money"
						>立即开通</el-button
					>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { setup_flowcharge } from '../../servers/api';
export default {
	data() {
		return {
			user_id: JSON.parse(sessionStorage.getItem('id')),
			clientHeight: '',
			activeClass: 'activeClass',
			valid_period: 'one',
			parameter_list: [
				// {
				// 	id: 1,
				// 	name: '按日结',
				// },
				{
					id: 2,
					name: '按月结',
				},
			],
			pay_type: 2,
			checked: false,
			pay_checked: false,
		};
	},
	components: {},
	filters: {},
	watch: {
		clientHeight() {
			//如果clientHeight 发生改变，这个函数就会运行
			this.changeFixed(this.clientHeight);
		},
	},
	created() {},
	mounted() {
		let that = this;
		that.clientHeight = `${document.documentElement.clientHeight ||
			document.documentElement.offsetHeight}`; //获取浏览器可视区域高度
		window.onresize = function() {
			that.clientHeight = `${document.documentElement.clientHeight ||
				document.documentElement.offsetHeight}`;
		};
	},
	methods: {
		//切换流量包
		change_paraer(data, index) {},
		pay_money() {
			if (this.checked == false) {
				this.$alert('请勾选服务协议', '提示', {
					confirmButtonText: '确定',
					callback: (action) => {},
				});
				return false;
			}
			if (this.pay_checked == false) {
				this.$alert('请勾选《点播加速服务协议》', '提示', {
					confirmButtonText: '确定',
					callback: (action) => {},
				});
				return false;
			}
			let params = {
				user_id: this.user_id,
				// flowcharge_type: this.pay_type, //1:启用加速 2:停用加速
			};
			setup_flowcharge(params)
				.then((res) => {
					if (res.status == 0) {
						this.$message.success({
							message: '已开通按量计费',
							type: 'success',
						});
					}
				})
				.catch((error) => {});
		},
		//查询屏幕高度自适应
		changeFixed(data) {
			if (this.$refs.box_rHeight) {
				this.$refs.box_rHeight.style.height = data - 140 + 'px';
				this.$refs.box_rHeight.style.minHeight = 850 + 'px';
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.pay_dosage {
	background-color: #fff;
	text-align: left;
	box-sizing: border-box;
	padding: 36px;
	padding-top: 10px;
	margin: 36px;
	box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
	position: relative;
	.second_title {
		font-size: 16px;
		margin-top: 20px;
		margin-bottom: 30px;
	}
	.parameter_item {
		display: flex;
		justify-content: start;
		align-items: center;
		margin-top: 40px;
		margin-left: 80px;
		span {
			width: 100px;
			margin-right: 10px;
		}
		div {
			margin-left: 10px;
			.current_price {
				color: #ee9415;
				font-size: 26px;
				font-weight: 600;
				i {
					font-style: normal;
					font-weight: 500;
				}
			}
			.discount {
				color: #fff;
				background: #f85555;
				border-radius: 5px;
				box-sizing: border-box;
				padding: 5px 10px;
				font-size: 12px;
				box-shadow: 0px 6px 10px 0px rgba(239, 23, 23, 0.3);
			}
			.original_price {
				font-size: 14px;
				color: #999999;
				text-decoration: line-through;
			}
		}
		.item_radio {
			flex: 1;
			display: flex;
			flex-wrap: wrap;
			margin-bottom: -15px;
			margin-left: 0;
			.el-radio--small.is-bordered {
				margin-bottom: 15px;
				box-sizing: border-box;
				padding-left: 35px;
				padding-right: 45px;
			}
			.activeClass {
				margin-left: 10px;
			}
		}
		.link_text {
			color: dodgerblue;
		}
	}

	.bottom_item {
		position: absolute;
		bottom: 150px;
	}
	.bottom_item_btn {
		position: absolute;
		bottom: 80px;
	}
}
</style>
