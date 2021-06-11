<template>
	<div class="pay_dia_con">
		<el-dialog
			:visible.sync="dialogVisible"
			width="35%"
			:before-close="handleClose"
			center
		>
			<ol>
				<li>
					<span class="item_title">商品订单:</span
					><span class="order_id">{{ order_id }}</span>
				</li>
				<li class="center_border">
					<span class="item_title">支付金额:</span>
					<span class="yellow_money">￥{{ money }}</span>
					<span @click="go_order_detil"
						>订单详情 <i class="el-icon-caret-bottom"></i
					></span>
				</li>
				<li>
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

						<!-- <el-radio v-model="pay_type" label="3" border
							><img
								src="../assets/img/QQ.png"
								alt=""/>&nbsp;QQ钱包支付<img
								class="check_img"
								v-if="pay_type == 3"
								src="../assets/img/xsjiao.png"
								alt=""
						/></el-radio>

						<el-radio v-model="pay_type" label="4" border>
							<img
								src="../assets/img/yinlian.png"
								alt=""/>&nbsp;&nbsp;网银支付&nbsp;&nbsp;
							<img
								class="check_img"
								v-if="pay_type == 4"
								src="../assets/img/xsjiao.png"
								alt=""
						/></el-radio> -->
					</div>
				</li>
				<li class="bottom_img" v-if="pay_type == 1">
					<div>
						<img src="../assets/img/er259.png" alt="" />
						<p>打开手机微信，扫码支付</p>
					</div>
					<div><img src="../assets/img/er260.png" alt="" /></div>
				</li>
				<li class="bottom_img" v-if="pay_type == 2">
					<div>
						<img src="../assets/img/er259.png" alt="" />
						<p class="zhifubao">打开手机支付宝，扫码支付</p>
					</div>
					<div><img src="../assets/img/er260.png" alt="" /></div>
				</li>
				<!-- <li class="bottom_img" v-if="pay_type == 3">
					<div>
						<img src="../assets/img/er259.png" alt="" />
						<p>打开QQ钱包，扫码支付</p>
					</div>
					<div><img src="../assets/img/er260.png" alt="" /></div>
				</li>
				<li class="bottom_img" v-if="pay_type == 4">
					<div>
						<img src="../assets/img/er259.png" alt="" />
						<p>请使用网银支付</p>
					</div>
					<div><img src="../assets/img/er260.png" alt="" /></div>
				</li> -->
			</ol>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			dialogVisible: false,
			pay_type: '1',
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
        detail_disabled:{
            type:Boolean,
            default:false
        },
		order_data: {
			type: Object,
			default: () => {
				return {};
			},
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
            if(this.detail_disabled==true) return false;
			this.$router.push({
				path: '/order_detil',
				query: { data: JSON.stringify(this.order_data) },
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
