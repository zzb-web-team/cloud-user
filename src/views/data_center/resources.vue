<template>
	<section class="myself-container content">
		<div class="top_title">资源监控</div>
		<div class="user-title" style="display: flex;flex-flow: column;">
			<div class="resources_con">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<div
						style="display: flex;flex-flow: row;margin-top: 20px;padding:20px 37px;background:rgba(255,255,255,1);box-shadow:0px 2px 3px 0px rgba(6,17,36,0.14);border-radius:2px;margin-left:45px;margin-right:45px;"
					>
						<el-input
							placeholder="加速内容名称"
							v-model="value1"
							class="input-with-select"
							maxlength="70"
							@keyup.enter.native="getdata"
							style="width:15%;margin-right:10px;"
						>
							<i
								slot="prefix"
								class="el-input__icon el-icon-search"
								@click="getdata()"
							></i>
						</el-input>
						<el-select
							v-model="acce"
							placeholder="终端"
							style="width: 10%;margin-right: 10px;"
							@change="getdata()"
						>
							<el-option label="全部" value="*"></el-option>
							<el-option
								v-for="(item, index) in accelist"
								:key="index + 'vadio'"
								:label="item.label"
								:value="item.label"
							></el-option>
						</el-select>
						<el-cascader
							style="width: 10%;margin-right: 10px;line-height: 36px;"
							placeholder="区域"
							:options="optionsa2"
							ref="cascaderAddr"
							:show-all-levels="false"
							v-model="value2"
							@change="getdata"
						></el-cascader>
						<el-select
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
						<el-button-group>
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
						</el-button-group>
						<el-date-picker
							v-show="shoudzyx"
							style="margin-left:10px;"
							v-model="val2"
							type="datetimerange"
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
                @click="seachtu(1)"
                >确定</el-button
            >-->
					</div>

					<el-tab-pane label="加速流量" name="first">
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
													{{ scope.row.dataFlow }}
												</div>
											</template>
										</el-table-column>
									</el-table>
									<!-- <fenye
										style="float:right;margin:10px 0 20px 0;"
										@fatherMethod="getpage"
										@fathernum="gettol"
										:pagesa="total_cnt"
										:currentPage="currentPage"
                  ></fenye>-->
								</el-col>
							</el-row>
						</div>
					</el-tab-pane>

					<el-tab-pane label="回源统计" name="second">
						<!-- <div
              style="display: flex;flex-flow: row;margin-top: 20px;padding:20px 37px;background:rgba(255,255,255,1);box-shadow:0px 2px 3px 0px rgba(6,17,36,0.14);border-radius:2px;margin-left:45px;margin-right:45px;"
            >
              <el-select
                v-model="valuea1"
                placeholder="视频名称"
                style="width: 10%;margin-right: 10px;"
                @change="getdata1()"
              >
                <el-option label="全部" value="*"></el-option>
                <el-option
                  v-for="(item, index) in options1"
                  :key="item.label + index"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
              <el-cascader
                style="width: 10%;margin-right: 10px;line-height: 36px;"
                placeholder="区域"
                :options="optionsa2"
                ref="cascaderAddr"
                :show-all-levels="false"
                v-model="valuea2"
                @change="getdata1"
              ></el-cascader>
              <el-select
                v-model="valuea3"
                placeholder="运营商"
                style="width: 10%;margin-right: 10px;"
                @change="getdata1()"
              >
                <el-option label="全部" value="*"></el-option>
                <el-option
                  v-for="item in optionsa3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
              <el-button-group>
                <el-button v-show="!showzdyz" @click="today(2)">今天</el-button>
                <el-button v-show="!showzdyz" @click="yesterday(2)">昨天</el-button>
                <el-button v-show="!showzdyz" @click="sevendat(2)">近7天</el-button>
                <el-button v-show="!showzdyz" @click="thirtyday(2)">近30天</el-button>
                <el-button @click="showzdyzs">
                  自定义
                  <i class="el-icon-date"></i>
                </el-button>
              </el-button-group>
              <el-date-picker
                v-show="showzdyz"
                style="margin-left:10px;"
                v-model="val2"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="left"
                @change="gettimes_host"
              ></el-date-picker>
           
            </div>-->
						<div class="device_form" style>
							<div
								id="myChart1"
								:style="{ height: '607px' }"
							></div>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</section>
