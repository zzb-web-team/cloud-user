<template>
	<div class="traffic_detil" ref="box_rHeight">
		<div class="title_text">资金管理 > 费用账单 > 费用账单详情</div>
		<div class="second_text">
			<div>
				<p>账单周期</p>
				<p>{{ title_data.create_time }}</p>
			</div>
			<div>
				<p>计费模式</p>
				<p>按量计费</p>
			</div>
			<div>
				<p>结算方式</p>
				<p>{{ title_data.product_type }}</p>
			</div>
			<!-- <div>
				<p>产品类型</p><p>{{ title_data.product_type }}</p>
			</div> -->
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
				<el-table-column prop="date" label="加速时间">
				</el-table-column>
				<el-table-column prop="address" label="流量使用">
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
				height: 54px;
				line-height: 30px;
			}
		}
	}
	.content_bottom {
		margin-top: 20px;
		text-align: right;
	}
}
</style>
