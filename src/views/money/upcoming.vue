<template>
	<div class="traffic_detil" ref="box_rHeight">
		<div class="title_text">待办提醒</div>
		<div class="second_text">
			<div>
				<p>名称</p>
				<p>{{ title_data.name }}</p>
			</div>
			<div>
				<p>账单周期</p>
				<p>{{ title_data.cycle }}</p>
			</div>
			<div>
				<p>按量计费使用流量</p>
				<p>{{ title_data.use_flow }}</p>
			</div>
			<div>
				<p>总费用</p>
				<p>{{ title_data.total_cost }}</p>
			</div>
			<div>
				<p>欠费</p>
				<p>{{ title_data.arrears }}</p>
			</div>
			<div>
				<p>缴纳金额（单位：元）</p>
				<p>{{ title_data.ay_amount }}</p>
			</div>
		</div>
		<div class="bottom_btn">
			<p>
				应付金额 <span>￥ {{ title_data.ay_amount }}</span>
			</p>
			<el-button type="primary" @click="pay_money" size="mini"
				>去付款</el-button
			>
		</div>
		<PayDia
			ref="PayDialog"
			:money="title_data.ay_amount"
			:order_id="title_data.order_id"
			:order_data="title_data"
		></PayDia>
	</div>
</template>

<script>
import PayDia from '../../components/payment_panel';
import { mgmt_notify_payment } from '../../servers/api';
export default {
	data() {
		return {
			clientHeight: '',
			title_data: {
				name: '按量计费流量欠费',
				cycle: '2020年04月',
				use_flow: '6846GB',
				total_cost: 140.58,
				arrears: 140.58,
				ay_amount: 140.58,
				order_id: '',
			},
		};
	},
	components: {
		PayDia,
	},
	watch: {
		clientHeight() {
			//如果clientHeight 发生改变，这个函数就会运行
			this.changeFixed(this.clientHeight);
		},
	},
	mounted() {
		let that = this;
		that.clientHeight = `${document.documentElement.clientHeight ||
			document.documentElement.offsetHeight}`; //获取浏览器可视区域高度
		window.onresize = function() {
			that.clientHeight = `${document.documentElement.clientHeight ||
				document.documentElement.offsetHeight}`;
		};
		if (that.$refs.box_rHeight) {
			that.$refs.box_rHeight.style.height =
				that.clientHeight - 140 + 'px';
			that.$refs.box_rHeight.style.minHeight = 500 + 'px';
		}
	},
	methods: {
		pay_money() {
			// this.$refs.PayDialog.show_dia();
			let params = {
				order_id: this.title_data.order_id,
				pay_type: 1, //1:微信 2:支付宝
				pay_state: 1, //1:成功 2:异常
				pay_amount: this.title_data.ay_amount, //单位:元
			};
			this.success_payment(params);
		},
		//支付成功通知
		success_payment(data) {
			let params = {
				order_id: data.order_id,
				pay_type: data.pay_type, //1:微信 2:支付宝
				pay_state: 1, //1:成功 2:异常
				pay_amount: data.pay_amount, //单位:元
			};
			mgmt_notify_payment(params)
				.then((res) => {
					if (res.status == 0) {
						this.$message.success('支付成功');
					} else {
						this.$message.error(res.err_msg);
					}
				})
				.catch((error) => {});
		},
		//获取页码
		handleCurrentChange(pages) {
			this.pageNo = pages;
			this.onChanges();
		},
		handleSizeChange(pagesize) {
			this.pageSize = pagesize;
		},
		//查询屏幕高度自适应
		changeFixed(data) {
			if (this.$refs.box_rHeight) {
				this.$refs.box_rHeight.style.height = data - 140 + 'px';
				this.$refs.box_rHeight.style.minHeight = 500 + 'px';
			}
		},
		// 表头样式设置
		headClass() {
			return 'text-align: center;background:#E8F3FF;';
		},
		// 表格样式设置
		rowClass() {
			return 'text-align: center;';
		},
	},
};
</script>

<style lang="scss" scoped>
.traffic_detil {
	box-sizing: border-box;
	padding: 36px;
	margin: 36px;
	background-color: #fff;
	text-align: left;
	box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
	.title_text {
		margin-bottom: 40px;
        font-weight: 500;font-size: 16px;
	}
	.second_text {
		display: flex;
		justify-content: space-around;
		align-items: center;

		padding: 5px 0;
		margin-bottom: -4px;
		div {
			width: 100%;
			height: 100%;
			text-align: center;
			p {
				padding: 12.5px 0;
				border: 1px solid #e3e6ed;
				margin: 0 0 -1px -1px;
			}
			p:first-child {
				background: rgb(232, 243, 255);
				height: 50px;
				line-height: 28px;
			}
		}
	}
	.bottom_btn {
		margin-top: 30px;
		text-align: left;
		margin-left: 40px;
		p {
			margin-bottom: 20px;
			span {
				font-size: 20px;
				font-weight: 600;
				margin-left: 10px;
			}
		}
	}
}
</style>
