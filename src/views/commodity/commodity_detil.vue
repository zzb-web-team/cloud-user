<template>
	<div class="commodity_detil" ref="box_rHeight">
		<div class="top_title">概览 > 流量包商城 > 购买流量信息</div>
		<div class="second_title">点播加速流量包</div>
		<div class="parameter_title">基本配置</div>
		<div>
			<div class="parameter_item">
				<span>加速流量包</span>
				<div class="item_radio">
					<el-radio
						v-model="pay_type"
						:label="item.product_id"
						border
						size="small"
						@change="change_paraer(item, index)"
						v-for="(item, index) in parameter_list"
						:key="item.product_id"
						v-bind:class="[index == 0 ? activeClass : '']"
					>
						{{ item.product_name }}</el-radio
					>
				</div>
			</div>
			<div class="parameter_item">
				<span>有效期</span>
				<div>
					<el-radio
						v-model="valid_period"
						label="one"
						border
						size="small"
						disabled
					>
						一年有效期</el-radio
					>
				</div>
			</div>
			<div class="parameter_item">
				<span>购买数量</span>
				<div>
					<el-input-number
						v-model="num"
						@change="handleChange"
						:min="1"
						:max="10"
						label="描述文字"
						size="mini"
					></el-input-number>
				</div>
			</div>
			<div class="parameter_item">
				<span>现价</span>
				<div>
					<span class="current_price"
						>{{
							discount == 0
								? original_price
								: (original_price * discount).toFixed(2)
						}}
						<i>元</i></span
					>
					<span class="discount" v-if="discount != 0"
						>限时{{
							discount > 1 ? discount : discount * 10
						}}折</span
					>
					<span class="original_price" v-if="discount != 0"
						>原价:{{ original_price }}元</span
					>
				</div>
			</div>
			<div class="parameter_item">
				<span></span>
				<div>
					<el-checkbox v-model="checked"
						>我已阅读并同意《点播加速服务协议》</el-checkbox
					>
				</div>
			</div>
			<div class="parameter_item">
				<span></span>
				<div>
					<el-button
						type="primary"
						class="pay_btn"
						size="samll"
						@click="pay_money"
						>立即购买</el-button
					>
				</div>
			</div>
			<PayDia
				ref="PayDialog"
				:money="money"
				:order_id="order_id"
				:order_data="order_data"
			></PayDia>
		</div>
	</div>
</template>

<script>
import PayDia from '../../components/payment_panel';
import {
	query_pktproduct,
	create_pktorder,
	notify_payment,
} from '../../servers/api';
export default {
	data() {
		return {
			user_id: JSON.parse(sessionStorage.getItem('id')),
			clientHeight: '',
			activeClass: 'activeClass',
			pay_type: 1,
			valid_period: 'one',
			num: 1,
			money: 0,
			order_data: {},
			order_id: '',
			checked: false,
			// current_price: 0, //现价
			discount: 0.95, //折扣
			original_price: 59.6, //原价
			parameter_list: [
				// {
				// 	id: 1,
				// 	name: '流量资源包 -100GB',
				// 	discount: 0.5,
				// 	original_price: 20,
				// },
				// {
				// 	id: 2,
				// 	name: '流量资源包 -100GB',
				// 	discount: 0.6,
				// 	original_price: 20,
				// },
				// {
				// 	id: 3,
				// 	name: '流量资源包 -100GB',
				// 	discount: 0.35,
				// 	original_price: 55,
				// },
				// {
				// 	id: 4,
				// 	name: '流量资源包 -100GB',
				// 	discount: 0.2,
				// 	original_price: 100,
				// },
				// {
				// 	id: 5,
				// 	name: '流量资源包 -100GB',
				// 	discount: 0,
				// 	original_price: 99,
				// },
				// {
				// 	id: 6,
				// 	name: '流量资源包 -100GB',
				// 	discount: 0.1,
				// 	original_price: 70,
				// },
				// {
				// 	id: 7,
				// 	name: '流量资源包 -100GB',
				// 	discount: 0,
				// 	original_price: 10,
				// },
			],
			search_time: [
				new Date(new Date().toLocaleDateString()).getTime() -
					86400 * 1000,
				new Date().getTime(),
			],
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
		this.get_data_list();
	},
	methods: {
		get_data_list() {
			console.log(this.search_time);
			let params = {
				page: 0,
				product_name: '',
				start_time: parseInt(this.search_time[0] / 1000), //创建开始时间 单位:秒
				end_time: parseInt(this.search_time[1] / 1000),
			};
			query_pktproduct(params)
				.then((res) => {
					if (res.status == 0) {
						this.parameter_list = res.data.data;
						this.pay_type = this.parameter_list[0].product_id;
					}
				})
				.catch((error) => {});
		},
		//切换流量包
		change_paraer(data, index) {
			this.discount = data.discount;
			this.original_price = data.price;
		},
		pay_money() {
			if (this.checked == false) {
				this.$alert('请勾选《点播加速服务协议》', '提示', {
					confirmButtonText: '确定',
					callback: (action) => {},
				});
				return false;
			}
			//创建订单
			let params = {
				user_id: this.user_id,
				product_id: this.pay_type,
				num: this.num,
			};
			create_pktorder(params)
				.then((res) => {
					if (res.status == 0) {
						(this.money = res.data.pay_amount),
							(this.order_id = res.data.order_id),
							(this.order_data = res.data);
						// this.$refs.PayDialog.show_dia();
						let pay_data = {
							order_id: res.data.order_id,
							pay_type: 1,
							pay_amount:
								Number(this.original_price) *
								Number(this.discount),
						};
						this.success_payment(pay_data);
					}
				})
				.catch((error) => {});
		},
		//支付成功通知
		success_payment(data) {
			let params = {
				order_id: data.order_id,
				pay_type: data.pay_type, //1:微信 2:支付宝
				pay_state: 1, //1:成功 2:异常
				pay_amount: data.pay_amount, //单位:元
			};
			notify_payment(params)
				.then((res) => {
					if (res.status == 0) {
						this.$message.success('支付成功');
					}
				})
				.catch((error) => {});
		},
		go_pay_money() {
			this.$router.push({
				path: '/pre_payment',
				query: { data: JSON.stringify(row) },
			});
		},
		handleChange(value) {
			console.log(value);
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
.commodity_detil {
	// width: 100%;
	background-color: #fff;
	text-align: left;
	box-sizing: border-box;
	padding: 36px;
	padding-top: 10px;
	margin: 36px;
	box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
	position: relative;
	.top_title {
		font-size: 14px;
	}
	.second_title {
		text-align: left;
		font-size: 16px;
		margin: 20px 0;
	}
	.parameter_title {
		text-align: center;
		background-color: #e8f3ff;
		line-height: 48px;
		font-weight: 600;
	}
	.parameter_item {
		display: flex;
		justify-content: start;
		align-items: center;
		margin-top: 30px;
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
			}
			.activeClass {
				margin-left: 10px;
			}
		}
	}
}
</style>
