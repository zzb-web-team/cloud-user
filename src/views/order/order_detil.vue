<template>
	<div class="order_detil_con" ref="box_rHeight">
		<div class="top_title">订单管理 > 订单详情</div>
		<h3>
			<span class="top_title_text">订单详情</span>
			<div class="top_text">
				<span class="expired" v-if="data_list.order_type == 1"
					>代付款：{{ data_list.money }} 元</span
				>
				<span v-else-if="data_list.order_type == 2">已过期</span>
			</div>
		</h3>
		<ol>
			<li>
				<span>订单号</span>
				<p>{{ data_list.order_id }}</p>
			</li>
			<li>
				<span>订单状态</span>
				<p>
					<span class="dai" v-if="data_list.order_type == 1">
						待支付
					</span>
					<span class="guo" v-else-if="data_list.order_type == 2"
						>已过期</span
					>
					<span class="wan" v-else>已完成</span>
				</p>
			</li>
			<li>
				<span>产品名称</span>
				<p>{{ data_list.name }}</p>
			</li>
			<li>
				<span>创建时间</span>
				<p>{{ data_list.create_time }}</p>
			</li>
			<li>
				<span>规格</span>
				<p>{{ data_list.specification }}</p>
			</li>
			<li>
				<span>付款时间</span>
				<p>{{ data_list.pay_time ? data_list.pay_time : '-' }}</p>
			</li>
			<li>
				<span>产品类型</span>
				<p>{{ data_list.product_type }}</p>
			</li>
		</ol>
		<div class="con_table">
			<el-table
				:data="tableData"
				style="width: 100%"
				:header-cell-style="headClass"
				:cell-style="cellClass"
			>
				<el-table-column prop="date" label="订单号"> </el-table-column>
				<el-table-column prop="name" label="产品名称">
				</el-table-column>
				<el-table-column prop="name" label="规格"> </el-table-column>
				<el-table-column prop="name" label="数量"> </el-table-column>
				<el-table-column prop="name" label="产品类型">
				</el-table-column>
				<el-table-column prop="name" label="支付方式">
				</el-table-column>
				<el-table-column prop="name" label="订单金额">
				</el-table-column>
				<el-table-column prop="address" label="实付金额">
				</el-table-column>
			</el-table>
		</div>
		<div class="payment_instructions" v-if="data_list.order_type != 2">
			<span>
				实际付款
			</span>
			<span>{{ data_list.money }}<i> 元</i></span>
		</div>
		<el-button
			type="primary"
			class="pay_btn"
			v-if="data_list.order_type == 1"
			@click="pay_money"
			>立即支付</el-button
		>
		<PayDia ref="PayDialog" :money="money" :order_id="order_id"></PayDia>
	</div>
</template>

<script>
import PayDia from '../../components/payment_panel';
export default {
	data() {
		return {
			clientHeight: '',
			data_list: {
				// order_id: 15049156199,
				// visit_cnt: 150,
				// name: '新用户超值体验包',
				// user_information: '王小虎',
				// product_type: 12,
				// num: 12,
				// money: 10,
				// specification: 3,
				// pay_type: '微信',
				// create_time: '2021-08-03 11:30:00',
				// order_type: 1,
			},
			money: 0,
			order_id: '',
			tableData: [
				{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄',
				},
			],
		};
	},
	computed: {},
	components: {
		PayDia,
	},
	filters: {},
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
		this.data_list = JSON.parse(this.$route.query.data);
		this.money = this.data_list.money;
		this.order_id = String(this.data_list.order_id);
	},
	methods: {
		pay_money() {
			this.$refs.PayDialog.show_dia();
		},
		// 表头样式设置
		headClass() {
			return 'text-align: center;background:#E8F3FF;';
		},
		// 表格样式设置
		cellClass() {
			return 'text-align: center;line-height: 50px;';
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
.order_detil_con {
	// width: 100%;
	box-sizing: border-box;
	text-align: left;
	box-sizing: border-box;
    padding: 40px;
    padding-top: 10px;
	box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
    margin: 36px;
    background-color: #fff;
	.top_title {
        margin-bottom: 20px;
        font-size: 14px;
	}
	h3 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		.top_text {
			span {
				color: #7f7f7f;
			}
			.expired {
				color: #ee9415;
				border-radius: 8px 0 8px 0;
				padding: 5px 10px;
				background: #feeed7;
				font-size: 14px;
				font-weight: 400;
			}
		}
		.top_title_text {
			display: inline-block;
			position: relative;
			z-index: 1;
			&:before {
				z-index: -1;
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 50%;
				background: linear-gradient(
					-90deg,
					rgba(255, 0, 0, 0),
					rgb(40, 240, 200)
				);
			}
		}
	}
	ol {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
        margin-bottom: 30px;
        width: 50%;
		li {
			width: 50%;
			display: flex;
			line-height: 26px;
			span {
				width: 100px;
			}
			.dai {
				font-size: 14px;
				color: #ee9415;
			}
			.wan {
				color: #316afa;
				border-radius: 0 8px 0 8px;
				padding: 5px 10px;
				background: #e8f3ff;
				font-size: 14px;
				font-weight: 400;
			}
			.guo {
				color: #6a7380;
				border-radius: 8px 0 8px 0;
				padding: 5px 10px;
				background: #dce2ec;
				font-size: 14px;
				font-weight: 400;
			}
		}
	}
	.con_table {
		padding-left: 20px;
	}
	.payment_instructions {
		display: flex;
		align-items: center;
		margin: 20px 0;
		padding-left: 20px;
		span {
			font-size: 14px;
		}
		span:last-child {
			margin-left: 40px;
			color: #ee9415;
			font-size: 22px;
			font-weight: 600;
		}
		i {
			font-style: normal;
			font-size: 14px;
			font-weight: 500;
		}
	}
	.pay_btn {
        margin-left: 20px;
        background: #297AFF;
        border-radius: 8px;
        margin-left: 40px;
	}
}
</style>
