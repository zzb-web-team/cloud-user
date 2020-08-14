<template>
	<section class="myself-container content">
		<div class="top_title">播放流量</div>
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
						<el-select
							v-show="activeName == 'third'"
							v-model="terminalName"
							placeholder="终端类型"
							style="width: 10%;margin-right: 10px;"
							@change="getdata()"
						>
							<el-option label="全部" value="-1"></el-option>
							<el-option label="android" value="0"></el-option>
							<el-option label="ios" value="1"></el-option>
							<el-option label="其他" value="2"></el-option>
						</el-select>
						<el-select
							v-model="valueChanel"
							placeholder="全部节点渠道"
							style="width: 10%;margin-right: 10px;"
							@change="getdata()"
							>
							<el-option label="全部" value="-1"></el-option>
							<el-option label="云链" value="1"></el-option>
							<el-option label="西柚机" value="2"></el-option>
							<el-option label="其他" value="3"></el-option>
						</el-select>
						<!-- <span style="margin-right:10px;margin-left:15px;"
							>日期:</span
						> -->
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
						<!-- <el-button
							style="margin-left:10px;"
							type="primary"
							@click="getdata()"
							>查询</el-button
						> -->
					</div>
					<el-tab-pane label="播放流量占比" name="third">
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
										max-height="600"
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
										<el-table-column label="P2P加速流量(%)">
											<template slot-scope="scope">
												<div>
													{{
														scope.row.p2pflow
															| updatabkb
													}}({{
														(
															scope.row
																.p2ppercent *
															100
														).toFixed(2)
													}}%)
												</div>
											</template>
										</el-table-column>
										<el-table-column label="CDN加速流量(%)">
											<template slot-scope="scope">
												<div>
													{{
														scope.row.cdnflow
															| updatabkb
													}}({{
														(
															scope.row
																.cdnpercent *
															100
														).toFixed(2)
													}}%)
												</div>
											</template>
										</el-table-column>
										<el-table-column
											:render-header="renderHeader"
											label="节点有资源时CDN加速流量(%)"
										>
											<template slot-scope="scope">
												<div>
													{{
														scope.row.cdnactiveflow
															| updatabkb
													}}({{
														(
															scope.row
																.cdnactivepercent *
															100
														).toFixed(2)
													}}%)
												</div>
											</template>
										</el-table-column>
										<el-table-column
											:render-header="renderHeader"
											label="节点无资源时CDN加速流量(%)"
										>
											<template slot-scope="scope">
												<div>
													{{
														scope.row
															.cdnpassiveflow
															| updatabkb
													}}({{
														(
															scope.row
																.cdnpassivepercent *
															100
														).toFixed(2)
													}}%)
												</div>
											</template>
										</el-table-column>
										<el-table-column
											label="时间"
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
					<el-tab-pane label="播放流量终端" name="fourth">
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
			acce: '',
			pagenum: 0,
			valueChanel: '',
			value1: '',
			value_url: '',
			tablecdn: [],
			activeName: 'third',
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
			val2: [],
			timeUnit: 120,
			starttime: '',
			endtime: '',
			timeArray: [], //图1
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
			cdataArray: [],
			cdataArray: [],
			cdnpassivearray: [],
			cdnaactivearray: [],
			cdnpassivepercent: [],
			cdnpassivepercent: [],
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
		// this.chanid = '158000000032';
		if (this.$route.query.urldata) {
			this.value1 = this.$route.query.urldata.url_name;
		}
		this.starttime =
			new Date(new Date().toLocaleDateString()).getTime() / 1000;
		this.endtime = Date.parse(new Date()) / 1000;
		this.settimeunit(this.starttime, this.endtime);

		// this.getseachlabel1();
		// this.configure()
		// this.getlabrl2();

		if (sessionStorage.getItem('tab_name')) {
			this.activeName = sessionStorage.getItem('tab_name');
			if (this.activeName == 'third') {
				this.getflow3();
			} else {
				this.getflow4();
			}
		} else {
			this.activeName = 'third';
			this.getflow3();
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
		renderHeader(h, { column }) {
			const serviceContent = [
				h(
					'div',
					{
						slot: 'content',
						style: 'margin-bottom:5px',
					},
					'节点有资源缓存时，切换至CDN加速通道所产生的CDN加速流量'
				),
			];
			const paymentContent = h(
				'div',
				{
					slot: 'content',
				},
				'节点无资源缓存时，切换至CDN加速通道所产生的的CDN加速流量'
			);
			return h('div', [
				h('span', column.label),
				h(
					'el-tooltip',
					{
						props: {
							placement: 'top',
						},
					},
					[
						column.label == '节点有资源时CDN加速流量(%)'
							? serviceContent
							: paymentContent,
						h('i', {
							class: 'el-icon-warning-outline',
							style: 'color:orange;margin-left:5px;',
						}),
					]
				),
			]);
		},
		//设置时间粒度
		settimeunit(sratime, endtime) {
			if (endtime - sratime <= 86400) {
				this.timeUnit = 120;
			} else  {
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
			if (this.activeName == 'third') {
				this.getflow3();
			} else {
				this.getflow4();
			}
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
				parmas.urlName = '*';
			} else {
				parmas.urlName = this.value1;
			}
			if (this.value_url == '') {
				parmas.domain = '*';
			} else {
				parmas.domain = this.value_url;
			}
			if(this.valueChanel == ''){
				parmas.ipfsChannel = -1
			}else{
				parmas.ipfsChannel = this.valueChanel*1
			}
			parmas.endTs = this.endtime;
			parmas.startTs = this.starttime;
			if (parmas.endTs - parmas.startTs > 86400) {
				parmas.timeUnit = 1440;
			} else {
				parmas.timeUnit = 2*60;
			}
			sdk_flow(parmas)
				.then((res) => {
					if (res.status == 0) {
						this.totalp2p = formatBorb(res.data.totalp2p);
						this.totalcdn = formatBorb(res.data.totalcdn);
						//this.cdnarr = res.data.cdnarray;
						this.p2parr = res.data.p2parray;
						//this.cdataArray = res.data.cdataArray;
						this.pdataArray = res.data.pdataArray;

						this.cdnpassivearray = res.data.cdnpassivearray;
						this.cdnaactivearray = res.data.cdnaactivearray;
						this.cdnaactivepercent = res.data.cdnaactivepercent;
						this.cdnpassivepercent = res.data.cdnpassivepercent;

						let maxnum = Math.max(...res.data.cdnaactivearray);
						if (maxnum != 0) {
							this.unitdata = formatBytes(maxnum);
						} else {
							this.unitdat = 'B';
						}
						if (parmas.timeUnit == 60) {
							res.data.timearray.forEach((item, index) => {
								this.zhanbitimearray.push(getymdtime(item));
							});
						} else {
							res.data.timearray.forEach((item, index) => {
								this.zhanbitimearray.push(getymdtime(item, 1));
							});
						}
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
				parmas.urlName = '*';
			} else {
				parmas.urlName = this.value1;
			}
			if (this.value_url == '') {
				parmas.domain = '*';
			} else {
				parmas.domain = this.value_url;
			}
			if(this.valueChanel == ''){
				parmas.ipfsChannel = -1
			}else{
				parmas.ipfsChannel = this.valueChanel*1
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
			if (this.value_url == '') {
				parmas.domain = '*';
			} else {
				parmas.domain = this.value_url;
			}
			if (this.value1 == '') {
				parmas.urlName = '*';
			} else {
				parmas.urlName = this.value1;
			}
			if(this.valueChanel == ''){
				parmas.ipfsChannel = -1
			}else{
				parmas.ipfsChannel = this.valueChanel*1
			}
			parmas.terminalName = -1;
			parmas.endTs = this.endtime;
			parmas.startTs = this.starttime;
			if (parmas.endTs - parmas.startTs > 2505600) {
				parmas.timeUnit = 1440;
			} else {
				parmas.timeUnit = 5;
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
				parmas.urlName = '*';
			} else {
				parmas.urlName = this.value1;
			}
			if (this.value_url == '') {
				parmas.domain = '*';
			} else {
				parmas.domain = this.value_url;
			}
			if(this.valueChanel == ''){
				parmas.ipfsChannel = -1
			}else{
				parmas.ipfsChannel = this.valueChanel*1
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
				parmas.urlName = '*';
			} else {
				parmas.urlName = this.value1;
			}
			parmas.terminalName = -1;
			parmas.domain = '*';
			parmas.endTs = this.endtime;
			parmas.startTs = this.starttime;
			if (parmas.endTs - parmas.startTs > 2505600) {
				parmas.timeUnit = 1440;
			} else {
				parmas.timeUnit = 5;
			}
			if(this.valueChanel == ''){
				parmas.ipfsChannel = -1
			}else{
				parmas.ipfsChannel = this.valueChanel*1
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
			if (this.activeName == 'third') {
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
			if (this.activeName == 'third') {
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
			if (this.activeName == 'third') {
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
			if (this.activeName == 'third') {
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
			if (this.activeName == 'third') {
				this.getflow3();
			} else {
				this.getflow4();
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
			if (this.activeName == 'third') {
				this.getflow3();
			} else {
				this.getflow4();
			}
		},
		gettimes_host(cal) {
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
			this.starttime =
			  new Date(new Date().toLocaleDateString()).getTime() / 1000;
			this.endtime = Date.parse(new Date()) / 1000;
			this.settimeunit(this.starttime, this.endtime);
			this.value_url = "";
			this.value1 = "";
			this.terminalName = "";
			this.radio1 = 1;
			this.valueChanel = "";
			if (this.activeName == 'third') {
				this.getflow3();
			} else {
				this.getflow4();
			}
		},
		drawLine2() {
			var data1 = [];
			var data2 = [];
			var data3 = [];
			this.cdnaactivepercent.map((item) => {
				if (item * 100 >= 100 || item * 100 == 0) {
					data1.push((item * 100).toFixed(0));
				} else {
					data1.push((item * 100).toFixed(2));
				}
			});
			this.p2parr.map((item) => {
				if (item * 100 >= 100 || item * 100 == 0) {
					data2.push((item * 100).toFixed(0));
				} else {
					data2.push((item * 100).toFixed(2));
				}
			});
			this.cdnpassivepercent.map((item) => {
				if (item * 100 >= 100 || item * 100 == 0) {
					data3.push((item * 100).toFixed(0));
				} else {
					data3.push((item * 100).toFixed(2));
				}
			});

			// var data3 = (function() {
			// 	var datas = [];
			// 	for (var i = 0; i < data1.length; i++) {
			// 		// datas.push(data1[i] * 1 + data2[i] * 1);
			// 		datas.push(158200);
			// 	}
			// 	return datas;
			// })();
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
					data: ['P2P流量', 'CDN无源流量','CDN有源流量'],
				},
				tooltip: {
					trigger: 'axis',
					textStyle: {
						align: 'left',
					},
					formatter: function(params) {
                        let num = params[0].dataIndex;
						return (
							params[0].axisValue +
						    '</br>' +
						    params[0].marker+
							params[0].seriesName +
							formatBkb(_this.pdataArray[num], _this.unitdata) +'('+ params[0].value+"%"+")"+
                            '</br>' +
                             params[1].marker+
							params[1].seriesName +
							formatBkb(_this.cdnpassivearray[num], _this.unitdata) +'('+ params[1].value+"%"+")"+
						    '</br>' +
						    params[2].marker+
							params[2].seriesName +
							formatBkb(_this.cdnaactivearray[num], _this.unitdata)+'('+ params[2].value+"%"+")"
						);
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
				],

				series: [
                    {
						name: 'P2P流量',
						type: 'bar',
						stack: '使用情况',
						data: data2,
						barMaxWidth: 30, //柱图宽度
						itemStyle: {
							normal: {
								color: '#D2E9FF', //柱形图圆角，初始化效果
								//barBorderRadius: [4, 4, 0, 0],
							},

							//柱形图圆角，鼠标移上去效果
							// emphasis: {
							// 	barBorderRadius: [4, 4, 0, 0],
							// },
						},
						label: {
							normal: {
								show: true,
								position: 'inside',
								color: '#333333',
								fontSize: 10,
							},
						},
					},
					
					{
						name: 'CDN无源流量',
						type: 'bar',
						stack: '使用情况',
						data: data3,
						barMaxWidth: 30, //柱图宽度
						itemStyle: {
							normal: {
                                color: '#84C1FF',
                               
                            },
                           
						},
						label: {
							normal: {
								show: true,
								position: 'inside',
								color: '#ffffff',
								fontSize: 10,
							},
						},
                    },
                    {
						name: 'CDN有源流量',
						type: 'bar',
						stack: '使用情况',
						data: data1,
						barMaxWidth: 30, //柱图宽度
						itemStyle: {
							normal: {
                                color: '#2894FF',
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
					text: '',
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
					textStyle: {
						align: 'left',
					},
					formatter: function(params) {
						let str = '';
						params.forEach((item, index) => {
							if (index == 0) {
								str +=
									item.axisValue +
									'</br>' +
									item.marker +
									item.seriesName +
									'：' +
									item.value +
									_this.unitdata +
									'</br>';
							} else {
								str +=
									item.marker +
									item.seriesName +
									'：' +
									item.value +
									_this.unitdata +
									'</br>';
							}
						});
						return str;
					},
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
					name: _this.unitdata,
				},
				series: [
					{
						name: 'IOS-P2P',
						type: 'line',
						data: data1.map((item) => {
							return formatBkb(item, _this.unitdata);
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
						data: data2.map((item) => {
							return formatBkb(item, _this.unitdata);
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
						data: data3.map((item) => {
							return formatBkb(item, _this.unitdata);
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
						data: data4.map((item) => {
							return formatBkb(item, _this.unitdata);
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
