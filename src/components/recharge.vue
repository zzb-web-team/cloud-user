<template>
	<div class="pay_dia_con">
		<el-dialog
			:visible.sync="dialogVisible"
			width="55%"
			:before-close="handleClose"
			center
		>
			<ol>
				<li class="title_text">
					<p>交易单号：{{ order_id }}</p>
					<p>商品名称：按量计费，充值钱包业务</p>
					<p>交易金额：￥{{ money }}</p>
				</li>
				<!-- <li>
					<div class="item_title">支付方式:</div>
					<div class="pay_type_cell">
						<el-radio
							v-model="pay_type"
							label="1"
							border
							size="small"
						>
							<img src="../assets/img/weixin.png" alt=""/>
							&nbsp;&nbsp;微信支付&nbsp;&nbsp;
							<img
								class="check_img"
								v-if="pay_type == 1"
								src="../assets/img/xsjiao.png"
								alt=""
						/></el-radio>

						<el-radio
							v-model="pay_type"
							label="2"
							border
							size="small"
							><img
								src="../assets/img/zhifubao.png"
								alt=""/>&nbsp;支付宝支付<img
								class="check_img"
								v-if="pay_type == 2"
								src="../assets/img/xsjiao.png"
								alt=""
						/></el-radio>
					</div>
				</li> -->
				<li class="bottom_img" v-if="pay_type == 1">
					<div>
						<p class="money_text">{{ money.toFixed(2) }}</p>
						<img src="../assets/img/er259.png" alt="" />
						<p>打开手机微信，扫码支付</p>
					</div>
					<div><img src="../assets/img/er260.png" alt="" /></div>
				</li>
				<li class="bottom_img" v-if="pay_type == 2">
					<div>
						<p class="money_text">{{ money.toFixed(2) }}</p>
						<img src="../assets/img/er259.png" alt="" />
						<p class="zhifubao">打开手机支付宝，扫码支付</p>
					</div>
					<div><img src="../assets/img/er260.png" alt="" /></div>
				</li>
				<li class="footer">
					<el-button>充值失败</el-button>
					<el-button @click="dialogVisible = false"
						>充值完成</el-button
					>
				</li>
			</ol>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			dialogVisible: false,
		};
	},
	props: {
		money: {
			type: Number,
			default: 0,
		},
		order_id: {
			type: String,
			default: '',
		},
		pay_type: {
			type: String,
			default: 1,
		},
	},
	methods: {
		handleClose(done) {
			this.$confirm('放弃支付？')
				.then((_) => {
					done();
				})
				.catch((_) => {});
		},
		show_dia() {
			this.dialogVisible = !this.dialogVisible;
		},
		go_order_detil() {
			this.$router.push({
				path: '/order_detil',
				query: { data: this.order_id },
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.pay_dia_con {
	.item_title {
		font-weight: 600;
		line-height: 20px;
		color: #333333;
	}
	.order_id {
		color: #333333;
	}
	li {
		margin: 20px 80px;
		span {
			color: darkgrey;
			margin-left: 5px;
		}
		.pay_type_cell {
			margin-top: 10px;
			margin-bottom: 20px;
		}
	}
	.footer {
		width: 50%;
		margin: auto;
		display: flex;
		justify-content: space-around;
	}
	.center_border {
		padding-bottom: 16px;
		border-bottom: 1px solid #dfdfdf;
		.yellow_money {
			font-size: 22px;
			color: #ee9415;
			margin: 0 10px;
		}
	}
	.bottom_img {
		display: flex;
		align-items: center;
		justify-content: center;
		div {
			text-align: center;
			width: auto;
			width: 80%;
			max-width: 300px;
			text-align: left;
			.money_text {
				margin-left: -10px;
				font-size: 26px;
				color: orangered;
				white-space: nowrap;
			}
		}
		div:first-child {
			width: 220px;
			text-align: center;
			margin-left: 10%;
		}
		img {
			width: 60%;
			height: 60%;
		}
		img:last-child {
			width: 100%;
			height: 100%;
		}
		div {
			p {
				text-align: center;
				// background-color: #00c800;
				font-size: 12px;
				color: #333333;
				padding: 5px 0;
			}
			// .zhifubao {
			// 	// background-color: #027aff;
			// 	// background-color: #00a0e9;
			// }
		}
	}
}
</style>
