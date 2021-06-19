<template>
	<div class="traffic_detil" ref="box_rHeight">
		<div class="title_text">资金管理 > 提现 > 提现详情</div>
		<div class="state">
			<p v-if="title_data.pay_type == 1">
				<i class="el-icon-success"></i>
				<span>成功</span>
			</p>
			<p v-else-if="title_data.pay_type == 2">
				<i class="el-icon-remove"></i>
				<span>审核中</span>
			</p>
			<p v-else-if="title_data.pay_type == 3">
				<i class="el-icon-error"></i>
				<span>审核未通过</span>
			</p>
		</div>
		<div class="second_text">
			<div>
				<p>提现记录</p>
				<p>时间报告</p>
			</div>
			<div>
				<p>
					{{ title_data.user_information }}{{ title_data.product_type
					}}{{ title_data.serial_number }}
				</p>
				<p>{{ title_data.create_time }}</p>
			</div>
		</div>
		<div>
			<el-table
				:data="tableData"
				:cell-style="rowClass"
				:header-cell-style="headClass"
				stripe
				style="width: 100%"
			>
				<!-- <el-table-column prop="name" label="加速内容" >
				</el-table-column> -->
				<el-table-column prop="order_id" label="交易号">
				</el-table-column>
				<el-table-column prop="pay_type" label="交易类型">
				</el-table-column>
				<el-table-column prop="collect_money" label="实收">
				</el-table-column>
				<el-table-column prop="service_charge" label="服务费">
				</el-table-column>
				<el-table-column prop="money" label="金额（单位：元）">
				</el-table-column>
			</el-table>
			<div class="content_bottom">
				<fenye
					:currentPage="pageNo"
					@handleCurrentChange="handleCurrentChange"
					@handleSizeChange="handleSizeChange"
					:pagesa="total_cnt"
				></fenye>
			</div>
		</div>
	</div>
</template>

<script>
import fenye from '@/components/fenye';
export default {
	data() {
		return {
			clientHeight: '',
			tableData: [
				// {
				// 	date: '2016-05-02',
				// 	name: '王小虎',
				// 	address: '上海市普陀区金沙江路 1518 弄',
				// },
				// {
				// 	date: '2016-05-04',
				// 	name: '王小虎',
				// 	address: '上海市普陀区金沙江路 1517 弄',
				// },
				// {
				// 	date: '2016-05-01',
				// 	name: '王小虎',
				// 	address: '上海市普陀区金沙江路 1519 弄',
				// },
				// {
				// 	date: '2016-05-03',
				// 	name: '王小虎',
				// 	address: '上海市普陀区金沙江路 1516 弄',
				// },
			],
			pageNo: 1,
			pageSize: 10,
			total_cnt: 0,
			title_data: {},
		};
	},
	components: {
		fenye,
	},
	watch: {
		clientHeight() {
			//如果clientHeight 发生改变，这个函数就会运行
			this.changeFixed(this.clientHeight);
		},
	},
	mounted() {
		this.title_data = JSON.parse(this.$route.query.data);
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
		console.log(this.title_data);
	},
	methods: {
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
	}
	.state {
		margin-bottom: 20px;
		i {
			font-size: 22px;
		}
		.el-icon-remove {
			color: #2064b2;
		}
		.el-icon-success {
			color: #52c41a;
		}
		.el-icon-error {
			color: red;
		}
	}
	.second_text {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 5px 0;
		margin-bottom: 20px;
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
				height: 54px;
				line-height: 30px;
			}
		}
		div:first-child {
			width: 40%;
			background: rgb(232, 243, 255);
		}
	}
	.content_bottom {
		margin-top: 20px;
		text-align: right;
	}
}
</style>
