<template>
	<div class="traffic_detil" ref="box_rHeight">
		<div class="title_text">流量包使用明细</div>
		<div class="second_text">
			<div>
				<span>产品名称</span><span>{{ title_data.product_name }}</span>
			</div>
			<div>
				<span>规格</span><span>{{ title_data.size_spec }}</span>
			</div>
			<div>
				<span>数量</span><span>{{ title_data.num }}</span>
			</div>
			<div>
				<span>产品类型</span
				><span>{{ title_data.product_type || '流量包' }}</span>
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
import { query_pktuse_info } from '../../servers/api';
export default {
	data() {
		return {
			clientHeight: '',
			user_id: JSON.parse(sessionStorage.getItem('id')),
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
			pageNo: 0,
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
		console.log(that.$refs.box_rHeight.style.minHeight);
		this.get_data();
	},
	methods: {
		get_data() {
			let params = {
				user_id: this.user_id,
				order_id: this.title_data.order_id,
				page: this.pageNo,
			};
			query_pktuse_info(params)
				.then((res) => {
					if (res.status == 0) {
					}
				})
				.catch((error) => {});
		},
		//获取页码
		handleCurrentChange(pages) {
			this.pageNo = pages - 1;
			this.get_data();
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
		font-size: 16px;
		font-weight: 500;
	}
	.second_text {
		display: flex;
		justify-content: space-around;
		align-items: center;
		box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
		padding: 20px 0;
		margin-bottom: 40px;
		div {
			span {
				margin-left: 10px;
			}
		}
	}
	.content_bottom {
		margin-top: 20px;
		text-align: right;
	}
}
</style>
