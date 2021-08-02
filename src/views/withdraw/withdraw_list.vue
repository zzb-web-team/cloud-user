<template>
	<div class="order_list_com">
		<div class="con_top">
			<div class="t_title">提现记录</div>
			<div class="title_seach">
				<div class="search_left">
					<el-row
						type="flex"
						justify="space-between"
						class="title_seach_item"
					>
						<el-col>
							<span class="item_title">交易单号</span>
							<el-input
								v-model="order_id"
								placeholder="请输入订单号"
								size="medium"
								@change="onChanges"
								style="width:60%;max-width:300px;"
							></el-input>
						</el-col>
						<el-col>
							<span class="item_title">交易账户</span>
							<el-input
								v-model="qu_id"
								placeholder="请输入交易账户"
								size="medium"
								@change="onChanges"
								style="width:60%;max-width:300px;"
							></el-input>
						</el-col>
						<el-col>
							<span class="item_title">状态</span>
							<el-select
								size="medium"
								v-model="pay_type"
								placeholder="请选择活动区域"
								style="width:60%;max-width:300px;height:auto;"
							>
								<el-option label="全部" value="0"></el-option>
								<el-option label="成功" value="1"></el-option>
								<el-option label="审核中" value="2"></el-option>
								<el-option
									label="审核未通过"
									value="3"
								></el-option>
							</el-select>
						</el-col>
					</el-row>
					<el-row
						type="flex"
						justify="space-between"
						class="title_seach_item"
					>
						<el-col>
							<span class="item_title">创建时间</span>
							<el-date-picker
								size="medium"
								v-model="search_time"
								type="daterange"
								placeholder="选择日期"
								range-separator="~"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								style="width:60%;max-width:300px;"
							>
							</el-date-picker>
						</el-col>
						<el-col> </el-col>
						<el-col> </el-col>
					</el-row>
				</div>
				<div class="search_right">
					<el-button type="primary" size="small" @click="onChanges"
						>查询</el-button
					>
					<el-button size="small" @click="reset">重置</el-button>
				</div>
			</div>
		</div>
		<div class="con_table" ref="box_rHeight">
			<el-table
				:data="tableData"
				stripe
				style="width: 100%"
				:cell-style="rowClass"
				:header-cell-style="headClass"
			>
				<el-table-column prop="order_idr" label="交易单号">
				</el-table-column>
				<el-table-column prop="charge_time" label="交易时间">
					<template slot-scope="scope">{{
						common.getTimes(scope.row.charge_time*1000)
					}}</template>
				</el-table-column>
				<el-table-column prop="order_type" label="交易类型">
					<template slot-scope="scope">
						<span>{{
							scope.row.order_type == 1 ? '提现' : '扣费'
						}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="serial_number"
					label="提现账户"
					width="220"
				>
					<template slot-scope="scope">
						{{ scope.row.serial_number | setserial }}
					</template>
				</el-table-column>
				<el-table-column prop="money" label="金额">
					<template slot-scope="scope">
						<span>{{ scope.row.money }}</span></template
					>
				</el-table-column>
				<el-table-column prop="specification" label="服务费">
				</el-table-column>
				<el-table-column prop="pay_type" label="状态">
					<template slot-scope="scope">
						<span v-if="scope.row.pay_type == 1">成功</span>
						<span v-else-if="scope.row.pay_type == 2">审核中</span>
						<span v-else>审核未通过</span>
					</template>
				</el-table-column>
				<el-table-column prop="user_id" label="操作">
					<template slot-scope="scope">
						<el-button
							@click="go_detil(scope.row)"
							type="text"
							size="small"
							>查看详情</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<div class="content_bottom" v-show="tableData.length > 0">
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
import { query_user_sz, query_user_sz_for_admin } from '../../servers/api';
import { dateToMs, getymdtime } from '../../servers/sevdate';
export default {
	data() {
		return {
			user_id: JSON.parse(sessionStorage.getItem('id')),
			clientHeight: '',
			order_id: '',
			qu_id: '',
			pay_type: '0',
			order_type: '0',
			search_time: [],
			starttime: '',
			endtime: '',
			pageNo: 0, //当前页码
			pageSize: 10, //每页数量
			total_cnt: 0, //数据总量
			tableData: [
				// {
				// 	order_id: 15049156199,
				// 	visit_cnt: 150,
				// 	name: '充值',
				// 	user_information: '王小虎',
				// 	serial_number: '20200511795515913124680',
				// 	product_type: '流量包',
				// 	num: 12,
				// 	money: 140,
				// 	specification: 3,
				// 	pay_type: 1,
				// 	create_time: '2021-08-03 11:30:00',
				// 	order_type: 1,
				// },
				// {
				// 	order_id: 15049156402,
				// 	visit_cnt: 366,
				// 	name: '扣费',
				// 	user_information: '王小虎',
				// 	serial_number: '15616515644545641311131',
				// 	product_type: '流量包',
				// 	num: 12,
				// 	money: 12540,
				// 	specification: 3,
				// 	pay_type: 2,
				// 	create_time: '2021-08-03 11:30:00',
				// 	order_type: 1,
				// },
			],
		};
	},
	components: {
		fenye,
	},
	filters: {
		formatTel(iphone) {
			let tel = String(iphone);
			var reg = /^(\d{3})\d{4}(\d{4})$/;
			return tel.replace(reg, '$1****$2');
		},
		settimes(data) {
			if (data) {
				var stat = getymdtime(data);
				return stat;
			} else {
				return data;
			}
		},
		setserial(num) { 
           if(!num) return;
			return num.substr(0, 4) + ' ****** ' + num.substr(num.length - 3);
		},
	},
	watch: {
		clientHeight() {
			//如果clientHeight 发生改变，这个函数就会运行
			this.changeFixed(this.clientHeight);
		},
	},
	mounted() {
		this.starttime =
			new Date(new Date().toLocaleDateString()).getTime() / 1000;
		this.endtime = Date.parse(new Date()) / 1000;
		let that = this;
		that.clientHeight = `${document.documentElement.clientHeight ||
			document.documentElement.offsetHeight}`; //获取浏览器可视区域高度
		window.onresize = function() {
			that.clientHeight = `${document.documentElement.clientHeight ||
				document.documentElement.offsetHeight}`;
		};
		if (that.$refs.box_rHeight) {
			that.$refs.box_rHeight.style.height =
				that.clientHeight - 329 + 'px';
			that.$refs.box_rHeight.style.minHeight = 500 + 'px';
		}
		this.onChanges();
	},
	methods: {
		onChanges() {
			let params = {
				user_id: this.user_id,
				order_id: this.order_id, //交易单号
				pay_type: Number(this.pay_type), //1:微信 2:支付宝 3:钱包
				start_time: parseInt(this.search_time[0] / 1000),
				end_time: parseInt(this.search_time[1] / 1000),
				page: this.pageNo,
				order: 0,
			};
			query_user_sz(params)
				.then((res) => {
					if (res.status == 0) {
						this.tableData = res.data.data;
						this.total_cnt = res.data.total;
					}
				})
				.catch((error) => {});
		},
		reset() {
			this.user_id = '';
			this.order_id = '';
			this.qu_id = '';
			this.order_type = '0';
			this.pay_type = '0';
			this.search_time = [];
			this.pageNo = 0;
			this.onChanges();
		},
		go_detil(data) {
			this.$router.push({
				path: '/withdraw_detil',
				query: { data: JSON.stringify(data) },
			});
		},
		//获取页码
		handleCurrentChange(pages) {
			this.pageNo = pages - 1;
			this.onChanges();
		},
		handleSizeChange(pagesize) {
			this.pageSize = pagesize;
		},
		//查询屏幕高度自适应
		changeFixed(data) {
			if (this.$refs.box_rHeight) {
				this.$refs.box_rHeight.style.height = data - 353 + 'px';
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
.order_list_com {
	width: 100%;
	text-align: left;
	box-sizing: border-box;
	padding: 30px 25px;
	background-color: #fff;
	.con_top {
		box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
		box-sizing: border-box;
		padding: 20px 30px;
		.t_title {
			// margin-bottom: 20px;
			font-size: 16px;
			font-weight: 500;
			width: 100%;
			height: 60px;
			line-height: 70px;
			text-align: left;
			color: #202020;
		}
		.title_seach {
			display: flex;
			justify-content: start;
			align-items: center;
			white-space: nowrap;
			.search_left {
				width: 65%;
				.title_seach_item {
					margin-bottom: 20px;
					.item_title {
						margin-right: 5px;
						font-size: 14px;
					}
				}
			}
			.search_right {
				flex: 1;
				padding-bottom: 20px;
				text-align: right;
			}
		}
	}
	.con_table {
		margin-top: 15px;
		flex: 1;

		box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
		padding: 40px;
		.content_top {
			text-align: right;
			img {
				width: 80%;
			}
		}
		.content_bottom {
			margin-top: 20px;
			text-align: right;
		}
	}
}
</style>
