<template>
	<div class="change_billing" ref="box_rHeight">
		<div class="top_title">概览 > 变更计费方式</div>
		<div class="second_title">变更配置</div>
		<ol class="detailed_table">
			<li class="header">
				<div>当前配置</div>
				<div>变更后</div>
			</li>
			<li>
				<div>
					计费方式：<span>{{
						tableData.current_billing_method
					}}</span>
				</div>
				<div>
					计费方式：<span>{{ tableData.billing_method }}</span>
				</div>
			</li>
			<li>
				<div>
					结算方式：<span>{{
						tableData.current_settlement_method
					}}</span>
				</div>
				<div>
					结算方式：<span>{{ tableData.settlement_method }}</span>
				</div>
			</li>
			<li class="footer">
				<div>注意事项：{{ tableData.current_precautions }}</div>
				<div>注意事项：{{ tableData.precautions }}</div>
			</li>
		</ol>
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
					>确定</el-button
				>
			</div>
		</div>
	</div>
</template>
<script>
import { change_chargetype } from '../../servers/api';
export default {
	data() {
		return {
			clientHeight: '',
			tableData: {
				current_billing_method: '按量计费',
				billing_method: '流量包',
				current_settlement_method: '月结',
				settlement_method: '用完即止',
				current_precautions:
					' 1.计费方式变更，变更须从次日00:00开始计算，当天所使用的流量计费方式还是采用未变更前计费方式；2.计费方式变更后，须将未结算账单计时结算以免意向后期使用；',
				precautions: '--',
			},
			change_table_data: {
				current_billing_method: '流量包',
				billing_method: '按量计费',
				current_settlement_method: '用完即止',
				settlement_method: '月结',
				current_precautions: '--',
				precautions:
					' 1.计费方式变更，变更须从次日00:00开始计算，当天所使用的流量计费方式还是采用未变更前计费方式；2.计费方式变更后，须将未结算账单计时结算以免意向后期使用；',
			},
			pay_checked: false,
			user_id: JSON.parse(sessionStorage.getItem('id')),
			charge_type: 1,
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
		this.charge_type = this.$route.query.type;
		if (this.charge_type != 3) {
			this.tableData = this.change_table_data;
		}
	},
	methods: {
		pay_money() {
			if (this.pay_checked == false) {
				this.$alert('请勾选《点播加速服务协议》', '提示', {
					confirmButtonText: '确定',
					callback: (action) => {},
				});
				return false;
			}
			let params = {
				user_id: this.user_id,
				charge_type: this.charge_type != 3 ? 1 : 3, //1:流量包计费 2:流量计费(日结) 3:流量计费(月结)
			};
			change_chargetype(params)
				.then((res) => {
					if (res.status == 0) {
						this.$message.success({
							message: '变更收费方式成功',
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
ol {
	list-style: none;
}
.change_billing {
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
	.detailed_table {
		// width: 100%;

		li {
			display: flex;
			align-items: center;
			border-collapse: collapse;
			div {
				width: 100%;
				height: auto;
				min-height: 60px;
				border-bottom: 1px solid #cecece;
				border-right: 1px solid #cecece;
				box-sizing: border-box;
				padding: 10px 20px;
				display: flex;
				align-items: center;
				span {
					color: #f59a23;
				}
			}
			div:first-child {
				border-left: 1px solid #cecece;
			}
		}
		.header {
			background-color: #f2f2f2;
			text-align: center;
			div {
				border-top: 1px solid #cecece;
				text-align: center;
			}
		}
		.footer {
			div {
				height: 150px;
			}
		}
	}
	.parameter_item {
		display: flex;
		justify-content: start;
		align-items: center;
		margin-top: 40px;
		span {
			width: 20px;
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
