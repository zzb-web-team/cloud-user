<template>
	<div class="content">
		<div class="top_title">刷新预热</div>
		<!-- 主体内容 -->
		<div class="yure_content">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="刷新缓存" name="first">
					<!-- <div style="text-align: left;margin: 10px 0;">
            <span>刷新类型：</span>
            <el-radio v-model="radio1" label="1">Filed刷新</el-radio>
            <el-radio v-model="radio1" label="2">域名刷新</el-radio>
          </div> -->
					<span style="color: #666666;font-size:14px;"
						>刷新区域：</span
					>
					<el-cascader
						:options="citylist1"
						ref="cascaderAddr"
						:show-all-levels="false"
						v-model="citylabel"
						@change="handleChange"
					></el-cascader>
					<p
						style="text-align: left;color: #999999;margin: 23px 0;font-size:14px;"
					>
						Filed刷新单次提交最多 10
						条，使用回车换行输入，刷新任务完成时间预计为 10 分钟
					</p>
					<el-input
						type="textarea"
						:rows="2"
						placeholder="请输入点播加速内容,例：test123"
						:autosize="{ minRows: 10, maxRows: 20 }"
						v-model="textarea1"
					></el-input>
					<div style="margin: 20px 0;">
						<el-button
							@click="getrefresh(0)"
							style="width:96px;-height:40px;background:rgba(41,122,255,1);border-radius:2px;color:#ffffff;"
							>提交</el-button
						>
					</div>
				</el-tab-pane>
				<el-tab-pane label="内容预热" name="second">
					<!-- <div style="text-align: left;margin: 10px 0;">
            <span>刷新类型：</span>
            <el-radio v-model="radio2" label="1">Filed刷新</el-radio>
            <el-radio v-model="radio2" label="2">域名刷新</el-radio>
          </div> -->
					<span>预热区域：</span>
					<el-cascader
						:options="citylist1"
						v-model="citylabel1"
						:show-all-levels="false"
					></el-cascader>
					<p
						style="text-align: left;color: #999999;margin: 23px 0;font-size:14px;"
					>
						Filed预热单次提交最多 10
						条，使用回车换行输入，预热任务完成时间预计为 10 分钟
					</p>
					<el-input
						type="textarea"
						:rows="2"
						placeholder="请输入点播加速内容,例：test123"
						:autosize="{ minRows: 10, maxRows: 20 }"
						v-model="textarea2"
					></el-input>
					<div style="margin: 20px 0;">
						<el-button
							@click="getrefresh(1)"
							style="width:96px;-height:40px;background:rgba(41,122,255,1);border-radius:2px;color:#ffffff;"
							>提交</el-button
						>
					</div>
				</el-tab-pane>
				<el-tab-pane label="操作记录" name="third">
					<!-- 搜索 -->
					<div class="seach">
						<div class="seach_top">
							<el-input
								placeholder="请输入点播加速内容"
								v-model="input"
								class="input-with-select"
								@keyup.enter.native="seachuser"
							>
								<i
									slot="suffix"
									class="el-input__icon el-icon-search"
									@click="seachuser()"
									style="font-size: 23px;line-height: 60px;font-weight: 600;"
								></i>
							</el-input>
							<div
								class="seach_top_right"
								@click="option_display()"
								:class="[rotate ? 'sethui' : 'setwhiles']"
							>
								筛选
								<i
									class="el-icon-caret-bottom"
									:class="[
										rotate
											? 'fa fa-arrow-down go'
											: 'fa fa-arrow-down aa',
									]"
								></i>
							</div>
						</div>
						<div v-if="optiondisplay" class="seach_bottom">
							<span style="width: 88px;">操作类型：</span>
							<el-select
								v-model="valuea"
								placeholder="请选择"
								style="width: 160px;"
								@change="seachdata()"
							>
								<el-option label="全部" value=""></el-option>
								<el-option
									v-for="(item, index) in options1"
									:key="index"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
							<span style="width: 50px;">状态：</span>
							<el-select
								v-model="valueb"
								placeholder="请选择"
								style="width: 160px;"
								@change="seachdata()"
							>
								<el-option label="全部" value="-1"></el-option>
								<el-option
									v-for="(item, index) in options2"
									:key="index"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
							<span style="width: 50px;">日期：</span>
							<el-date-picker
								v-model="value1"
								type="datetimerange"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								style="width:20%;"
								:picker-options="pickerOptions0"
							></el-date-picker>
							<el-button
								@click="seachuser()"
								style="margin:0 10px 0 9px;width:91px;height:36px;background:rgba(41,122,255,1);border-radius:4px;color:#ffffff;border:none"
								>确定</el-button
							>
							<el-button
								style="width:90px;height:36px;background:rgba(219,233,255,1);border-radius:4px;color:#297aff;border:none"
								@click="reset()"
								>重置</el-button
							>
						</div>
					</div>
					<!-- 操作记录 -->
					<el-table
						:data="tableData"
						stripe
						style="width: 100%"
						:cell-style="rowClass"
						:header-cell-style="headClass"
                        @sort-change="tableSortChange"
					>
						<el-table-column
							prop="url_name"
							label="操作内容"
						></el-table-column>

						<el-table-column
							prop="are"
							label="区域"
						></el-table-column>
						<el-table-column prop="operation_date" sortable="custom" label="操作时间">
							<template slot-scope="scope"
								>{{ scope.row.opt_time | settimes }}
							</template>
						</el-table-column>
						<el-table-column prop="operation_type" label="操作类型">
							<template slot-scope="scope">
								<span v-if="scope.row.refresh_type == 1"
									>内容预热</span
								>
								<span v-else>缓存刷新</span>
							</template>
						</el-table-column>
						<el-table-column prop="operation_status" label="状态">
							<template slot-scope="scope">
								<span v-if="scope.row.state == 0">进行中</span>
								<span v-else-if="scope.row.state == 1"
									>完成</span
								>
								<span v-else-if="scope.row.state == 2"
									>等待</span
								>
								<span v-else-if="scope.row.state == 3"
									>失败</span
								>
							</template>
						</el-table-column>
						<el-table-column prop="schedule" label="进度">
							<template slot-scope="scope">
								<div
									v-if="scope.row.state == 0"
									style="color:#297AFF"
								>
									— —
								</div>
								<el-progress
									v-else
									:percentage="scope.row.progress"
								></el-progress>
							</template>
						</el-table-column>
					</el-table>
					<div>
						<fenye
							style="text-align:right;margin:37px 0 0 0;"
							@fatherMethod="getpage"
							@fathernum="gettol"
							:pagesa="total_cnt"
							:currentPage="currentPage"
						></fenye>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
		<!--  -->
	</div>
