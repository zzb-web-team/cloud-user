<template>
	<div class="recharge_management" ref="box_rHeight">
		<div class="toptitle">提现</div>
		<div class="content">
			<div class="parameter_item">
				<span>当前余额：</span>
				<span class="balance">￥ {{ balance }}</span>
				<!-- <el-input
					placeholder="请输入金额"
					v-model="balance"
					:disabled="true"
				>
				</el-input> -->
			</div>
			<div class="parameter_item parameter_item_money">
				<span>提现金额：</span>
				<!-- <el-radio
					v-model="money_num"
					:label="item.id"
					border
					size="small"
					@change="change_paraer(item, index)"
					v-for="(item, index) in parameter_list"
					:key="item.id"
					v-bind:class="[index == 0 ? activeClass : '']"
				>
					{{ item.name }}</el-radio
				> -->
				<el-input
					placeholder="￥"
					v-model="amount"
					style="width:120px;margin-left: 10px;"
					oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
				>
				</el-input>
				<i>收取0.1%服务费</i>
			</div>
			<div class="parameter_item card_list">
				<span>选择银行：</span>
				<div
					style="width:70%;display: flex;flex-flow: row wrap; align-content: flex-start；"
				>
					<el-radio
						v-model="radio"
						:label="item.id"
						border
						v-for="item in parameter_list"
						:key="item.id"
						>{{ item.name }}</el-radio
					>
				</div>
				<div class="card_btn">
					<span @click="go_add_bankcard">添加银行卡</span>
					<span @click="go_withdraw_list">提现记录</span>
				</div>
			</div>
			<div class="parameter_item tips">
				<p>温馨提示：</p>
				<p>不支持信用卡或要求转账方式充值，切勿上当受骗。</p>
				<p>如您有未结清账单，请优先结清该账单。</p>
				<p>充值后请及时对支付订单进行结算，以免影响正常服务。</p>
			</div>
			<div class="parameter_item">
				<div>
					<el-checkbox v-model="pay_checked"
						>我已了解<span class="link_text"></span
					></el-checkbox>
				</div>
			</div>
			<div class="parameter_item">
				<div>
					<el-button
						type="primary"
						class="pay_btn"
						size="samll"
						@click="pay_money"
						>下一步</el-button
					>
				</div>
			</div>
		</div>
		<Recharge
			ref="recharge"
			:pay_type="radio"
			:money="Number(amount)"
			:order_id="order_id"
		></Recharge>
	</div>
</template>
<script>
import Recharge from '../../components/recharge';
import {
	create_chargeorder,
	query_user_acount,
	mgmt_notify_payment,
} from '../../servers/api';
export default {
	data() {
		return {
			user_id: JSON.parse(sessionStorage.getItem('id')),
			activeClass: 'activeClass',
			clientHeight: '',
			balance: 0,
			amount: null,
			radio: '1',
			pay_checked: false,
			order_id: '1111111111112456',
			money_num: 1,
			parameter_list: [
				{
					id: '1',
					name: '中国建设银行（ 尾号 0852 ）',
				},
				{
					id: '2',
					name: '中国农业银行（ 尾号 0852 ）',
				},
				{
					id: '3',
					name: '交通银行（ 尾号 0852 ）',
				},
			],
		};
	},
	components: { Recharge },
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
		if (that.$refs.box_rHeight) {
			that.$refs.box_rHeight.style.height =
				that.clientHeight - 120 + 'px';
			that.$refs.box_rHeight.style.minHeight = 500 + 'px';
		}
		// this.get_user_money();
	},
	methods: {
		pay_money() {
			if (this.pay_checked == false) {
				this.$alert('请阅读并同意提示内容', '提示', {
					confirmButtonText: '确定',
					callback: (action) => {},
				});
				return false;
			}
			if (this.amount <= 0) {
				this.$alert('请输入有效充值金额', '提示', {
					confirmButtonText: '确定',
					callback: (action) => {},
				});
				return false;
			}
			let params = {
				user_id: this.user_id,
				amount: Number(this.amount),
			};
			create_chargeorder(params)
				.then((res) => {
					if (res.status == 0) {
						this.account = res.data.account;
						this.order_id = res.data.order_id;
						// this.$refs.recharge.show_dia();//调用付款二维码
						let pay_data = {
							order_id: res.data.order_id,
							pay_type: Number(this.radio),
							pay_amount: params.amount,
						};
						this.success_payment(pay_data);
					} else if (res.status == -7 && res.err_code == 464) {
						this.$message({
							message: '首次充值金额最低200元',
							type: 'warning',
						});
					} else {
						this.$message.error(res.msg);
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
			mgmt_notify_payment(params)
				.then((res) => {
					if (res.status == 0) {
						this.$message.success('提现成功');
					} else if (res.status == -7 && res.err_code == 463) {
						this.$message({
							message: '未开通按量计费',
							type: 'warning',
						});
					}
				})
				.catch((error) => {});
		},
		//查询用户余额
		get_user_money() {
			let params = {
				user_id: this.user_id,
			};
			query_user_acount(params)
				.then((res) => {
					if (res.status == 0) {
						this.balance = res.data.balance;
					}
				})
				.catch((error) => {});
		},
		go_withdraw_list() {
			this.$router.push({ path: '/withdraw_list' });
		},
		go_add_bankcard() {
			this.$router.push({ path: '/add_bankcard' });
		},
		//查询屏幕高度自适应
		changeFixed(data) {
			if (this.$refs.box_rHeight) {
				this.$refs.box_rHeight.style.height = data - 120 + 'px';
				this.$refs.box_rHeight.style.minHeight = 500 + 'px';
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.recharge_management {
	text-align: left;
	box-sizing: border-box;
	padding: 30px 25px;
	background-color: rgb(255, 255, 255);
	margin: 30px 25px;
	box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
	.toptitle {
		// margin-bottom: 20px;
		font-size: 16px;
		font-weight: 500;
		width: 100%;
		height: 60px;
		line-height: 70px;
		text-align: left;
		color: #202020;
        margin-top: -20px;
	}
	.content {
		width: 50%;
		min-width: 900px;
		margin: auto;
		.parameter_item {
			display: flex;
			justify-content: start;
			align-items: center;
			margin-top: 40px;
			margin-left: 80px;
			span {
				width: 105px;
			}
			.balance {
				font-size: 16px;
				font-weight: 600;
			}
			i {
				font-style: normal;
				margin-left: 10px;
				margin-right: 5px;
				color: #f56a23;
				font-size: 12px;
			}
			.el-radio {
				margin-bottom: 10px;
				width: 40%;
			}
			.el-radio:first-child {
				margin-left: 10px;
			}
			.card_btn {
				span {
					margin-left: 5px;
					color: #489eff;
					cursor: pointer;
				}
			}
		}
		.card_list {
			justify-content: end;
		}
		.tips {
			flex-direction: column;
			align-items: flex-start;
			// height: 120px;
			background-color: #f9f9f9;
			box-sizing: border-box;
			padding: 20px 15px;
			border: 1px solid #dcdfe6;
			border-radius: 2px;
			p {
				margin-bottom: 5px;
			}
			p:nth-child(3) {
				color: #ee6723;
			}
		}
	}
}
</style>
