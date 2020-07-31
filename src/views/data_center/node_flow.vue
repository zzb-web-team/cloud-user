<template>
	<section class="myself-container content">
		<div class="top_title">节点流量监控</div>
		<div class="user-title" style="display: flex;flex-flow: column;">
			<div class="resources_con">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<div
						style="display: flex;align-items: center;flex-flow: row;margin-top: 20px;padding:20px 37px;background:rgba(255,255,255,1);box-shadow:0px 2px 3px 0px rgba(6,17,36,0.14);border-radius:2px;margin-left:45px;margin-right:45px;"
					>
						<el-input
							placeholder="请输入加速域名"
							v-model="value_url"
							class="input-with-select"
							maxlength="70"
							@keyup.enter.native="getdata"
							style="width:10%;margin-right:10px;"
						>
							<i
								slot="prefix"
								class="el-input__icon el-icon-search"
								@click="getdata()"
							></i>
						</el-input>
						<el-input
							placeholder="请输入加速内容名称"
							v-model="value"
							class="input-with-select"
							maxlength="70"
							@keyup.enter.native="getdata"
							style="width:10%;margin-right:10px;"
						>
							<i
								slot="prefix"
								class="el-input__icon el-icon-search"
								@click="getdata()"
							></i>
						</el-input>
						<span
							style="margin-right:10px;margin-left:15px;"
							v-show="activeName == 'first'"
							>节点渠道：</span
						>
						<el-select
							v-show="activeName == 'first'"
							v-model="terminalName"
							placeholder="全部节点渠道"
							style="width: 10%;margin-right: 10px;"
							@change="getdata()"
						>
							<el-option label="全部" value="-1"></el-option>
							<el-option label="云链" value="0"></el-option>
							<el-option label="西柚机" value="1"></el-option>
							<el-option label="其他" value="2"></el-option>
						</el-select>
						<span style="margin-right:10px;margin-left:15px;"
							>日期:</span
						>
						<el-radio-group
							v-model="radio"
							size="medium"
							@change="sele_time()"
							v-show="!shoudzyx"
						>
							<el-radio-button label="1">今天</el-radio-button>
							<el-radio-button label="2">昨天</el-radio-button>
							<el-radio-button label="3">近7天</el-radio-button>
							<el-radio-button label="4">近30天</el-radio-button>
							<el-radio-button label="5">自定义</el-radio-button>
						</el-radio-group>
						<el-button
							type="primary"
							v-show="shoudzyx"
							style="background:#409EFF;border:#409EFF"
							@click="setshoudzyx"
							>自定义</el-button
						>
						<el-date-picker
							v-show="shoudzyx"
							style="margin-left:10px;"
							v-model="val2"
							:type="
								activeName == 'third'
									? 'daterange'
									: 'datetimerange'
							"
							:picker-options="pickerOptions"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							align="left"
							@change="gettimes"
						></el-date-picker>
						<el-button
							style="margin-left:10px;"
							type="primary"
							@click="getdata()"
							>查询</el-button
						>
					</div>
					<el-tab-pane label="节点加速流量" name="first">
						<div class="device_form">
							<div
								id="myChart1"
								:style="{ height: '607px' }"
							></div>
						</div>
						<div class="devide_table">
							<el-row type="flex" class="row_active">
								<el-col :span="24">
									<el-table
										:data="tablecdn"
										border
										height="600"
										style="width: 98%;margin:10px;"
										:cell-style="rowClass"
										:header-cell-style="headClass"
									>
										<el-table-column label="P2P播放流量">
											<template slot-scope="scope">
												<div>
													{{
														scope.row.dataFlow
															| updatabkb
													}}
												</div>
											</template>
										</el-table-column>
										<el-table-column
											label="下行节点回源流量"
										>
											<template slot-scope="scope">
												<div>
													{{
														scope.row.dataFlow
															| updatabkb
													}}
												</div>
											</template>
										</el-table-column>
										<el-table-column
											label="下行CDN回源流量"
										>
											<template slot-scope="scope">
												<div>
													{{
														scope.row.dataFlow
															| updatabkb
													}}
												</div>
											</template>
										</el-table-column>
										<el-table-column label="时间">
											<template slot-scope="scope">
												<div>
													{{
														scope.row.timeStamp
															| settimes
													}}
												</div>
											</template>
										</el-table-column>
									</el-table>
									<fenye
										style="float:right;margin:10px 0 20px 0;"
										@fatherMethod="getpage"
										@fathernum="gettol"
										:pagesa="total_cnt"
										:currentPage="currentPage"
									></fenye>
								</el-col>
							</el-row>
						</div>
					</el-tab-pane>
					<el-tab-pane label="TOP加速流量" name="second">
						<div class="devide_table">
							<div class="tab_top_btn">
								<el-radio-group
									v-model="radio_top"
									@tab-click="topClick"
								>
									<el-radio-button label="1"
										>TOP加速次数排行</el-radio-button
									>
									<el-radio-button label="2"
										>TOP加速流量排行</el-radio-button
									>
								</el-radio-group>
							</div>
							<el-row
								type="flex"
								class="row_active"
								v-show="radio_top == 1"
							>
								<el-col :span="24">
									<el-table
										:data="tablecdn"
										border
										height="600"
										style="width: 98%;margin:10px;"
										:cell-style="rowClass"
										:header-cell-style="headClass"
									>
										<el-table-column
											label="加速内容名称"
											prop="dataFlow"
										>
										</el-table-column>
										<el-table-column
											label="加速域名"
											prop="dataFlow"
										>
										</el-table-column>
										<el-table-column
											label="加速次数"
											prop="dataFlow"
										>
										</el-table-column>
										<el-table-column
											label="加速次数占比"
											prop="timeStamp"
										>
										</el-table-column>
									</el-table>
									<fenye
										style="float:right;margin:10px 0 20px 0;"
										@fatherMethod="getpage"
										@fathernum="gettol"
										:pagesa="total_cnt"
										:currentPage="currentPage"
									></fenye>
								</el-col>
							</el-row>
							<el-row
								type="flex"
								class="row_active"
								v-show="radio_top != 1"
							>
								<el-col :span="24">
									<el-table
										:data="tablecdn"
										border
										height="600"
										style="width: 98%;margin:10px;"
										:cell-style="rowClass"
										:header-cell-style="headClass"
									>
										<el-table-column
											label="加速内容名称"
											prop="dataFlow"
										>
										</el-table-column>
										<el-table-column
											label="加速域名"
											prop="dataFlow"
										>
										</el-table-column>
										<el-table-column
											label="加速流量"
											prop="dataFlow"
										>
										</el-table-column>
										<el-table-column
											label="流量占比"
											prop="timeStamp"
										>
										</el-table-column>
									</el-table>
									<fenye
										style="float:right;margin:10px 0 20px 0;"
										@fatherMethod="getpage"
										@fathernum="gettol"
										:pagesa="total_cnt"
										:currentPage="currentPage"
									></fenye>
								</el-col>
							</el-row>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</section>