</template>

<script>
import fenye from '@/components/fenye';
import { dateToMs, getymdtime } from '../../servers/sevdate';
import {
	resource_refresh,
	refresh_state,
	getterminal,
} from '../../servers/api';
export default {
	data() {
		return {
			currentPage: 1,
			errarr: '',
            total_cnt: 1,
            pagesize:10,
			activeName: 'first',
			radio1: '1',
			textarea1: '',
			radio2: '1',
            textarea2: '',
            order: 0,
			optiondisplay: false,
			input: '',
			valuea: '',
			valueb: -1,
			rotate: false,
			value1: '',
			citylabel: '',
			citylabel1: '',
			chanid: '',
			options1: [
				{
					value: 0,
					label: '域名刷新',
				},
				{
					value: 1,
					label: '内容预热',
				},
			],
			options2: [
				{
					value: 0,
					label: '进行中',
				},
				{
					value: 1,
					label: '完成',
				},
				{
					value: 2,
					label: '等待中',
                },
                {
					value: 3,
					label: '失败',
				},
			],
			tableData: [],
			citylist1: [
				{
					value: 0,
					label: '全部',
				},
				{
					value: 1,
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
					value: 2,
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
							value: 'qinghai',
							label: '青海',
						},
						{
							value: '新疆',
							label: '新疆',
						},
					],
				},
				{
					value: 3,
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
					value: 4,
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
					value: 5,
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
					value: 6,
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
					value: 7,
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
					value: 8,
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
							value: 'taiwan',
							label: '台湾',
						},
					],
				},
			],
			pickerOptions0: {
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
			errarrs: '',
			errarrs2: '',
		};
	},
	components: {
		fenye,
	},
	filters: {
		settimes(data) {
			if (data) {
				var stat = getymdtime(data);
				return stat;
			} else {
				return data;
			}
		},
	},
	created() {},
	mounted() {
		if (this.$cookies.get('id')) {
			this.chanid = this.$cookies.get('id') * 1;
		} else {
			this.$router.push({ path: '/' });
		}
		// this.gettoken();
	},
	methods: {
		//获去token列表
		gettoken() {
			this.tableData = [];
			let parmas = new Object();
			parmas.chanid = this.chanid;
			parmas.pagesize = 10;
			parmas.page = 0;
			parmas.buser_id = this.chanid + '';
			getterminal(parmas)
				.then((res) => {
					if (res.status == 0) {
						if (res.result.cols.length <= 0) {
							this.$alert(
								'您还未添加终端，不能使用预热刷新功能！',
								'温馨提示',
								{
									confirmButtonText: '去添加',
									showClose: false,
									center: true,
									callback: (action) => {
										this.$router.push({
											path: '/terminal_management',
										});
									},
								}
							);
						}
					}
				})
				.catch((err) => {});
		},
		handleChange() {
			var thsAreaCode = this.$refs.cascaderAddr.getCheckedNodes()[0]
				.pathLabels;
		},
		removeEmpty(arr) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] == '' || typeof arr[i] == 'undefined') {
					arr.splice(i, 1);
					i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位
				}
			}
			return arr;
		},
		getBLen(str) {
			if (str == null) return 0;
			if (typeof str != 'string') {
				str += '';
			}
			return str.replace(/[^\x00-\xff]/g, '01').length;
		},
		//请求数据---预热刷新
		getrefresh(datas) {
			let parmas = new Object();
			parmas.buser_id = this.chanid + '';
			if (datas == 0) {
				parmas.type = 0;

				if (this.textarea1 == '') {
					this.$message.error('请输入要刷新的加速内容');
					return false;
				} else {
					if (
						this.removeEmpty(this.textarea1.split('\n')).length > 10
					) {
						this.$message.error('最多输入10条');
						return false;
					} else {
						let urlyure = this.removeEmpty(
							this.textarea1.split('\n')
						);

						let err_num = 0;
						// var resyzm = /^http(s)?:\/\/[^\u4e00-\u9fa5]{1,1020}$/;
						var resyzm = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,1024}$/;
						this.errarrs = '';
						urlyure.forEach((item, index) => {
							if (resyzm.test(item) === false) {
								this.errarrs = this.errarrs.concat(
									item + '</br>'
								);
								err_num++;
							} else if (this.getBLen(item) > 1024) {
								this.errarrs = this.errarrs.concat(
									item + '</br>'
								);
								err_num++;
							}
						});
						if (err_num != 0) {
							this.$alert(
								`${this.errarrs}加速内容格式错误`,
								'提交信息有误',
								{
									dangerouslyUseHTMLString: true,
								}
							);
							return false;
						} else {
							parmas.url_name = urlyure;
						}
					}
				}
				if (this.citylabel == '' || this.citylabel.length < 2) {
					this.$message.error('请选择刷新区域');
					return false;
				} else {
					parmas.area = this.citylabel[1];
				}
			} else {
				parmas.type = 1;
				if (this.textarea2 == '') {
					this.$message.error('请输入要刷新的加速内容');
					return false;
				} else {
					let urllist = this.removeEmpty(this.textarea2.split('\n'));
					if (urllist.length > 10) {
						this.$message.error('最多输入10条');
						return false;
					} else {
						let err_num = 0;
						// var resyzm = /^http(s)?:\/\/[^\u4e00-\u9fa5]{1,1020}$/;
						var resyzm = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,1024}$/;
						this.errarrs2 = '';
						urllist.forEach((item, index) => {
							if (resyzm.test(item) === false) {
								this.errarrs2 = this.errarrs2.concat(
									item + '</br>'
								);
								err_num++;
							} else if (this.getBLen(item) > 1024) {
								this.errarrs2 = this.errarrs2.concat(
									item + '</br>'
								);
								err_num++;
							}
						});
						if (err_num != 0) {
							this.$alert(
								`${this.errarrs2}加速内容格式错误`,
								'提交信息有误',
								{
									dangerouslyUseHTMLString: true,
								}
							);
							return false;
						} else {
							parmas.url_name = urllist;
						}
					}
				}
				if (this.citylabel1 == '' || this.citylabel1.length < 2) {
					this.$message.error('请选择预热区域');
					return false;
				} else {
					parmas.area = this.citylabel1[1];
				}
			}
			parmas.buser_id = this.chanid + '';
			resource_refresh(parmas)
				.then((res) => {
					if (res.status == 0) {
						if (res.data.failed_count == 0) {
							this.$message({
								type: 'success',
								message: '操作成功!',
							});
							if (res.err_code == 165156446464) {
								//判断是预热还是刷新
								if (parmas.type == 0) {
									this.$confirm(
										'未查询到某某域名某某区域核心节点有存储对应域名视频内容，需先对域名进行该区域的内容预热',
										'提示',
										{
											confirmButtonText: '确定',
											cancelButtonText: '取消',
											type: 'warning',
										}
									)
										.then(() => {
											this.activeName = 'second';
										})
										.catch(() => {
											// this.$message({
											//   type: "info",
											//   message: "已取消删除"
											// });
										});
								} else {
									this.$confirm(
										'域名区域局部节点已存储域名视频内容，确认预热更多的域名视频内容？',
										'提示',
										{
											confirmButtonText: '确定',
											cancelButtonText: '取消',
											type: 'warning',
										}
									)
										.then(() => {
											this.$message({
												type: 'success',
												message:
													'某域名某某区域已存在缓存无需刷新!',
											});
										})
										.catch(() => {
											// this.$message({
											//   type: "info",
											//   message: "已取消删除"
											// });
										});
								}
							}
						} else {
							this.errarr = '';
							res.data.res_data.forEach((item, index) => {
								this.errarr = this.errarr.concat(
									item[0] + '</br>'
								);
							});
							this.$alert(
								`${this.errarr}操作失败`,
								res.data.failed_count + '条操作失败',
								{
									dangerouslyUseHTMLString: true,
								}
							);
						}
					} else {
						this.error.$message('操作失败' + res.msg);
					}
				})
				.catch((err) => {});
		},
		seachdata() {
			this.getrefreshstate();
		},
		//获取数据--预热状态列表
		getrefreshstate() {
			this.tableData = [];
			let parmas = new Object();
			parmas.url_name = this.input;
			parmas.buser_id = this.chanid + '';
			parmas.refresh_type = this.valuea;
            parmas.state = parseInt(this.valueb);
            parmas.page=this.currentPage-1;
            parmas.order=this.order;
			if (this.value1 == '') {
				parmas.start_time = 0;
				parmas.end_time = 0;
			} else {
				parmas.start_time = dateToMs(this.value1[0]);
				parmas.end_time = dateToMs(this.value1[1]);
			}
			refresh_state(parmas)
				.then((res) => {
					if (res.status == 0) {
                        this.total_cnt=res.data.total;
						if (res.data.result.length > 0) {
                            this.tableData = res.data.result;
                            
						} else {
							this.$message({
								message: '暂无数据',
								type: 'warning',
							});
						}
					} else {
						this.$message.error(res.err_msg);
					}
				})
				.catch((err) => {});
		},
        //排序
		tableSortChange(column) {
            this.currentPage = 1;
            console.log(column.order);
			if (column.order == 'descending') {
				this.order = 1;
			} else {
				this.order = 0;
			}
			this.getrefreshstate();
		},
		handleClick(tab, event) {
			this.textarea1 = '';
			this.textarea2 = '';
			if (tab.name == 'third') {
				this.getrefreshstate();
			}
		},
        //获取页码
		getpage(pages) {
            console.log(pages);
			this.currentPage = pages;
			this.getrefreshstate();
		},
		//获取每页数量
		gettol(pagetol) {
			this.pagesize = pagetol;
			// this.getrefreshstate();
		},
		//筛选按钮
		option_display() {
			this.optiondisplay = !this.optiondisplay;
			this.rotate = !this.rotate;
		},
		//确定
		seachuser() {
			// this.optiondisplay = false;
			this.getrefreshstate();
		},
		//重置
		reset() {
			this.input = '';
			this.valuea = '';
			this.valueb = -1;
			this.value1 = '';
			this.getrefreshstate();
		},
		// 表头样式设置
		headClass() {
			return 'text-align: center;background:#F3F6FB;color:#333333;font-size:16px;';
		},
		// 表格样式设置
		rowClass() {
			return 'text-align: center;';
		},
	},
};
</script>

<style lang="scss" scoped>
.content {
	.yure_content {
		width: 100%;
		// margin: 15px 0;
	}
	width: 100%;
	height: 100%;
	text-align: left;
	.seach {
		width: 100%;
		// display: flex;
		// align-items: center;
		.seach_top {
			width: 100%;
			height: 60px;
			line-height: 60px;
			.input-with-select {
				width: 300px;
				float: left;
				margin-right: 10px;
			}
		}
		.seach_bottom {
			text-align: left;
			height: 80px;
			background: #f2f6fa;
			border-radius: 10px;
			padding: 10px 15px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-bottom: 20px;
			span {
				color: #999999;
				font-size: 14px;
				margin-left: 10px;
			}
		}
	}
}
//旋转
.aa {
	transition: all 1s;
}
.go {
	transform: rotate(-180deg);
	transition: all 1s;
}
</style>
