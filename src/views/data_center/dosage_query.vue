<template>
	<section class="myself-container content">
		<div class="top_title">资源用量</div>
		<div
			class="user-title"
			style="display: flex;flex-flow: column;margin: auto;margin-left:45px;margin-right:45px;"
		>
			<div
				style="display: flex;align-items: center;flex-flow: row;margin-top: 20px;padding: 20px;padding-left:37px;background:rgba(255,255,255,1);box-shadow:0px 0px 7px 0px rgba(41,108,171,0.1);border-radius:6px;"
			>
				<el-input
					placeholder="请输入加速内容名称"
					v-model="mvitem"
					class="input-with-select"
					maxlength="70"
					@keyup.enter.native="changmvitem"
					style="width:15%;margin-right:10px;"
				>
					<i
						slot="prefix"
						class="el-input__icon el-icon-search"
						@click="changmvitem()"
					></i>
				</el-input>
				<span style="margin-right:10px;margin-left:15px;">终端:</span>
				<el-select
					v-model="acc"
					placeholder="请选择终端"
					style="margin-right: 10px;"
					@change="changmvitem"
				>
					<el-option label="全部" value="*"></el-option>
					<el-option
						v-for="(item, index) in accelist"
						:key="index"
						:label="item.label"
						:value="item.label"
					>
					</el-option>
				</el-select>
				<span style="margin-right:10px;margin-left:15px;">日期:</span>
				<!-- <el-button-group>
					<el-button @click="today()">今天</el-button>
					<el-button @click="yesterday()">昨天</el-button>
					<el-button @click="sevendat()">近7天</el-button>
					<el-button @click="thirtyday()">近30天</el-button>
					<el-button @click="showzi()">自定义</el-button>
				</el-button-group> -->
				<div style="min-width: 385px;">
					<el-radio-group
						v-model="radio1"
						size="medium"
						@change="sele_time()"
					>
						<el-radio-button label="1">今天</el-radio-button>
						<el-radio-button label="2">昨天</el-radio-button>
						<el-radio-button label="3">近7天</el-radio-button>
						<el-radio-button label="4">近30天</el-radio-button>
						<el-radio-button label="5">自定义</el-radio-button>
					</el-radio-group>
				</div>
				<el-date-picker
					v-show="showdate"
					style="margin-left:10px;"
					v-model="value2"
					type="datetimerange"
					:picker-options="pickerOptions"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					align="left"
					@change="gettimes"
				></el-date-picker>
				<!-- <el-button style="margin-left:10px;" type="primary" @click="seachtu"
          >查询</el-button
        > -->
			</div>
			<div style="margin-top:20px;">
				<el-row>
					<div class="user-item">
						<div class="item-text">使用流量</div>
						<div class="item-count">
							<span>{{ dataL }}&nbsp;{{ allunitdata }}</span>
						</div>
					</div>
				</el-row>
				<div class="device_form_query">
					<div id="myChart" :style="{ height: '607px' }"></div>
				</div>
				<div class="devide_tables">
					<el-row type="flex" class="row_active">
						<el-col
							:span="24"
							style="text-align:left;font-weight: bold;padding-left:10px;"
							>资源用量表</el-col
						>
					</el-row>
					<el-row type="flex" class="row_active">
						<el-col :span="24">
							<el-table
								:data="tablecdn"
								border
								stripe
								style="width: 100%;margin:10px;"
								:cell-style="rowClass"
								:header-cell-style="headClass"
							>
								<el-table-column label="时间">
									<template slot-scope="scope">
										<div>
											{{ scope.row.timeStamp | settimes }}
										</div>
									</template></el-table-column
								>
								<el-table-column label="总流量">
									<template slot-scope="scope">
										<div>
											{{ scope.row.dataFlow | zhuanb }}
										</div>
									</template>
								</el-table-column>
							</el-table>
						</el-col>
					</el-row>
					<fenye
						style="float:right;margin:10px 0 20px 0;"
						@fatherMethod="getpage"
						@fathernum="gettol"
						:pagesa="total_cnt"
						:currentPage="currentPage"
						ref="fen"
					></fenye>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
