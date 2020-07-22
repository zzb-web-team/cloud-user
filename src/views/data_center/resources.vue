<template>
	<section class="myself-container content">
		<div class="top_title">资源监控</div>
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
							v-show="activeName != 'fourth'"
						>
							<i
								slot="prefix"
								class="el-input__icon el-icon-search"
								@click="getdata()"
							></i>
						</el-input>
						<el-input
							placeholder="请输入加速内容名称"
							v-model="value1"
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
							>终端:</span
						>
						<el-select
							v-model="acce"
							placeholder="终端"
							style="width: 10%;margin-right: 10px;"
							@change="getdata()"
							v-show="activeName == 'first'"
						>
							<el-option label="全部" value="*"></el-option>
							<el-option
								v-for="(item, index) in accelist"
								:key="index + 'vadio'"
								:label="item.label"
								:value="item.label"
							></el-option>
						</el-select>
						<span
							style="margin-right:10px;margin-left:15px;"
							v-show="
								activeName == 'first' || activeName == 'second'
							"
							>区域:</span
						>
						<el-cascader
							v-show="
								activeName == 'first' || activeName == 'second'
							"
							style="width: 10%;margin-right: 10px;line-height: 36px;"
							placeholder="区域"
							:options="optionsa2"
							ref="cascaderAddr"
							:show-all-levels="false"
							v-model="value2"
							@change="getdata"
						></el-cascader>
						<span
							style="margin-right:10px;margin-left:15px;"
							v-show="
								activeName == 'first' || activeName == 'second'
							"
							>运营商:</span
						>
						<el-select
							v-show="
								activeName == 'first' || activeName == 'second'
							"
							v-model="value3"
							placeholder="运营商"
							style="width: 10%;margin-right: 10px;"
							@change="getdata()"
						>
							<el-option label="全部" value="*"></el-option>
							<el-option
								v-for="(item, index) in optionsa3"
								:key="item + index"
								:label="item.label"
								:value="item.label"
							></el-option>
						</el-select>
						<span
							style="margin-right:10px;margin-left:15px;"
							v-show="activeName == 'third'"
							>终端类型：</span
						>
						<el-select
							v-show="activeName == 'third'"
							v-model="terminalName"
							placeholder="终端类型"
							style="width: 10%;margin-right: 10px;"
							@change="getdata()"
						>
							<el-option label="全部" value="-1"></el-option>
							<el-option label="android" value="1"></el-option>
							<el-option label="ios" value="0"></el-option>
							<el-option label="其他" value="2"></el-option>
						</el-select>
						<span style="margin-right:10px;margin-left:15px;"
							>日期:</span
						>
						<el-radio-group
							v-model="radio1"
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
						<!-- <el-button-group>
							<el-button v-show="!shoudzyx" @click="today()"
								>今天</el-button
							>
							<el-button v-show="!shoudzyx" @click="yesterday()"
								>昨天</el-button
							>
							<el-button v-show="!shoudzyx" @click="sevendat()"
								>近7天</el-button
							>
							<el-button v-show="!shoudzyx" @click="thirtyday()"
								>近30天</el-button
							>
							<el-button @click="showzdyx">
								自定义
								<i class="el-icon-date"></i>
							</el-button>
						</el-button-group> -->
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

					<el-tab-pane label="P2P加速流量" name="first">
						<div class="device_form">
							<div
								id="myChart"
								:style="{ height: '607px' }"
							></div>
						</div>
						<div class="devide_table">
							<el-row type="flex" class="row_active">
								<el-col
									:span="24"
									style="text-align:left;font-weight: bold;padding-left: 10px;"
									>加速流量</el-col
								>
							</el-row>
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
										<el-table-column label="总流量">
											<template slot-scope="scope">
												<div>
													{{
														scope.row.dataFlow
															| updatabkb
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
					<el-tab-pane label="P2P回源流量" name="second">
						<div class="device_form" style>
							<div
								id="myChart1"
								:style="{ height: '607px' }"
							></div>
						</div>
					</el-tab-pane>
					<el-tab-pane label="流量占比" name="third">
						<el-row class="resources_percentage">
							<el-col :span="4">
								<p>{{ totalp2p }}</p>
								<p>P2P流量</p>
							</el-col>
							<el-col :span="4">
								<p>{{ totalcdn }}</p>
								<p>CDN流量</p>
							</el-col>
						</el-row>
						<div id="liuliang_echarts"></div>
						<div class="devide_table">
							<el-row type="flex" class="row_active">
								<el-col :span="24">
									<el-table
										:data="tableflow"
										border
										height="600"
										style="width: 98%;margin:10px;"
										:cell-style="rowClass"
										:header-cell-style="headClass"
									>
										<el-table-column label="加速内容名称">
											<template slot-scope="scope">
												<div>
													{{ scope.row.urlname }}
												</div>
											</template>
										</el-table-column>
										<el-table-column label="播放URL">
											<template slot-scope="scope">
												<div>
													{{ scope.row.playurl }}
												</div>
											</template>
										</el-table-column>
										<el-table-column label="P2P加速流量">
											<template slot-scope="scope">
												<div>
													{{
														scope.row.p2pflow
															| updatabkb
													}}
												</div>
											</template>
										</el-table-column>
										<el-table-column label="PCDN加速流量">
											<template slot-scope="scope">
												<div>
													{{
														scope.row.cdnflow
															| updatabkb
													}}
												</div>
											</template>
										</el-table-column>
										<el-table-column label="P2P流量占比">
											<template slot-scope="scope">
												<div>
													{{
														(
															scope.row
																.p2ppercent *
															100
														).toFixed(2)
													}}%
												</div>
											</template>
										</el-table-column>
										<el-table-column label="CDN流量占比">
											<template slot-scope="scope">
												<div>
													{{
														(
															scope.row
																.cdnpercent *
															100
														).toFixed(2)
													}}%
												</div>
											</template>
										</el-table-column>
										<el-table-column
											label="统计时间"
											width="300px"
										>
											<template slot-scope="scope">
												<div>
													{{
														scope.row.stime
															| settimes
													}}-{{
														scope.row.etime
															| settimes
													}}
												</div>
											</template>
										</el-table-column>
									</el-table>
									<fenye
										style="float:right;margin:10px 0 20px 0;"
										@fatherMethod="flowgetpage"
										@fathernum="flowgettol"
										:pagesa="flowtotal_cnt"
										:currentPage="flowcurrentPage"
									></fenye>
								</el-col>
							</el-row>
						</div>
					</el-tab-pane>
					<el-tab-pane label="流量监控" name="fourth">
						<div id="jiankong_echarts"></div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</section>
</template>

<script>
var _this;
import {
	dateToMs,
	getymdtime,
	getlocaltimes,
	formatBytes,
	formatBkb,
	formatBorb,
} from '../../servers/sevdate';
import fenye from '@/components/fenye';
import {
	accelerate_flow_query_conditions,
	accelerate_flow,
	accelerate_flow_table,
	backsource_flow_query_conditions,
	backsource_flow,
	getvideo,
	getterminal,
	export_accelerate_flow_file,
	export_backsource_flow_file,
	sdk_flow,
	sdk_flow_table,
	sdk_flow_control,
	export_sdk_flow_table_user_file,
	export_sdk_flow_control_user_file,
} from '../../servers/api';
import echarts from 'echarts';
export default {
	data() {
		return {
			radio1: '1',
			currentPage: 1,
			flowcurrentPage: 1,
			flowtotal_cnt: 0,
			shoudzyx: false,
			showzdyz: false,
			acce: '*',
			pagenum: 0,
			accelist: [],
			options1: [],
			options2: [],
			options3: [],
			options4: [],
			optionsa1: [],
			optionsa2: [
				{
					value: -1,
					label: '全部',
				},
				{
					value: '华北',
					label: '华北',
					children: [
						{
							value: '北京',
							label: '北京',
						},
						{
							value: '内蒙古',
							label: '内蒙古',
						},
						{
							value: '山西',
							label: '山西',
						},
						{
							value: '河北',
							label: '河北',
						},
						{
							value: '天津',
							label: '天津',
						},
					],
				},
				{
					value: '西北',
					label: '西北',
					children: [
						{
							value: '宁夏',
							label: '宁夏',
						},
						{
							value: '陕西',
							label: '陕西',
						},
						{
							value: '甘肃',
							label: '甘肃',
						},
						{
							value: '青海',
							label: '青海',
						},
						{
							value: '新疆',
							label: '新疆',
						},
					],
				},
				{
					value: '东北',
					label: '东北',
					children: [
						{
							value: '黑龙江',
							label: '黑龙江',
						},
						{
							value: '吉林',
							label: '吉林',
						},
						{
							value: '辽宁',
							label: '辽宁',
						},
					],
				},
				{
					value: '华东',
					label: '华东',
					children: [
						{
							value: '福建',
							label: '福建',
						},
						{
							value: '江苏',
							label: '江苏',
						},
						{
							value: '安徽',
							label: '安徽',
						},
						{
							value: '山东',
							label: '山东',
						},
						{
							value: '上海',
							label: '上海',
						},
						{
							value: '浙江',
							label: '浙江',
						},
					],
				},
				{
					value: '华中',
					label: '华中',
					children: [
						{
							value: '河南',
							label: '河南',
						},
						{
							value: '湖北',
							label: '湖北',
						},
						{
							value: '江西',
							label: '江西',
						},
						{
							value: '湖南',
							label: '湖南',
						},
					],
				},
				{
					value: '西南',
					label: '西南',
					children: [
						{
							value: '贵州',
							label: '贵州',
						},
						{
							value: '云南',
							label: '云南',
						},
						{
							value: '重庆',
							label: '重庆',
						},
						{
							value: '四川',
							label: '四川',
						},
						{
							value: '西藏',
							label: '西藏',
						},
					],
				},
				{
					value: '华南',
					label: '华南',
					children: [
						{
							value: '广东',
							label: '广东',
						},
						{
							value: '广西',
							label: '广西',
						},
						{
							value: '海南',
							label: '海南',
						},
					],
				},
				{
					value: '其他',
					label: '其他',
					children: [
						{
							value: '香港',
							label: '香港',
						},
						{
							value: '澳门',
							label: '澳门',
						},
						{
							value: '台湾',
							label: '台湾',
						},
					],
				},
			],
			optionsa3: [
				{ value: 0, label: '移动' },
				{ value: 1, label: '联通' },
				{ value: 2, label: '电信' },
				{ value: 3, label: '其他' },
			],
			optionsa4: [],
			value1: '',
			value_url: '',
			value2: -1,
			value3: '*',
			value4: '',
			valuea1: '',
			valuea2: '',
			valuea3: '',
			valuea4: '',
			tablecdn: [],
			activeName: 'first',
			terminalName: '',
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
			// value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
			val2: [],
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
			timeUnit: 1,
			starttime: '',
			endtime: '',
			dataFlowArray: [], //图1
			timeArray: [], //图1
			dataFlowArray2: [], //图2
			timeArray2: [], //图2
			pageSize: 10, //每页数量
			pageNo: 1, //当前页码
			total_cnt: 0, //数据总量3
			flowtotal_cnt: 0,
			chanid: '',
			dataFlownum: 0,
			dataFlownum2: 0,
			vadio_page: 0,
			unitdata: 'B',
			totalp2p: '0B',
			totalcdn: '0B',
			tableflow: [],
			p2parr: [],
			cdnarr: [],
			tab3arr: [],
			flow4_data: [],
			flow4_time: [],
			iosp2parray: [],
			ioscdnarray: [],
			andriodp2parray: [],
			andriodcdnarray: [],
			zhanbitimearray: [],
		};
	},
	filters: {
		settimes(data) {
			var stat = getymdtime(data);
			return stat;
		},
		updatabkb(data) {
			if (data == 0) {
				return 0 + 'B';
			} else {
				function formatB(a, b) {
					if (0 == a) return '0 Bytes';
					var c = 1024,
						d = b || 2,
						e = [
							'Bytes',
							'KB',
							'MB',
							'GB',
							'TB',
							'PB',
							'EB',
							'ZB',
							'YB',
						],
						f = Math.floor(Math.log(a) / Math.log(c));
					return (
						parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
					);
				}
				return formatB(data);
			}
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
		if (this.$route.query.urldata) {
			this.value1 = this.$route.query.urldata.url_name;
		}
		this.starttime =
			new Date(new Date().toLocaleDateString()).getTime() / 1000;
		this.endtime = Date.parse(new Date()) / 1000;
		this.settimeunit(this.starttime, this.endtime);

		// this.getseachlabel1();
		// this.configure()
		this.getlabrl2();
		if (sessionStorage.getItem('tab_name')) {
			this.activeName = sessionStorage.getItem('tab_name');
			if (this.activeName == 'first') {
				this.gettable1();
			} else if (this.activeName == 'second') {
				this.gettable2();
			} else if (this.activeName == 'third') {
				this.getflow3();
			} else {
				this.getflow4();
			}
		} else {
			this.getseachlabel1();
		}
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
		showzdyzs() {
			this.showzdyz = !this.showzdyz;
		},
		showzdyx() {
			this.shoudzyx = !this.shoudzyx;
		},
		//获取页码
		getpage(pages) {
			this.currentPage = pages;
			this.getbot();
		},
		//获取每页数量
		gettol(pagetol) {
			this.pagesize = pagetol;
			// this.getuserlist();
		},
		//获取页码
		flowgetpage(pages) {
			this.flowcurrentPage = pages;
			this.gettable3();
		},
		//获取每页数量
		flowgettol(pagetol) {
			this.flowpagesize = pagetol;
			// this.getuserlist();
		},
		getdata() {
			this.currentPage = 1;
			this.flowcurrentPage = 1;
			if (this.activeName == 'first') {
				this.gettable1();
			} else if (this.activeName == 'second') {
				this.gettable2();
			} else if (this.activeName == 'third') {
				this.getflow3();
			} else {
				this.getflow4();
			}
		},
		getdata1() {
			this.gettable2();
		},

		/** 请求数据 */
		//加速流量加载查询条件
		getseachlabel1() {
			let params = new Object();
			params.chanid = this.chanid + '';
			accelerate_flow_query_conditions(params)
				.then((res) => {
					if (res.status == 0) {
						if (res.data.ispSet.length > 0) {
							this.optionsa3 = [];
							res.data.ispSet.forEach((item, index) => {
								let obj = {};
								obj.value = index;
								obj.label = item;
								this.optionsa3.push(obj);
							});
						} else {
							this.$message('暂无数据');
						}
						this.gettable1();
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((Error) => {});
		},
		//请求数据--加速流量条形图
		gettable1() {
			this.dataFlowArray = [];
			this.timeArray = [];
			let params = new Object();
			params.start_ts = this.starttime;
			params.end_ts = this.endtime;
			params.chanId = this.chanid + '';
			if (this.value1) {
				params.fileName = this.value1;
			} else {
				params.fileName = '*';
			}
			if (this.value2[1] && this.value2 != -1) {
				params.region = this.value2[1];
			} else {
				params.region = '*';
			}
			if (this.value3) {
				params.isp = this.value3;
			} else {
				params.isp = '*';
			}
			params.acce = this.acce;
			params.time_unit = this.timeUnit;
			accelerate_flow(params)
				.then((res) => {
					if (res.status == 0) {
						// this.dataFlowArray = res.data.streamArray;
						let maxnum = Math.max(...res.data.streamArray);
						if (maxnum == 0) {
							this.unitdata = 'B';
						} else {
							this.unitdata = formatBytes(maxnum);
						}
						res.data.streamArray.forEach((item, index) => {
							this.dataFlowArray.push(
								formatBkb(item, this.unitdata)
							);
						});
						this.dataFlownum = res.data.streamArray.length - 1;
						let upcli = Math.floor(this.dataFlownum / 12);
						res.data.timeArray.forEach((item, index) => {
							this.timeArray.push(getlocaltimes(item));
							// if (
							// 	index == 0 ||
							// 	index == this.dataFlownum ||
							// 	(index % upcli == 0 && index < upcli * 11)
							// ) {
							// 	this.timeArray.push(getlocaltimes(item));
							// } else {
							// 	this.timeArray.push('');
							// }
						});
					} else if (res.status == -1) {
						this.$message('暂无数据');
					} else {
						this.$message.error(res.msg);
					}
					this.getbot();
					this.drawLine();
				})
				.catch((err) => {});
		},
		//请求数据--加速流量表格
		getbot() {
			let params = new Object();
			params.start_ts = this.starttime;
			params.end_ts = this.endtime;
			params.chanId = this.chanid + '';
			if (this.value1) {
				params.fileName = this.value1;
			} else {
				params.fileName = '*';
			}
			if (this.value2[1] && this.value2 != -1) {
				params.region = this.value2[1];
			} else {
				params.region = '*';
			}
			if (this.value3) {
				params.isp = this.value3;
			} else {
				params.isp = '*';
			}
			params.pageNo = this.currentPage - 1;
			params.pageSize = this.pageSize;
			params.acce = this.acce;
			accelerate_flow_table(params)
				.then((res) => {
					if (res.status == 0) {
						this.total_cnt = res.data.totalCnt;
						this.tablecdn = [];
						if (res.data.timeArray.length > 0) {
							res.data.timeArray.forEach((item, index) => {
								let obj = {};
								obj.timeStamp = item;
								obj.dataFlow = res.data.streamArray[index];
								this.tablecdn.push(obj);
							});
						}
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {});
		},
		gettable2() {
			this.dataFlowArray2 = [];
			this.timeArray2 = [];
			let params = new Object();
			params.start_ts = this.starttime;
			params.end_ts = this.endtime;
			params.chanId = this.chanid + '';
			if (this.value1) {
				params.fileName = this.value1;
			} else {
				params.fileName = '*';
			}
			if (this.value2[1] && this.value2 != -1) {
				params.region = this.value2[1];
			} else {
				params.region = '*';
			}
			if (this.value3) {
				params.isp = this.value3;
			} else {
				params.isp = '*';
			}
			params.time_unit = this.timeUnit;
			params.acce = '*';
			backsource_flow(params)
				.then((res) => {
					if (res.status == 0) {
						let maxnum = Math.max(...res.data.streamArray);
						if (maxnum == 0) {
							this.unitdata = 'B';
						} else {
							this.unitdata = formatBytes(maxnum);
						}
						res.data.streamArray.forEach((item, index) => {
							this.dataFlowArray2.push(
								formatBkb(item, this.unitdata)
							);
						});
						this.dataFlownum2 = res.data.streamArray.length - 1;
						let upcli = Math.floor(this.dataFlownum2 / 12);
						res.data.timeArray.forEach((item, index) => {
							this.timeArray2.push(
								getlocaltimes(item, this.unitdata)
							);
							// if (
							// 	index == 0 ||
							// 	index == this.dataFlownum2 ||
							// 	(index % upcli == 0 && index < upcli * 11)
							// ) {
							// 	this.timeArray2.push(getlocaltimes(item));
							// } else {
							// 	this.timeArray2.push('');
							// }
						});
					} else if (res.status == -1) {
						this.$message('暂无数据');
						this.dataFlowArray2 = this.dataFlowArray;
						this.timeArray2 = this.timeArray;
					} else {
						this.$message.error(res.msg);
					}
					this.drawLine1();
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
		//流量占比图表
		getflow3() {
			this.zhanbitimearray = [];
			let parmas = new Object();
			parmas.channelId = this.chanid;
			// parmas.chanid = '*';
			if (this.terminalName == '') {
				parmas.terminalName = -1;
			} else {
				parmas.terminalName = this.terminalName * 1;
			}
			if (this.value1 == '') {
				parmas.domain = '*';
			} else {
				parmas.domain = this.value1;
			}
			if (this.value_url == '') {
				parmas.urlName = '*';
			} else {
				parmas.urlName = this.value_url;
			}
			parmas.endTs = this.endtime;
			parmas.startTs = this.starttime;
			if (parmas.endTs - parmas.startTs > 86400) {
				parmas.timeUnit = 1440;
			} else {
				parmas.timeUnit = 60;
			}
			sdk_flow(parmas)
				.then((res) => {
					if (res.status == 0) {
						this.totalp2p = formatBorb(res.data.totalp2p);
						this.totalcdn = formatBorb(res.data.totalcdn);
						this.cdnarr = res.data.cdnarray;
						this.p2parr = res.data.p2parray;
						res.data.timearray.forEach((item, index) => {
							this.zhanbitimearray.push(getlocaltimes(item));
						});
						this.gettable3();
						this.drawLine2();
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((error) => {});
		},
		//流量占比表格
		gettable3() {
			let parmas = new Object();
			parmas.channelId = this.chanid;
			parmas.pageNo = this.flowcurrentPage - 1;
			if (this.terminalName == '') {
				parmas.terminalName = -1;
			} else {
				parmas.terminalName = this.terminalName * 1;
			}
			if (this.value1 == '') {
				parmas.domain = '*';
			} else {
				parmas.domain = this.value1;
			}
			if (this.value_url == '') {
				parmas.urlName = '*';
			} else {
				parmas.urlName = this.value_url;
			}
			parmas.endTs = this.endtime;
			parmas.startTs = this.starttime;
			if (parmas.endTs - parmas.startTs > 86400) {
				parmas.timeUnit = 1440;
			} else {
				parmas.timeUnit = 60;
			}
			sdk_flow_table(parmas)
				.then((res) => {
					if (res.status == 0) {
						this.tableflow = res.data.list;
						this.flowtotal_cnt = res.data.totalCnt;
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((error) => {});
		},
		//流量监控图表
		getflow4() {
			this.flow4_time = [];
			let parmas = new Object();
			parmas.channelId = this.chanid;
			if (this.value1 == '') {
				parmas.domain = '*';
			} else {
				parmas.domain = this.value1;
			}
			parmas.terminalName = -1;
			parmas.endTs = this.endtime;
			parmas.startTs = this.starttime;
			if (parmas.endTs - parmas.startTs > 2505600) {
				parmas.timeUnit = 1440;
			} else {
				parmas.timeUnit = 30;
			}
			//parmas.timeUnit = this.timeUnit;
			sdk_flow_control(parmas)
				.then((res) => {
					if (res.status == 0) {
						let iosmaxnum = Math.max(...res.data.iospstreamarray);
						let ioscmaxnum = Math.max(...res.data.ioscstreamarray);
						let andriodmaxnum = Math.max(
							...res.data.andriodpstreamarray
						);
						let andriodcmaxnum = Math.max(
							...res.data.andriodcstreamarray
						);
						if (iosmaxnum != 0) {
							this.unitdata = formatBytes(iosmaxnum);
						} else if (ioscmaxnum != 0) {
							this.unitdata = formatBytes(ioscmaxnum);
						} else if (andriodmaxnum != 0) {
							this.unitdata = formatBytes(andriodmaxnum);
						} else if (andriodcmaxnum != 0) {
							this.unitdata = formatBytes(andriodcmaxnum);
						} else {
							this.unitdat = 'B';
						}
						this.iosp2parray = res.data.iospstreamarray;
						this.ioscdnarray = res.data.ioscstreamarray;
						this.andriodp2parray = res.data.andriodpstreamarray;
						this.andriodcdnarray = res.data.andriodcstreamarray;

						res.data.timeArray.forEach((item, index) => {
							this.flow4_time.push(getlocaltimes(item));
						});
						this.drawLine3();
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((error) => {});
		},
		//加速流量导出
		export_accelerate() {
			let params = new Object();
			params.start_ts = this.starttime;
			params.end_ts = this.endtime;
			params.chanId = this.chanid + '';
			if (this.value1) {
				params.fileName = this.value1;
			} else {
				params.fileName = '*';
			}
			if (this.value2[1] && this.value2 != -1) {
				params.region = this.value2[1];
			} else {
				params.region = '*';
			}
			if (this.value3) {
				params.isp = this.value3;
			} else {
				params.isp = '*';
			}
			params.acce = this.acce;
			params.time_unit = this.timeUnit;
			export_accelerate_flow_file(params)
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
		//回源统计导出
		export_backsource() {
			let params = new Object();
			params.start_ts = this.starttime;
			params.end_ts = this.endtime;
			params.chanId = this.chanid + '';
			if (this.value1) {
				params.fileName = this.value1;
			} else {
				params.fileName = '*';
			}
			if (this.value2[1] && this.value2 != -1) {
				params.region = this.value2[1];
			} else {
				params.region = '*';
			}
			if (this.value3) {
				params.isp = this.value3;
			} else {
				params.isp = '*';
			}
			params.time_unit = this.timeUnit;
			params.acce = this.acce;
			export_backsource_flow_file(params)
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
		export_tab3() {
            let parmas = new Object();
			parmas.channelId = this.chanid;
			// parmas.chanid = '*';
			if (this.terminalName == '') {
				parmas.terminalName = -1;
			} else {
				parmas.terminalName = this.terminalName * 1;
			}
			if (this.value1 == '') {
				parmas.domain = '*';
			} else {
				parmas.domain = this.value1;
			}
			if (this.value_url == '') {
				parmas.urlName = '*';
			} else {
				parmas.urlName = this.value_url;
			}
			parmas.endTs = this.endtime;
			parmas.startTs = this.starttime;
			if (parmas.endTs - parmas.startTs > 86400) {
				parmas.timeUnit = 1440;
			} else {
				parmas.timeUnit = 60;
			}
			export_sdk_flow_table_user_file(parmas)
				.then((res) => {
					if (res.status == 0) {
						window.open(res.msg, '_blank');
					} else {
						this.$message.error('导出失败');
					}
				})
				.catch((error) => {});
		},
		export_tab4() {
			let parmas = new Object();
			parmas.channelId = this.chanid;
			if (this.value1 == '') {
				parmas.domain = '*';
			} else {
				parmas.domain = this.value1;
			}
			parmas.terminalName = -1;
			parmas.endTs = this.endtime;
			parmas.startTs = this.starttime;
			if (parmas.endTs - parmas.startTs > 2505600) {
				parmas.timeUnit = 1440;
			} else {
				parmas.timeUnit = 30;
			}
			export_sdk_flow_control_user_file(parmas)
				.then((res) => {
					if (res.status == 0) {
						window.open(res.msg, '_blank');
					} else {
						this.$message.error('导出失败');
					}
				})
				.catch((error) => {});
		},
		seachtu(data) {
			if (this.activeName == 'first') {
				this.gettable1();
			} else if (this.activeName == 'second') {
				this.gettable2();
			} else if (this.activeName == 'third') {
				this.getflow3();
			} else {
				this.getflow4();
			}
		},
		setshoudzyx() {
			this.shoudzyx = !this.shoudzyx;
			if (this.shoudzyx != true) {
				this.radio1 = 1;
				this.val2 = '';
			}
			this.sele_time();
		},
		sele_time() {
			this.currentPage = 1;
			this.flowcurrentPage = 1;
			if (this.radio1 == 1) {
				this.shoudzyx = false;
				this.val2 = '';
				this.today();
			} else if (this.radio1 == 2) {
				this.shoudzyx = false;
				this.val2 = '';
				this.yesterday();
			} else if (this.radio1 == 3) {
				this.shoudzyx = false;
				this.val2 = '';
				this.sevendat();
			} else if (this.radio1 == 4) {
				this.shoudzyx = false;
				this.val2 = '';
				this.thirtyday();
			} else if (this.radio1 == 5) {
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
				this.gettable1();
			} else if (this.activeName == 'second') {
				this.gettable2();
			} else if (this.activeName == 'third') {
				this.getflow3();
			} else {
				this.getflow4();
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
				this.gettable1();
			} else if (this.activeName == 'second') {
				this.gettable2();
			} else if (this.activeName == 'third') {
				this.getflow3();
			} else {
				this.getflow4();
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
				this.gettable1();
			} else if (this.activeName == 'second') {
				this.gettable2();
			} else if (this.activeName == 'third') {
				this.getflow3();
			} else {
				this.getflow4();
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
				this.gettable1();
			} else if (this.activeName == 'second') {
				this.gettable2();
			} else if (this.activeName == 'third') {
				this.getflow3();
			} else {
				this.getflow4();
			}
		},
		//自定义时间
		gettimes(cal) {
			console.log(this.val2, cal);
			if (this.val2 == null) {
				this.starttime =
					new Date(new Date().toLocaleDateString()).getTime() / 1000;
				this.endtime = Date.parse(new Date()) / 1000 - 1;
			} else {
				this.starttime = dateToMs(this.val2[0]);
				this.endtime = dateToMs(this.val2[1]);
			}
			this.settimeunit(this.starttime, this.endtime);
			console.log(this.starttime);
			console.log(this.endtime);
			console.log(this.settimeunit(this.starttime, this.endtime));
			if (this.activeName == 'first') {
				this.gettable1();
			} else if (this.activeName == 'second') {
				this.gettable2();
			} else if (this.activeName == 'third') {
				this.getflow3();
			} else {
				this.getflow4();
			}
		},
		gettimes_host(cal) {
			console.log(this.val2, cal);
			if (this.val2 == null) {
				this.starttime =
					new Date(new Date().toLocaleDateString()).getTime() / 1000;
				this.endtime = Date.parse(new Date()) / 1000;
			} else {
				this.starttime = dateToMs(this.val2[0]);
				this.endtime = dateToMs(this.val2[1]);
			}
			this.settimeunit(this.starttime, this.endtime);
			this.gettable2();
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
		handleClick(tab, event) {
			sessionStorage.setItem('tab_name', this.activeName); //添加到sessionStorage
			// this.starttime =
			//   new Date(new Date().toLocaleDateString()).getTime() / 1000;
			// this.endtime = Date.parse(new Date()) / 1000;
			// this.settimeunit(this.starttime, this.endtime);
			if (tab.index == 0) {
				this.gettable1();
			} else if (tab.index == 1) {
				this.gettable2();
			} else if (tab.index == 2) {
				this.getflow3();
				// setTimeout(() => {
				// 	this.drawLine2();
				// }, 1500);
			} else {
				this.getflow4();
				// setTimeout(() => {
				// 	this.drawLine3();
				// }, 1500);
			}
		},
		drawLine() {
			let _this = this;
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
						// magicType: { show: true, type: ['line', 'bar'] },
						// restore: { show: true },
						// saveAsImage: { show: false },
						mydow: {
							show: true,
							title: '导出',
							icon:
								'path://M552 586.178l60.268-78.53c13.45-17.526 38.56-20.83 56.085-7.38s20.829 38.56 7.38 56.085l-132 172c-16.012 20.863-47.454 20.863-63.465 0l-132-172c-13.45-17.526-10.146-42.636 7.38-56.085 17.525-13.45 42.635-10.146 56.084 7.38L472 586.177V152c0-22.091 17.909-40 40-40s40 17.909 40 40v434.178zM832 512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 61.856-50.144 112-112 112H224c-61.856 0-112-50.144-112-112V512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 17.673 14.327 32 32 32h576c17.673 0 32-14.327 32-32V512z',
							onclick: function() {
								_this.export_accelerate();
							},
						},
					},
				},
				grid: {
					// 间距是 根据x、y轴计算的；假如都是0，x、y轴的label汉字就隐藏掉了。
					left: '8%', // 默认10%，给24就挺合适的。
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
					type: 'category',
					boundaryGap: false,
					data: this.timeArray,
					axisTick: {
						show: false,
					},
					axisLabel: {
						// interval: 0, //代表显示所有x轴标签
						// rotate: -30, //代表逆时针旋转45度
						textStyle: {
							color: '#999',
						},
					},
				},
				yAxis: {
					name: _this.unitdata,
				},
				series: [
					{
						name: '流量',
						type: 'bar',
						barMaxWidth: 30, //柱图宽度
						data: this.dataFlowArray,
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
								// 		return colorList[0];
								// 	} else {
								// 		return colorList[1];
								// 	}
								// },
							},
						},
						showBackground: true,
						backgroundStyle: {
							color: 'rgba(220, 220, 220, 0.8)',
						},
					},
					// {
					//     type: 'bar',
					//     itemStyle:{normal:{color:"#e8e8e8"}},
					//     barGap:"-100%",
					//     // barGategoryGap:30,
					//     data:[300,300,300,300,300,300,300,300,300,300,300,300,],
					//     animation:false,

					// }
				],
				//   dataZoom : [
				// 	{
				//           type: 'slider',
				//           show: true,
				//           start: 94,
				//           end: 100,
				//           handleSize: 8
				//       },
				//       {
				//           type: 'inside',
				//           start: 94,
				//           end: 100
				//       },
				//       {
				//           type: 'slider',
				//           show: true,
				//           yAxisIndex: 0,
				//           filterMode: 'empty',
				//           width: 12,
				//           height: '70%',
				//           handleSize: 8,
				//           showDataShadow: false,
				//           left: '93%'
				//       }
				// ]
			};
			myChart.setOption(options);
		},
		drawLine1() {
			let _this = this;
			// 基于准备好的dom，初始化echarts实例
			let myChart = this.$echarts.init(
				document.getElementById('myChart1')
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
						// magicType: { show: true, type: ['line', 'bar'] },
						// restore: { show: true },
						// saveAsImage: { show: false },
						mydow: {
							show: true,
							title: '导出',
							icon:
								'path://M552 586.178l60.268-78.53c13.45-17.526 38.56-20.83 56.085-7.38s20.829 38.56 7.38 56.085l-132 172c-16.012 20.863-47.454 20.863-63.465 0l-132-172c-13.45-17.526-10.146-42.636 7.38-56.085 17.525-13.45 42.635-10.146 56.084 7.38L472 586.177V152c0-22.091 17.909-40 40-40s40 17.909 40 40v434.178zM832 512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 61.856-50.144 112-112 112H224c-61.856 0-112-50.144-112-112V512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 17.673 14.327 32 32 32h576c17.673 0 32-14.327 32-32V512z',
							onclick: function() {
								_this.export_backsource();
							},
						},
					},
				},
				grid: {
					// 间距是 根据x、y轴计算的；假如都是0，x、y轴的label汉字就隐藏掉了。
					left: '8%', // 默认10%，给24就挺合适的。
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
					type: 'category',
					boundaryGap: false,
					data: this.timeArray2,
					// axisLabel: {
					// 	interval: 0, //代表显示所有x轴标签
					// },
					axisTick: {
						show: false,
					},
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
						data: this.dataFlowArray2,
						itemStyle: {
							normal: {
								lineStyle: {
									color: '#297AFF', //线的颜色
								},
								//每根柱子颜色设置
								// color: function(params) {
								// 	let colorList = ['#297AFF', '#297AFF00'];
								// 	let upcli = Math.floor(
								// 		_this.dataFlownum2 / 12
								// 	);
								// 	let data_index = params.dataIndex;
								// 	if (
								// 		(data_index % upcli == 0 &&
								// 			data_index < upcli * 11) ||
								// 		data_index == 0 ||
								// 		data_index == _this.dataFlownum2
								// 	) {
								// 		return colorList[0];
								// 	} else {
								// 		return colorList[1];
								// 	}
								// },
							},
						},
					},
				],
			};
			myChart.setOption(options);
		},
		drawLine2() {
			var data1 = [];
			var data2 = [];
			this.cdnarr.map((item) => {
				data1.push((item * 100).toFixed(1));
			});
			this.p2parr.map((item) => {
				data2.push((item * 100).toFixed(1));
			});
			var data3 = (function() {
				var datas = [];
				for (var i = 0; i < data1.length; i++) {
					datas.push(data1[i] * 1 + data2[i] * 1);
				}
				return datas;
			})();
			var time = this.zhanbitimearray;
			var _this = this;
			// 基于准备好的dom，初始化echarts实例
			let myChart = this.$echarts.init(
				document.getElementById('liuliang_echarts')
			);
			window.onresize = myChart.resize;
			// 绘制图表
			let options = {
				title: {
					text: 'P2P流量/CDN流量占比图',
					left: 'center',
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
					data: ['P2P流量', 'CDN流量'],
				},
				tooltip: {
					trigger: 'axis',
				},
				toolbox: {
					//show: true,
					itemSize: 20,
					itemGap: 30,
					right: 50,
					feature: {
						// mark: { show: true },
						// dataView: { show: true, readOnly: false },
						// magicType: { show: true, type: ['line', 'bar'] },
						// restore: { show: true },
						// saveAsImage: { show: false },
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
						axisLabel: {
							show: true,
							interval: 'auto',
							formatter: '{value} %',
						},
						show: true,
					},
					{
						splitLine: {
							show: true,
						},
						axisTick: {
							//y轴刻度线
							show: true,
						},
					},
				],

				series: [
					{
						name: 'CDN流量',
						type: 'bar',
						stack: '使用情况',
						data: data1,
						barMaxWidth: 30, //柱图宽度
						itemStyle: {
							normal: {
								color: '#394989',
							},
						},
						label: {
							normal: {
								show: true,
								position: 'insideLeft',
								color: '#ffffff',
							},
						},
					},
					{
						name: 'P2P流量',
						type: 'bar',
						stack: '使用情况',
						data: data2,
						barMaxWidth: 30, //柱图宽度
						itemStyle: {
							normal: {
								color: '#64A7FC', //柱形图圆角，初始化效果
								color: new echarts.graphic.LinearGradient(
									0,
									1,
									0,
									0,
									[
										{ offset: 0, color: '#3977E6' },
										{ offset: 1, color: '#37BBF8' },
									]
								),
								barBorderRadius: [4, 4, 0, 0],
							},

							//柱形图圆角，鼠标移上去效果
							emphasis: {
								barBorderRadius: [4, 4, 0, 0],
							},
						},
						label: {
							normal: {
								show: true,
								position: 'insideLeft',
								color: '#333333',
							},
						},
					},
					{
						name: '总计',
						type: 'line',
						stack: '总量',
						symbol: 'none',
						label: {
							normal: {
								show: true,
								formatter: '{c}',
								textStyle: { color: '#333333' },
							},
						},
						itemStyle: {
							normal: {
								color: 'rgba(128, 128, 128, 0)',
							},
						},
						data: data3,
					},
				],
			};
			myChart.setOption(options);
		},
		drawLine3() {
			let datatime = this.flow4_time;
			let data1 = this.iosp2parray;
			let data2 = this.ioscdnarray;
			let data3 = this.andriodp2parray;
			let data4 = this.andriodcdnarray;
			let _this = this;
			// 基于准备好的dom，初始化echarts实例
			let myChart = this.$echarts.init(
				document.getElementById('jiankong_echarts')
			);
			window.onresize = myChart.resize;
			// 绘制图表
			let options = {
				title: {
					text: '流量监控',
					left: '12px',
					textStyle: {
						color: '#333333',
						fontSize: 16,
					},
				},
				toolbox: {
					//show: true,
					itemSize: 20,
					itemGap: 30,
					right: 50,
					feature: {
						// mark: { show: true },
						// dataView: { show: true, readOnly: false },
						// magicType: { show: true, type: ['line', 'bar'] },
						// restore: { show: true },
						// saveAsImage: { show: false },
						mydow: {
							show: true,
							title: '导出',
							icon:
								'path://M552 586.178l60.268-78.53c13.45-17.526 38.56-20.83 56.085-7.38s20.829 38.56 7.38 56.085l-132 172c-16.012 20.863-47.454 20.863-63.465 0l-132-172c-13.45-17.526-10.146-42.636 7.38-56.085 17.525-13.45 42.635-10.146 56.084 7.38L472 586.177V152c0-22.091 17.909-40 40-40s40 17.909 40 40v434.178zM832 512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 61.856-50.144 112-112 112H224c-61.856 0-112-50.144-112-112V512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 17.673 14.327 32 32 32h576c17.673 0 32-14.327 32-32V512z',
							onclick: function() {
								_this.export_tab4();
							},
						},
					},
				},
				legend: {
					// orient: 'vertical',
					x: 'center', //可设定图例在左、右、居中
					y: 'bottom', //可设定图例在上、下、居中
					padding: [0, 0, 0, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
					data: ['IOS-P2P', 'IOS-CDN', '安卓-P2P', '安卓-CDN'],
				},
				tooltip: {
					trigger: 'axis',
				},
				grid: {
					left: '6%', // 默认10%，给24就挺合适的。
					top: 60, // 默认60
					right: 60, // 默认10%
					bottom: 100, // 默认60
				},
				xAxis: {
					data: datatime,
					splitLine: {
						show: false,
                    },
                    
				},
				yAxis: {
					splitLine: {
						show: true,
					},
					axisTick: {
						//y轴刻度线
						show: true,
                    },
                    name:_this.unitdata
				},
				series: [
					{
						name: 'IOS-P2P',
						type: 'line',
						data: data1.map((item)=>{
                            return formatBkb(item,_this.unitdata);
                        }),
						smooth: false,
						// symbol: 'star', //拐点样式
						// symbolSize: 8, //拐点大小
						itemStyle: {
							normal: {
								color: '#E8505B',
							},
						},
						label: {
							normal: {
								show: true,
								position: 'insideRight',
								color: '#E8505B',
								fontSize: 18,
								formatter: (params) => {
									if (data1.length - 1 == params.dataIndex) {
										return 'IOS-P2P';
									} else {
										return '';
									}
								},
							},
						},
					},
					{
						name: 'IOS-CDN',
						type: 'line',
						data: data2.map((item)=>{
                            return formatBkb(item,_this.unitdata);
                        }),
						smooth: false,
						// symbol: 'triangle', //拐点样式
						// symbolSize: 8, //拐点大小
						itemStyle: {
							normal: { color: '#14B1AB' },
						},
						label: {
							normal: {
								show: true,
								position: 'insideRight',
								color: '#14B1AB',
								fontSize: 18,
								formatter: (params) => {
									if (data2.length > 2) {
										if (
											data2.length - 2 ==
											params.dataIndex
										) {
											return 'IOS-CDN';
										} else {
											return '';
										}
									} else if (
										data2.length - 1 ==
										params.dataIndex
									) {
										return 'IOS-CDN';
									} else {
										return '';
									}
								},
							},
						},
					},
					{
						name: '安卓-P2P',
						type: 'line',
						data: data3.map((item)=>{
                            return formatBkb(item,_this.unitdata);
                        }),
						smooth: false,
						// symbol: 'pin', //拐点样式
						// symbolSize: 8, //拐点大小
						itemStyle: {
							normal: { color: '#F2C33C' },
						},
						label: {
							normal: {
								show: true,
								position: 'insideRight',
								color: '#F2C33C',
								fontSize: 18,
								formatter: (params) => {
									if (data3.length > 3) {
										if (
											data3.length - 3 ==
											params.dataIndex
										) {
											return '安卓-P2P';
										} else {
											return '';
										}
									} else if (
										data3.length - 1 ==
										params.dataIndex
									) {
										return '安卓-P2P';
									} else {
										return '';
									}
								},
							},
						},
					},
					{
						name: '安卓-CDN',
						type: 'line',
						data: data4.map((item)=>{
                            return formatBkb(item,_this.unitdata);
                        }),
						smooth: false,
						itemStyle: {
							normal: { color: '#5970CC' },
						},
						label: {
							normal: {
								show: true,
								position: 'insideRight',
								color: '#5970CC',
								fontSize: 18,
								formatter: (params) => {
									if (data4.length > 4) {
										if (
											data4.length - 4 ==
											params.dataIndex
										) {
											return '安卓-CDN';
										} else {
											return '';
										}
									} else if (
										data4.length - 1 ==
										params.dataIndex
									) {
										return '安卓-CDN';
									} else {
										return '';
									}
								},
							},
						},
					},
				],
			};
			myChart.setOption(options);
		},
	},
	destroyed: function() {
		sessionStorage.removeItem('tab_name');
	},
};
</script>

<style lang="scss">
.myself-container {
	width: 100%;
	// min-width: 1600px;
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
	}

	.devide_pageNation {
		width: 100%;
		height: auto;
		// overflow: hidden;
		margin-top: 20px;

		.devide_pageNation_active {
			float: right;
		}
	}
	.resources_percentage {
		background: #ffffff;
		margin-left: 45px;
		margin-right: 45px;
		padding-left: 30px;
		padding-top: 15px;
		padding-bottom: 15px;
		margin-top: 24px;
		box-shadow: rgba(6, 17, 36, 0.14) 0px 2px 3px 0px;
		.el-col {
			height: 100px;
			background: rgba(247, 247, 251, 1);
			border-radius: 8px;
			p:nth-child(1) {
				color: #333333;
				font-size: 24px;
				margin-top: 30px;
			}
			p:nth-child(2) {
				color: #656565;
				font-size: 14px;
			}
		}
		.el-col:nth-child(1) {
			margin-right: 24px;
		}
	}
	#liuliang_echarts,
	#jiankong_echarts {
		margin-top: 24px;
		margin-left: 45px;
		margin-right: 45px;
		height: 632px;
		padding-top: 35px;
		padding-bottom: 20px;
		background: rgba(255, 255, 255, 1);
		border-radius: 2px;
		box-shadow: rgba(6, 17, 36, 0.14) 0px 2px 3px 0px;
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

// .user-title .user-item {
//   padding: 25px;
//   border-radius: 5px;
//   display: flex;
//   justify-content: center;
//   flex-direction: column;
// }
</style>