</template>

<script>
import {
	dateToMs,
	getymdtime,
	getlocaltimes,
	formatBytes,
	formatBkb,
	formatBorb,
} from '../../servers/sevdate';
import fenye from '@/components/fenye';
import echarts from 'echarts';
export default {
	data() {
		return {
			activeName: 'first',
			pickerOptions: {
				onPick: ({ maxDate, minDate }) => {
					this.minDate = minDate;
					this.maxDate = maxDate;
				},
				disabledDate: (time) => {
					let curDate = new Date().getTime();
					let two = 365 * 2 * 24 * 3600 * 1000;
					let twoyear = curDate - two;
					let three = 30 * 3 * 24 * 3600 * 1000;
					if (this.minDate) {
						return (
							time.getTime() > Date.now() ||
							time.getTime() < twoyear ||
							time > new Date(this.minDate.getTime() + three) ||
							time < new Date(this.minDate.getTime() - three)
						);
					}
					return (
						time.getTime() > Date.now() || time.getTime() < twoyear
					);
				},
			},
			shoudzyx: false,
			value_url: '',
			value: '',
			terminalName: '',
			radio: 1,
			radio_top: 1,
			val2: '',
			starttime: 0,
			endtime: 0,
			timeUnit: 5,
			tablecdn: [],
			total_cnt: 0,
			currentPage: 1,
			pagesize: 10,
		};
	},
	components: { fenye },
	mounted() {
		var _this = this;
		setTimeout(function() {
			_this.set_myChart1();
		}, 1500);
	},
	methods: {
		//节点流量
		get_node_flow() {
			this.set_myChart1();
		},
		//TOP加速流量排行
		get_top_flow_table() {},
		//TOP加速次数排行
		get_top_flow_num() {},
		//tab切换
		handleClick() {
			sessionStorage.setItem('tab_name', this.activeName); //添加到sessionStorage
			if (this.activeName == 'first') {
				this.get_node_flow();
			} else {
				if (this.radio_top == 1) {
					this.get_top_flow_num();
				} else {
					this.get_top_flow_table();
				}
			}
		},
		topClick() {
			if (this.radio_top == 1) {
				this.get_top_flow_num();
			} else {
				this.get_top_flow_table();
			}
		},
		//搜索框事件
		getdata() {
			this.sele_time();
		},
		//获取页码
		getpage(pages) {
			this.currentPage = pages;
			if (this.activeName == 'first') {
				this.get_node_flow();
			} else {
				if (this.radio_top == 1) {
					this.get_top_flow_num();
				} else {
					this.get_top_flow_table();
				}
			}
		},
		//获取每页数量
		gettol(pagetol) {
			this.pagesize = pagetol;
			// this.getuserlist();
		},
		//自定义按钮切换
		setshoudzyx() {
			this.shoudzyx = !this.shoudzyx;
		},
		//时间按钮点选
		sele_time() {
			if (this.radio == 1) {
				this.shoudzyx = false;
				this.today();
			} else if (this.radio == 2) {
				this.shoudzyx = false;
				this.yesterday();
			} else if (this.radio == 3) {
				this.shoudzyx = false;
				this.sevendat();
			} else if (this.radio == 4) {
				this.shoudzyx = false;
				this.thirtyday();
			} else if (this.radio == 5) {
				this.shoudzyx = true;
			}
		},
		//今天
		today() {
			let times =
				new Date(new Date().toLocaleDateString()).getTime() / 1000;
			this.starttime = times;
			this.endtime = Date.parse(new Date()) / 1000;
			this.timeUnit = 5;
			if (this.activeName == 'first') {
				this.get_node_flow();
			} else {
				if (this.radio_top == 1) {
					this.get_top_flow_num();
				} else {
					this.get_top_flow_table();
				}
			}
		},
		//昨天
		yesterday() {
			let times =
				new Date(new Date().toLocaleDateString()).getTime() / 1000;
			this.starttime = times - 24 * 60 * 60 * 1;
			this.endtime = times - 1;
			this.timeUnit = 5;
			if (this.activeName == 'first') {
				this.get_node_flow();
			} else {
				if (this.radio_top == 1) {
					this.get_top_flow_num();
				} else {
					this.get_top_flow_table();
				}
			}
		},
		//七天
		sevendat() {
			let times =
				new Date(new Date().toLocaleDateString()).getTime() / 1000;
			this.starttime = times - 24 * 60 * 60 * 6;
			this.endtime = Date.parse(new Date()) / 1000;
			this.timeUnit = 60;
			this.settimeunit(this.starttime, this.endtime);
			if (this.activeName == 'first') {
				this.get_node_flow();
			} else {
				if (this.radio_top == 1) {
					this.get_top_flow_num();
				} else {
					this.get_top_flow_table();
				}
			}
		},
		//三十天
		thirtyday() {
			let times =
				new Date(new Date().toLocaleDateString()).getTime() / 1000;
			this.starttime = times - 24 * 60 * 60 * 29;
			this.endtime = Date.parse(new Date()) / 1000;
			this.timeUnit = 1440;
			if (this.activeName == 'first') {
				this.get_node_flow();
			} else {
				if (this.radio_top == 1) {
					this.get_top_flow_num();
				} else {
					this.get_top_flow_table();
				}
			}
		},
		//自定义时间
		gettimes(cal) {
			if (this.val2 == null) {
				this.starttime =
					new Date(new Date().toLocaleDateString()).getTime() / 1000;
				this.endtime = Date.parse(new Date()) / 1000 - 1;
			} else {
				this.starttime = dateToMs(this.val2[0]);
				this.endtime = dateToMs(this.val2[1]);
			}
			this.settimeunit(this.starttime, this.endtime);
			if (this.activeName == 'first') {
				this.get_node_flow();
			} else {
				if (this.radio_top == 1) {
					this.get_top_flow_num();
				} else {
					this.get_top_flow_table();
				}
			}
		},
		//设置时间粒度
		settimeunit(sratime, endtime) {
			if (endtime - sratime <= 86400) {
				this.timeUnit = 5;
			} else if (86400 < endtime - sratime <= 2592000) {
				this.timeUnit = 60;
			} else if (endtime - sratime > 2592000) {
				this.timeUnit = 1440;
			}
		},
		// 表头样式设置
		headClass() {
			return 'text-align: center;background:#F3F6FB;';
		},
		// 表格样式设置
		rowClass() {
			return 'text-align: center;';
		},
		set_myChart1() {
			var data1 = [320, 302, 301, 334, 390, 330, 320];
			var data2 = [120, 132, 101, 134, 90, 230, 210];
			var data3 = [220, 182, 191, 234, 290, 330, 310];
			var time = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
			var _this = this;
			// 基于准备好的dom，初始化echarts实例
			let myChart = this.$echarts.init(
				document.getElementById('myChart1')
			);
			window.onresize = myChart.resize;
			// 绘制图表
			let options = {
				title: {
					text: '流量',
					left: 'left',
					textStyle: {
						color: '#333333',
						fontSize: 16,
					},
				},
				animation: false,
				legend: {
					// orient: 'vertical',
					x: 'center', //可设定图例在左、右、居中
					y: 'bottom', //可设定图例在上、下、居中
					padding: [0, 0, 0, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
					data: [
						'P2P播放流量',
						'下行节点回源流量',
						'下行CDN回源流量',
					],
				},
				tooltip: {
					trigger: 'axis',
					textStyle: {
						align: 'left',
					},
					// formatter: function(params) {
					// 	let num = params[0].dataIndex;
					// },
				},
				toolbox: {
					//show: true,
					itemSize: 20,
					itemGap: 30,
					right: 50,
					feature: {
						mydow: {
							show: true,
							title: '导出',
							icon:
								'path://M552 586.178l60.268-78.53c13.45-17.526 38.56-20.83 56.085-7.38s20.829 38.56 7.38 56.085l-132 172c-16.012 20.863-47.454 20.863-63.465 0l-132-172c-13.45-17.526-10.146-42.636 7.38-56.085 17.525-13.45 42.635-10.146 56.084 7.38L472 586.177V152c0-22.091 17.909-40 40-40s40 17.909 40 40v434.178zM832 512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 61.856-50.144 112-112 112H224c-61.856 0-112-50.144-112-112V512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 17.673 14.327 32 32 32h576c17.673 0 32-14.327 32-32V512z',
							onclick: function() {
								_this.export_tab3();
							},
						},
					},
				},
				grid: {
					left: '6%', // 默认10%，给24就挺合适的。
					top: 60, // 默认60
					right: 60, // 默认10%
					bottom: 100, // 默认60
				},
				xAxis: {
					data: time,
					splitLine: {
						show: false,
					},
				},
				yAxis: [
					{
						type: 'value',
						show: true,
					},
				],

				series: [
					{
						name: 'P2P播放流量',
						type: 'bar',
						stack: 'p2p流量',
						data: data2,
						barMaxWidth: 30, //柱图宽度
						itemStyle: {
							normal: {
								color: '#8FC0FF', //柱形图圆角，初始化效果
							},
						},
						label: {
							normal: {
								show: false,
								position: 'inside',
								color: '#333333',
								fontSize: 10,
							},
						},
					},
					{
						name: '下行CDN回源流量',
						type: 'bar',
						stack: '使用情况',
						data: data1,
						barMaxWidth: 30, //柱图宽度
						itemStyle: {
							normal: {
								color: '#FFA57E',
								barBorderRadius: [2, 2, 0, 0],
							},
							//柱形图圆角，鼠标移上去效果
							emphasis: {
								barBorderRadius: [2, 2, 0, 0],
							},
						},
						label: {
							normal: {
								show: false,
								position: 'inside',
								color: '#ffffff',
								fontSize: 10,
							},
						},
					},
					{
						name: '下行节点回源流量',
						type: 'bar',
						stack: '使用情况',
						data: data3,
						barMaxWidth: 30, //柱图宽度
						itemStyle: {
							normal: {
								color: '#FFD9BA',
							},
						},
						label: {
							normal: {
								show: false,
								position: 'inside',
								color: '#ffffff',
								fontSize: 10,
							},
						},
					},
				],
			};
			myChart.setOption(options);
		},
	},
};
</script>

<style lang="scss" scoped>
.myself-container {
	width: 100%;
	.device_form {
		width: auto;
		height: auto;
		margin-top: 20px;
		margin-right: 45px;
		margin-left: 45px;
		background: #ffffff;
		padding: 15px 30px;
		box-sizing: border-box;
		box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
		border-radius: 2px;

		.bottom {
			margin-top: 20px;
		}

		.el-form-item__label {
			white-space: nowrap;
		}

		.el-form-item {
			margin-bottom: 0px;
			margin-left: 10px;
		}

		.row_activess {
			margin-top: 20px;
			display: flex;
			justify-content: flex-start;
		}

		.div_show {
			width: auto;
			display: flex;
			height: 40px;
			justify-content: center;
			align-items: center;
			color: #409eff;
			cursor: pointer;
			margin-left: 20px;
		}
	}
	.devide_table {
		padding: 35px;
		height: auto;
		margin-left: 45px;
		margin-right: 45px;
		margin-top: 20px;
		background: #ffffff;
		border-radius: 2px;
		box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
		border-radius: 2px;
		.el-table td,
		.el-table th {
			padding: 6px 0px;
		}
		.tab_top_btn {
			text-align: left;
			margin-left: 10px;
		}
	}
}
</style>