</template>

<script>
import { dateToMs, getymdtime, getlocaltimes } from '../../servers/sevdate';
import fenye from '@/components/fenye';
import {
	accelerate_flow_query_conditions,
	accelerate_flow,
	accelerate_flow_table,
	backsource_flow_query_conditions,
	backsource_flow,
    getvideo,
    getterminal
} from '../../servers/api';
import echarts from 'echarts';
export default {
	data() {
		return {
			currentPage: 1,
			shoudzyx: false,
			showzdyz: false,
            acce: '',
            pagenum:0,
			accelist: [],
			options1: [],
			options2: [],
			options3: [],
			options4: [],
			optionsa1: [],
			optionsa2: [
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
			value2: '',
			value3: '',
			value4: '',
			valuea1: '',
			valuea2: '',
			valuea3: '',
			valuea4: '',
			tablecdn: [],
			activeName: 'first',
			pickerOptions: {
				shortcuts: [
					{
						text: '昨天',
						onClick(picker) {
							const end = new Date(
								new Date(
									new Date().toLocaleDateString()
								).getTime()
							);
							const start =
								new Date(
									new Date(
										new Date().toLocaleDateString()
									).getTime()
								) -
								3600 * 1000 * 24 * 1;
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: '今天',
						onClick(picker) {
							const end = new Date();
							const start = new Date(
								new Date(
									new Date().toLocaleDateString()
								).getTime()
							);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date(
								new Date(
									new Date().toLocaleDateString()
								).getTime()
							);
							start.setTime(
								start.getTime() - 3600 * 1000 * 24 * 6
							);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date(
								new Date(
									new Date().toLocaleDateString()
								).getTime()
							);
							start.setTime(
								start.getTime() - 3600 * 1000 * 24 * 29
							);
							picker.$emit('pick', [start, end]);
						},
					},
				],
				disabledDate(time) {
					return time.getTime() > Date.now();
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
			total_cnt: 1, //数据总量
			chanid: '',
			dataFlownum: 0,
			dataFlownum2: 0,
			vadio_page: 0,
		};
	},
	filters: {
		settimes(data) {
			var stat = getymdtime(data);
			return stat;
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
        this.getlabrl2();
		this.getseachlabel1();
		// this.configure()
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
			//6小时
			if (endtime - sratime <= 21600) {
				this.timeUnit = 1;
				//一天
			} else if (21600 < endtime - sratime <= 86400) {
				this.timeUnit = 60;
			} else if (86400 < endtime - sratime <= 259200) {
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
			this.pageNo = pages;
			this.getbot();
		},
		//获取每页数量
		gettol(pagetol) {
			this.pagesize = pagetol;
			// this.getuserlist();
		},
		getdata() {
			this.gettable1();
		},
		getdata1() {
			this.gettable2();
		},

		/** 请求数据 */
		//加速流量加载查询条件
		getseachlabel1() {
			let params = new Object();
			params.chanid = this.chanid + '';
			params.page = this.vadio_page;
			getvideo(params)
				.then((res) => {
					if (res.status == 0) {
						if (res.result.cols.length > 0) {
							res.result.cols.forEach((item, index) => {
								let obj = {};
								obj.value = index;
								obj.label = item.url_name;
								this.options1.push(obj);
							});
						} else {
							this.$message('暂无数据');
						}
						if (res.result.les_count == 0) {
							this.vadio_page = 0;
							this.gettable1();
						} else {
							this.vadio_page++;
							this.getseachlabel1();
						}
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
			if (this.value2[1]) {
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
						this.dataFlowArray = res.data.streamArray;
						this.dataFlownum = res.data.streamArray.length - 1;
						let upcli = Math.floor(this.dataFlownum / 12);
						res.data.timeArray.forEach((item, index) => {
							if (
								index == 0 ||
								index == this.dataFlownum ||
								(index % upcli == 0 && index < upcli * 11)
							) {
								this.timeArray.push(getlocaltimes(item));
							} else {
								this.timeArray.push('');
							}
						});
					} else if (res.status == -1) {
						this.$message('暂无数据');
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
			if (this.value2[1]) {
				params.region = this.value2[1];
			} else {
				params.region = '*';
			}
			if (this.value3) {
				params.isp = this.value3;
			} else {
				params.isp = '*';
			}
			params.pageNo = this.pageNo - 1;
			params.pageSize = this.pageSize;
			params.acce = this.acce;
			accelerate_flow_table(params)
				.then((res) => {
					if (res.status == 0) {
						if (res.data.timeArray.length > 0) {
							res.data.timeArray.forEach((item, index) => {
								let obj = {};
								obj.timeStamp = item;
								obj.dataFlow = res.data.streamArray[index];
								this.tablecdn.push(obj);
							});
						}
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
			if (this.value2[1]) {
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
			backsource_flow(params)
				.then((res) => {
					if (res.status == 0) {
						this.dataFlowArray2 = res.data.streamArray;
						this.dataFlownum2 = res.data.streamArray.length - 1;
						let upcli = Math.floor(this.dataFlownum2 / 12);
						res.data.timeArray.forEach((item, index) => {
							if (
								index == 0 ||
								index == this.dataFlownum2 ||
								(index % upcli == 0 && index < upcli * 11)
							) {
								this.timeArray2.push(getlocaltimes(item));
							} else {
								this.timeArray2.push('');
							}
						});
					} else if (res.status == -1) {
						this.$message('暂无数据');
						this.dataFlowArray2 = this.dataFlowArray;
						this.timeArray2 = this.timeArray;
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
					}
				})
				.catch((error) => {});
		},
		seachtu(data) {
			if (data == 1) {
				this.gettable1();
			} else {
				this.gettable2();
			}
		},
		//今天
		today(data) {
			let times =
				new Date(new Date().toLocaleDateString()).getTime() / 1000;
			this.starttime = times;
			this.endtime = Date.parse(new Date()) / 1000;
			this.settimeunit(this.starttime, this.endtime);
			if (!data) {
				this.gettable1();
			} else {
				this.gettable2();
			}
		},
		//昨天
		yesterday(data) {
			let times =
				new Date(new Date().toLocaleDateString()).getTime() / 1000;
			this.starttime = times - 24 * 60 * 60 * 1;
			this.endtime = times;
			this.settimeunit(this.starttime, this.endtime);
			if (!data) {
				this.gettable1();
			} else {
				this.gettable2();
			}
		},
		//七天
		sevendat(data) {
			let times =
				new Date(new Date().toLocaleDateString()).getTime() / 1000;
			this.starttime = times - 24 * 60 * 60 * 7;
			this.endtime = times;
			this.settimeunit(this.starttime, this.endtime);
			if (!data) {
				this.gettable1();
			} else {
				this.gettable2();
			}
		},
		//三十天
		thirtyday(data) {
			let times =
				new Date(new Date().toLocaleDateString()).getTime() / 1000;
			this.starttime = times - 24 * 60 * 60 * 30;
			this.endtime = times;
			this.settimeunit(this.starttime, this.endtime);
			if (!data) {
				this.gettable1();
			} else {
				this.gettable2();
			}
		},
		//自定义时间
		gettimes(cal) {
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
			this.gettable1();
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
			// this.starttime =
			//   new Date(new Date().toLocaleDateString()).getTime() / 1000;
			// this.endtime = Date.parse(new Date()) / 1000;
			// this.settimeunit(this.starttime, this.endtime);
			if (tab.index == 0) {
				this.gettable1();
			} else {
				this.gettable2();
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
						mark: { show: true },
						dataView: { show: true, readOnly: false },
						magicType: { show: true, type: ['line', 'bar'] },
						restore: { show: true },
							saveAsImage: { show: false },
						mydow: {
							show: true,
							title: '导出',
							icon:'path://M552 586.178l60.268-78.53c13.45-17.526 38.56-20.83 56.085-7.38s20.829 38.56 7.38 56.085l-132 172c-16.012 20.863-47.454 20.863-63.465 0l-132-172c-13.45-17.526-10.146-42.636 7.38-56.085 17.525-13.45 42.635-10.146 56.084 7.38L472 586.177V152c0-22.091 17.909-40 40-40s40 17.909 40 40v434.178zM832 512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 61.856-50.144 112-112 112H224c-61.856 0-112-50.144-112-112V512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 17.673 14.327 32 32 32h576c17.673 0 32-14.327 32-32V512z',
							onclick: function() {
								alert('myToolHandler1');
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
						type: 'cross',
						label: {
							backgroundColor: '#6a7985',
						},
					},
				},
				xAxis: {
					data: this.timeArray,
					axisTick: {
						show: false,
					},
					axisLabel: {
						interval: 0, //代表显示所有x轴标签
						// rotate: -30, //代表逆时针旋转45度
						textStyle: {
							color: '#999',
						},
					},
				},
				yAxis: {},
				series: [
					{
						name: '流量',
						type: 'bar',
						barWidth: 30, //柱图宽度
						data: this.dataFlowArray,
						itemStyle: {
							normal: {
								//每根柱子颜色设置
								color: function(params) {
									let colorList = ['#297AFF', '#297AFF00'];
									let upcli = Math.floor(
										_this.dataFlownum / 12
									);
									let data_index = params.dataIndex;
									if (
										(data_index % upcli == 0 &&
											data_index < upcli * 11) ||
										data_index == 0 ||
										data_index == _this.dataFlownum
									) {
										return colorList[0];
									} else {
										return colorList[1];
									}
								},
							},
						},
					},
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
						mark: { show: true },
						dataView: { show: true, readOnly: false },
						magicType: { show: true, type: ['line', 'bar'] },
						restore: { show: true },
						saveAsImage: { show: false },
						mydow: {
							show: true,
							title: '导出',
							icon:'path://M552 586.178l60.268-78.53c13.45-17.526 38.56-20.83 56.085-7.38s20.829 38.56 7.38 56.085l-132 172c-16.012 20.863-47.454 20.863-63.465 0l-132-172c-13.45-17.526-10.146-42.636 7.38-56.085 17.525-13.45 42.635-10.146 56.084 7.38L472 586.177V152c0-22.091 17.909-40 40-40s40 17.909 40 40v434.178zM832 512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 61.856-50.144 112-112 112H224c-61.856 0-112-50.144-112-112V512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 17.673 14.327 32 32 32h576c17.673 0 32-14.327 32-32V512z',
							onclick: function() {
								alert('myToolHandler1');
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
						type: 'cross',
						label: {
							backgroundColor: '#6a7985',
						},
					},
				},
				xAxis: {
					data: this.timeArray2,
					axisLabel: {
						interval: 0, //代表显示所有x轴标签
					},
					axisTick: {
						show: false,
					},
				},
				yAxis: {},
				series: [
					{
						name: '销量',
						type: 'bar',
						barWidth: 30, //柱图宽度
						data: this.dataFlowArray2,
						itemStyle: {
							normal: {
								//每根柱子颜色设置
								color: function(params) {
									let colorList = ['#297AFF', '#297AFF00'];
									let upcli = Math.floor(
										_this.dataFlownum2 / 12
									);
									let data_index = params.dataIndex;
									if (
										(data_index % upcli == 0 &&
											data_index < upcli * 11) ||
										data_index == 0 ||
										data_index == _this.dataFlownum2
									) {
										return colorList[0];
									} else {
										return colorList[1];
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
