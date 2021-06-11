<template>
	<div class="order_list_com">
		<div class="con_top">
			<div class="t_title">账单管理</div>
			<div class="title_seach">
				<div class="search_left">
					<span class="item_title">账期</span>
					<el-date-picker
						size="medium"
						v-model="search_time"
						type="month"
						placeholder="选择月"
						style="width:40%;max-width:220px;"
					>
					</el-date-picker>
				</div>
				<div class="search_right">
					<el-button type="primary" size="small" @click="onChanges"
						>查询</el-button
					>
					<el-button size="small" @click="reset">重置</el-button>
				</div>
			</div>
		</div>
		<div class="myChart">
			<div id="myChart" :style="{ height: '607px' }"></div>
			<el-radio-group v-model="radio" size="medium" class="echarts_radio">
				<el-radio-button label="近一个月"></el-radio-button>
				<el-radio-button label="近半年"></el-radio-button>
				<el-radio-button label="近一年"></el-radio-button>
			</el-radio-group>
		</div>
		<div class="con_table" ref="box_rHeight">
			<el-table
				:data="tableData"
				style="width: 100%"
				:cell-style="rowClass"
				:header-cell-style="headClass"
			>
				<el-table-column prop="create_time" label="账单时间">
				</el-table-column>
				<el-table-column prop="product_type" label="账单结算方式">
				</el-table-column>
				<el-table-column prop="Used" label="按量计费使用量">
				</el-table-column>
				<el-table-column prop="total_cost" label="总费用">
				</el-table-column>
				<el-table-column prop="deduction" label="扣费">
				</el-table-column>
				<el-table-column prop="money" label="欠费">
					<template slot-scope="scope">{{
						scope.row.total_cost - scope.row.deduction > 0
							? '-' + (scope.row.total_cost - scope.row.deduction)
							: 0
					}}</template>
				</el-table-column>
				<el-table-column label="备注" prop="remakes"> </el-table-column>
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
import echarts from 'echarts';
import { query_user_sz_for_admin, query_user_sz } from '../../servers/api';
export default {
	data() {
		return {
			user_id: JSON.parse(sessionStorage.getItem('id')),
			clientHeight: '',
			search_time: [],
			starttime: '',
			endtime: '',
			pageNo: 1, //当前页码
			pageSize: 10, //每页数量
			total_cnt: 0, //数据总量
			radio: '近一个月',
			tableData: [
				{
					total_cost: 2312,
					deduction: 1360,
					Used: '300Mb',
					product_type: '按日结算',
					create_time: '2021-08-03 11:30:00',
				},
				{
					total_cost: 712,
					deduction: 570,
					Used: '300Mb',
					product_type: '按日结算',
					create_time: '2021-08-03 11:30:00',
				},
				{
					total_cost: 162,
					deduction: 100,
					Used: '300Mb',
					product_type: '按日结算',
					create_time: '2021-08-03 11:30:00',
				},
				{
					total_cost: 112,
					deduction: 112,
					Used: '300Mb',
					product_type: '按日结算',
					create_time: '2021-08-03 11:30:00',
				},
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
				that.clientHeight - 334 + 'px';
			that.$refs.box_rHeight.style.minHeight = 500 + 'px';
        }
        this.onChanges();
		this.set_echarts();
	},
	methods: {
		onChanges() {
			let date = new Date();
			let starttime =
				date.getFullYear() + '-' + date.getMonth() + '-' + '01';
			console.log(starttime);
			let params = {
				user_id: this.user_id, //用户ID
				order_id: '', //交易单号
				order_type: 2, //1:充值 2:扣费
				pay_type: 0, //1:微信 2:支付宝 3:钱包
				start_time: parseInt(this.search_time[0] / 1000),
				end_time: parseInt(this.search_time[1] / 1000),
				page: 0,
				order: 0,
			};
			query_user_sz(params)
				.then((res) => {
					if (res.status == 0) {
                        this.tableData=res.data.data;
                        this.total_cnt=res.data.total;
					}
				})
				.catch((error) => {});
		},
		reset() {},
		handleClick(row) {
			this.$router.push({
				path: '/traffic_detil',
				query: {
					data: JSON.stringify(row),
				},
			});
		},
		set_echarts() {
			let _this = this;
			// 基于准备好的dom，初始化echarts实例
			let myChart = this.$echarts.init(
				document.getElementById('myChart')
			);
			myChart.off('click');
			window.onresize = myChart.resize;
			// 绘制图表
			let options = {
				title: {
					text: '费用趋势',
					subtext: '(单位：元)',
					x: 50,
					y: 30,
				},
				toolbox: {
					//show: true,
					itemSize: 20,
					itemGap: 60,
					right: 60,
					top: 60,
					feature: {
						mydow: {
							show: true,
							title: '导出',
							icon:
								'path://M552 586.178l60.268-78.53c13.45-17.526 38.56-20.83 56.085-7.38s20.829 38.56 7.38 56.085l-132 172c-16.012 20.863-47.454 20.863-63.465 0l-132-172c-13.45-17.526-10.146-42.636 7.38-56.085 17.525-13.45 42.635-10.146 56.084 7.38L472 586.177V152c0-22.091 17.909-40 40-40s40 17.909 40 40v434.178zM832 512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 61.856-50.144 112-112 112H224c-61.856 0-112-50.144-112-112V512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 17.673 14.327 32 32 32h576c17.673 0 32-14.327 32-32V512z',
							onclick: function() {
								_this.exportant_dataflow();
							},
						},
					},
				},
				grid: {
					// 间距是 根据x、y轴计算的；假如都是0，x、y轴的label汉字就隐藏掉了。
					left: '5%', // 默认10%，给24就挺合适的。
					top: 110, // 默认60
					right: '6%', // 默认10%
					bottom: 60, // 默认60
				},
				color: '#297AFF',
				tooltip: {
					trigger: 'axis',
					formatter: function(params) {
						return (
							params[0].name +
							'<br>' +
							params[0].seriesName +
							':' +
							params[0].data
						);
					},
				},
				xAxis: {
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
					axisTick: {
						show: false,
					},
				},
				yAxis: {
					name: _this.unitdata,
				},
				series: [
					{
						name: '费用',
						type: 'line',
						// barWidth: 30, //柱图宽度
						barMaxWidth: 30,
						data: [150, 230, 224, 218, 135, 147, 260],
						smooth: false, //设置折线图的弧度
						itemStyle: {
							normal: {
								lineStyle: {
									color: '#297AFF', //线的颜色
								},
							},
							color: '#00FF00',
						},
					},
				],
				backgroundColor: '#FFFFFF',
			};
			myChart.clear();
			myChart.setOption(options);
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
				this.$refs.box_rHeight.style.height = data - 295 + 'px';
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
			font-size: 18px;
			color: #202020;
		}
		.title_seach {
			display: flex;
			justify-content: start;
			align-items: center;
			white-space: nowrap;
			.search_left {
				width: 65%;
				padding-bottom: 20px;
				.item_title {
					margin-right: 5px;
					margin-left: 20px;
					font-size: 14px;
				}
			}
			.search_right {
				flex: 1;
				padding-bottom: 20px;
				text-align: right;
			}
		}
	}
	.myChart {
		margin-top: 15px;
		box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
		position: relative;
		.echarts_radio {
			position: absolute;
			top: 30px;
			right: 80px;
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
		.used {
			color: #ee9415;
			background: #fff3e2;
			padding: 5px 10px;
			border-radius: 2px;
		}
		.using {
			color: #297aff;
			background: #e8f3ff;
			padding: 5px 10px;
			border-radius: 2px;
		}
		.completed {
			color: #999999;
		}
		.expired {
			color: #999999;
		}
	}
}
</style>