var _this;
import echarts from 'echarts';
import fenye from '@/components/fenye';
import {
	dateToMs,
	getymdtime,
	getlocaltimes,
	formatBytes,
	formatBkb,
} from '../../servers/sevdate';
import {
	query_conditions,
	dataflow_curve,
	dataflow_table,
	getvideo,
	getterminal,
	export_dataflow_curve_file,
} from '../../servers/api';
export default {
	data() {
		return {
			radio1: '1',
			currentPage: 1,
			tablecdn: [
				// { timeStamp: "2018/05/01", dataFlow: "13585" },
				// { timeStamp: "2018/05/02", dataFlow: "2898915641" },
				// { timeStamp: "2018/05/03", dataFlow: "26846513" }
			],
			pagenum: 0,
			accelist: [],
			acc: '*',
			showdate: false,
			activeName: 'first',
			mvlist: [],
			mvitem: '',
			dataL: 0,
			minDate: '',
			maxDate: '',
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
			value1: [
				new Date(2000, 10, 10, 10, 10),
				new Date(2000, 10, 11, 10, 10),
			],
			value2: [],
			vadio_page: 0,
			rowHeader: [
				{
					prop: 'time',
					label: '节点ID',
				},
				{
					prop: 'totals',
					label: '使用流量',
				},
				{
					prop: 'online_devices',
					label: '传输次数',
				},
				{
					prop: 'average_online',
					label: '日期',
				},
			],
			rowHeader1: [
				{
					prop: 'time',
					label: '节点ID',
				},
				{
					prop: 'totals',
					label: '存储容量',
				},
				{
					prop: 'online_devices',
					label: '存储次数',
				},
				{
					prop: 'average_online',
					label: '日期',
				},
			],
			tableData: [
				{
					time: '测试数据1',
					totals: '测试数据1',
					online_devices: '测试数据1',
					average_online: '测试数据1',
					new_percent: '测试数据1',
				},
			],
			starttime: '',
			endtime: '',
			timeUnit: 1,
			pageSize: 10, //每页显示条数
			pageNo: 1, //页码
			total_cnt: 1, //数据总量
			dataFlowArray: [], //图
			timeArray: [], //图
			dataFlownum: 0,
			chanid: '',
            unitdata: 'B',
            allunitdata:'B',
		};
	},
	beforeCreate: function() {
		_this = this;
	},
	filters: {
		settimes(data) {
			var stat = getymdtime(data);
			return stat;
		},
		// zhuanb(data) {
		// 	return formatBkb(data, _this.unitdata) + _this.unitdata;
		// },
		zhuanb(a) {
			if (0 == a) return '0 B';
			var c = 1024;
			var d = 2;
			var e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			var f = Math.floor(Math.log(a) / Math.log(c));
			if (e[f] == 'TB' || e[f] == 'PB') {
				d = 4;
			}
			return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f];
		},
	},
	components: {
		fenye,
	},
	mounted() {
		if (this.$cookies.get('id')) {
			this.chanid = this.$cookies.get('id') * 1;
		} else {
			this.$router.push({ path: '/' });
		}
		this.starttime =
			new Date(new Date().toLocaleDateString()).getTime() / 1000;
		this.endtime = Date.parse(new Date()) / 1000;
		this.settimeunit(this.starttime, this.endtime);
		this.getlabrl2();
		this.getseach();
	},
	beforeDestroy() {
		if (!this.chart) {
			return;
		}
		this.chart.dispose();
		this.chart = null;
	},
	methods: {
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
		//生成今天的
		//获取页码
		getpage(pages) {
			this.currentPage = pages;
			this.getdtable();
		},
		//获取每页数量
		gettol(pagetol) {
			this.pagesize = pagetol;
			// this.getuserlist();
		},
		//请求数据--查询条件
		getseach() {
			let params = new Object();
			params.chanid = this.chanid + '';
			params.page = this.vadio_page;
			getvideo(params)
				.then((res) => {
					if (res.status == 0) {
						res.result.cols.forEach((item, index) => {
							let obj = {};
							obj.label = item.url_name;
							obj.value = index;
							this.mvlist.push(obj);
						});
						if (res.result.les_count == 0) {
							this.vadio_page = 0;
							this.gettu();
						} else {
							this.vadio_page++;
							this.getseach();
						}
					} else {
						this.$message.error(res.msg);
					}
				})

				.catch((err) => {});
		},
		//请求数据--柱形图
		gettu() {
			this.dataFlowArray = [];
			this.timeArray = [];
			let params = new Object();
			params.start_ts = this.starttime;
			params.end_ts = this.endtime;
			params.chanId = this.chanid + '';
			if (this.mvitem) {
				params.fileName = this.mvitem;
			} else {
				params.fileName = '*';
			}
			params.timeUnit = this.timeUnit;
			params.acce = this.acc;
			dataflow_curve(params)
				.then((res) => {
					if (res.status == 0) {
						if (res.data.totalUsage == 0) {
							this.dataL = 0;
							this.allunitdata = 'B';
						} else {
							this.allunitdata = formatBytes(res.data.totalUsage);
							this.dataL = formatBkb(
								res.data.totalUsage,
								this.allunitdata
							);
                        }
                        let maxnum = Math.max(...res.data.dataFlowArray);
                        if (maxnum == 0) {
							this.unitdata = 'B';
						} else {
							this.unitdata = formatBytes(maxnum);
						}
						res.data.dataFlowArray.forEach((item, index) => {
							this.dataFlowArray.push(
								formatBkb(item, this.unitdata)
							);
						});
						// this.dataFlowArray = res.data.dataFlowArray;
						this.dataFlownum = res.data.dataFlowArray.length - 1;

						let upcli = Math.floor(this.dataFlownum / 12);
						res.data.timeArray.forEach((item, index) => {
							this.timeArray.push(getlocaltimes(item));
							// if (
							// 	index == 0 ||
							// 	(index % upcli == 0 && index < upcli * 11) ||
							// 	index == this.dataFlownum
							// ) {
							// 	this.timeArray.push(getlocaltimes(item));
							// } else {
							// 	this.timeArray.push('');
							// }
						});
						this.getdtable();
						this.drawLine();
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {});
		},
		//请求数据--表格
		getdtable() {
			let params = new Object();
			params.start_ts = this.starttime;
			params.end_ts = this.endtime;
			params.chanId = this.chanid + '';
			if (this.mvitem) {
				params.fileName = this.mvitem;
			} else {
				params.fileName = '*';
			}
			if (params.end_ts - params.start_ts > 86400) {
				params.timeUnit = 1440;
			} else {
				params.timeUnit = 60;
			}
			params.pageNo = this.currentPage - 1;
			params.pageSize = this.pageSize;
			params.acce = this.acc;
			dataflow_table(params)
				.then((res) => {
					this.tablecdn = res.data.tableList;
					this.total_cnt = res.data.totalCnt;
				})
				.catch((err) => {});
		},
		//获取视频终端
		getlabrl2() {
			let parmas = new Object();
			parmas.chanid = this.chanid;
			parmas.page = this.pagenum;
			getterminal(parmas)
				.then((res) => {
					if (res.status == 0) {
						res.result.cols.forEach((item) => {
							let sdf = new Object();
							sdf.value = item.id;
							sdf.label = item.name;
							sdf.chanid = item.chanid;
							sdf.type = item.type;
							this.accelist.push(sdf);
						});
						if (res.result.les_count == 0) {
							return false;
						} else {
							this.pagenum++;
							this.getlabrl2();
						}
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((error) => {});
		},
		exportant_dataflow() {
			let params = new Object();
			params.start_ts = this.starttime;
			params.end_ts = this.endtime;
			params.chanId = this.chanid + '';
			if (this.mvitem) {
				params.fileName = this.mvitem;
			} else {
				params.fileName = '*';
			}
			params.timeUnit = this.timeUnit;
			params.acce = this.acc;
			export_dataflow_curve_file(params)
				.then((res) => {
					if (res.status == 0) {
						window.open(res.msg, '_blank');
					} else {
						this.$message.error('导出失败');
					}
				})
				.catch((error) => {
					console.log(error);
				});
		},
		//下拉框
		changmvitem() {
			this.currentPage = 1;
			console.log(this.$refs.fen);
			this.gettu();
		},
		sele_time() {
			this.currentPage = 1;
			if (this.radio1 == 1) {
				this.showdate = false;
				this.today();
			} else if (this.radio1 == 2) {
				this.showdate = false;
				this.yesterday();
			} else if (this.radio1 == 3) {
				this.showdate = false;
				this.sevendat();
			} else if (this.radio1 == 4) {
				this.showdate = false;
				this.thirtyday();
			} else if (this.radio1 == 5) {
				this.showdate = true;
			}
		},
		//今天
		today() {
			let times =
				new Date(new Date().toLocaleDateString()).getTime() / 1000;
			this.starttime = times;
			this.endtime = Date.parse(new Date()) / 1000;
			this.settimeunit(this.starttime, this.endtime);
			this.gettu();
		},
		//昨天
		yesterday() {
			let times =
				new Date(new Date().toLocaleDateString()).getTime() / 1000;
			this.starttime = times - 24 * 60 * 60 * 1;
			this.endtime = times - 1;
			this.settimeunit(this.starttime, this.endtime);
			this.gettu();
		},
		//七天
		sevendat() {
			let times =
				new Date(new Date().toLocaleDateString()).getTime() / 1000;
			this.starttime = times - 24 * 60 * 60 * 6;
			this.endtime = Date.parse(new Date()) / 1000;
			this.settimeunit(this.starttime, this.endtime);
			this.gettu();
		},
		//三十天
		thirtyday() {
			let times =
				new Date(new Date().toLocaleDateString()).getTime() / 1000;
			this.starttime = times - 24 * 60 * 60 * 29;
			this.endtime = Date.parse(new Date()) / 1000;
			this.settimeunit(this.starttime, this.endtime);
			this.gettu();
		},
		//自定义时间
		gettimes(e) {
			if (this.value2 == null) {
				this.starttime =
					new Date(new Date().toLocaleDateString()).getTime() / 1000;
				this.endtime = Date.parse(new Date()) / 1000 - 1;
			} else {
				this.starttime = dateToMs(this.value2[0]);
				this.endtime = dateToMs(this.value2[1]);
				this.settimeunit(this.starttime, this.endtime);
			}

			this.gettu();
		},
		//自定义按钮
		showzi() {
			this.showdate = !this.showdate;
		},
		//查询按钮
		seachtu() {
			this.gettu();
		},
		// 表头样式设置
		headClass() {
			return 'text-align: center;background:#F3F6FB;';
		},
		// 表格样式设置
		rowClass() {
			return 'text-align: center;';
		},
		//选项卡
		handleClick(tab, event) {},
		drawLine() {
			var _this = this;
			// 基于准备好的dom，初始化echarts实例
			let myChart = this.$echarts.init(
				document.getElementById('myChart')
			);
			window.onresize = myChart.resize;
			// 绘制图表
			let options = {
				title: {
					text: '流量',
				},
				toolbox: {
					//show: true,
					itemSize: 20,
					itemGap: 30,
					right: 50,
					feature: {
						// mark: { show: true },
						// dataView: { show: true, readOnly: false },
						//magicType: { show: true, type: ['line', 'bar'] },
						//设置按钮(图标)的颜色
						//  magicType: {
						//     show: true,
						//     type: ['line', 'bar'],
						//     iconStyle: {
						//         borderColor: '#22bb22'
						//     },
						//     emphasis:{
						//         iconStyle: {
						//             borderColor: '#22bb22'
						//         },
						//     }
						// },
						// restore: { show: true },
						// saveAsImage: { show: false },
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
					top: 60, // 默认60
					right: 35, // 默认10%
					bottom: 60, // 默认60
					// width: "100%", // grid 组件的宽度。默认自适应。
					// height: "100%",
					// containLabel:true, // grid 区域是否包含坐标轴的刻度标签。(如果true的时候，上下左右可以为0了)
					// show:true, // 是否显示直角坐标系网格。是否显示grid，grid:show后，下面的一些参数生效。
					// backgroundColor:'#ccac62',
					// borderColor:"#000",
				},
				color: '#297AFF',
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
						label: {
							backgroundColor: '#6a7985',
						},
						shadowStyle: {
							// 阴影指示器样式设置
							// width: '30px', // 阴影大小
							color: 'rgba(150,150,150,0.3)', // 阴影颜色
						},
					},
					formatter: function(params) {
						return (
							params[0].name +
							'<br>' +
							params[0].seriesName +
							':' +
							params[0].data +
							_this.unitdata
						);
					},
				},
				xAxis: {
					data: this.timeArray,
					axisTick: {
						show: false,
					},
					// axisLabel: {
					// 	interval: 0, //代表显示所有x轴标签
					// },
				},
				yAxis: {
					name: _this.unitdata,
				},
				series: [
					{
						name: '流量',
						type: 'bar',
						// barWidth: 30, //柱图宽度
						barMaxWidth: 30,
						data: this.dataFlowArray,
						smooth: true, //设置折线图的弧度
						itemStyle: {
							normal: {
								lineStyle: {
									color: '#297AFF', //线的颜色
								},

								//每根柱子颜色设置
								// color: function(params) {
								// 	let colorList = ['#297AFF', '#297AFF00'];
								// 	let upcli = Math.floor(
								// 		_this.dataFlownum / 12
								// 	);
								// 	let data_index = params.dataIndex;
								// 	if (
								// 		(data_index % upcli == 0 &&
								// 			data_index < upcli * 11) ||
								// 		data_index == 0 ||
								// 		data_index == _this.dataFlownum
								// 	) {
								// 		return colorList[0]; /*  */
								// 	} else {
								// 		return colorList[1];
								// 	}
								// },
							},
							color: '#00FF00',
						},
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(
									0,
									0,
									0,
									1,
									[
										{ offset: 0, color: '#409EFF' },

										{ offset: 1, color: '#ffffff' },
									]
								),
							},
						}, //填充区域样式
					},
				],
				backgroundColor: '#FFFFFF',
			};
			myChart.setOption(options);
		},
	},
};
</script>

<style lang="scss">
.myself-container {
	width: 100%;
	// min-width: 1600px;

	.device_form_query {
		width: 100%;
		height: auto;
		overflow: hidden;
		margin-top: 20px;
		background: #ffffff;
		padding: 15px 30px;
		box-sizing: border-box;

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

	.devide_tables {
		padding: 35px;
		height: auto;
		overflow: hidden;
		margin-top: 20px;
		margin-left: 0;
		margin-right: 0;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
		border-radius: 2px;
		.el-table td,
		.el-table th {
			padding: 6px 0px;
		}

		.row_active {
			margin-top: 10px;
		}
	}

	.devide_pageNation {
		width: 100%;
		height: auto;
		overflow: hidden;
		margin-top: 20px;

		.devide_pageNation_active {
			float: right;
		}
	}
}

.addaccout {
	.el-form--label-left .el-form-item__label {
		text-align: right;
		width: 90px;
	}

	.el-form-item__error {
		margin-left: 80px;
	}
}
.user-item {
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 0px 7px 0px rgba(41, 108, 171, 0.1);
	border-radius: 2px;
	padding: 31px 31px 31px 67px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	text-align: left;
	.item-count {
		height: 50px;
		line-height: 50px;
		span {
			font-size: 26px;
			font-weight: 600;
		}
	}
}
</style>
