<template>
	<div class="content domin_index">
		<!-- 面包屑 -->

		<div
			class="user-title"
			style="margin: auto;display: flex;flex-flow: column;"
		>
			<!-- 搜索 -->

			<div class="resources_con">
				<div class="seach">
					<div class="top_title">点播加速管理</div>
					<div class="seach_top">
						<el-input
							placeholder="加速内容名称"
							v-model="input"
							class="input-with-select"
							maxlength="70"
							@keyup.enter.native="onSubmit"
						>
							<i
								slot="prefix"
								class="el-input__icon el-icon-search"
								@click="seachuser()"
							></i>
						</el-input>
						<div
							class="seach_top_right"
							@click="option_display()"
							:class="[rotate ? 'sethui' : 'setwhile']"
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
						<span>状态：</span>
						<el-select
							v-model="value"
							placeholder="请选择"
							@change="getdata()"
						>
							<el-option
								v-for="(item, index) in options"
								:key="index + 'reat'"
								:label="item.label"
								:value="item.value"
							></el-option>
						</el-select>
						<span style="margin-left: 10px;">日期：</span>
						<el-date-picker
							v-model="value1"
							type="datetimerange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							@change="gettimes"
							:picker-options="pickerOptions"
						></el-date-picker>
						<el-button
							type="primary"
							size="mini"
							@click="seachuser()"
							style="margin-left: 10px;"
							>确定</el-button
						>
						<el-button
							plain
							size="mini"
							@click="reset()"
							style="margin-left: 10px;"
							>重置</el-button
						>
					</div>
				</div>

				<!-- <el-tab-pane label="加速内容管理" name="first"> -->
				<!-- 第二排按钮 -->
				<div
					class="con_lable"
					:style="{
						minHeight: clientHeight - 297 + 'px',
					}"
				>
					<div
						style="padding:20px 0 18px;display: flex;justify-content: space-between;"
					>
						<div>
							<el-button
								type="primary"
								@click="new_btn"
								class="my_btn"
							>
								<span class="el-icon-plus"></span>
								创建加速内容
							</el-button>
							<el-button
								type="primary"
								plain
								@click="upload_btn"
								class="my_btn"
								>批量导入加速内容</el-button
							>
							<!-- <el-button type="primary" plain @click="setdomainlist">批量管理标签</el-button> -->
						</div>
						<div>
							<el-button
								type="primary"
								class="my_btn"
								@click="exp_table"
								>导出</el-button
							>
						</div>
					</div>
					<!-- 主体数据表格 -->
					<el-table
						ref="multipleTable"
						:data="tableData"
						stripe
						border
						row-key="url_name"
						tooltip-effect="dark"
						style="width: 100%"
						:cell-style="rowClass"
						:header-cell-style="headClass"
						:default-sort="{
							prop: 'date',
							order: 'descending',
						}"
						@selection-change="handleSelectionChange"
						@sort-change="tableSortChange"
					>
						>
						<el-table-column
							type="selection"
							width="55"
						></el-table-column>
						<el-table-column
							prop="url_name"
							label="加速内容名称"
						></el-table-column>
						<el-table-column
							prop="domain"
							label="源站域名"
							class-name="firsturl"
							:show-overflow-tooltip="true"
						></el-table-column>

						<el-table-column
							prop="host_url"
							label="回源路径"
						></el-table-column>
						<el-table-column
							prop="url"
							label="播放路径"
						></el-table-column>
						<el-table-column prop="state" label="状态" width="120">
							<template slot-scope="scope">
								<span
									style="color:#0ABF5B;"
									v-if="scope.row.state == 1"
									>正常运行</span
								>
								<span
									style="color:#E54545;"
									v-else-if="scope.row.state == 0"
									>已停止</span
								>
								<span style="color:#E54545;" v-else
									>回源失败</span
								>
							</template>
						</el-table-column>

						<!-- <el-table-column label="标签" width="50">
            <template slot-scope="scope">
              <i class="iconfont icon-biaoqian" @click="handleClick(scope.row)"></i>
            </template>
          </el-table-column>-->
						<el-table-column
							prop="create_time"
							sortable="custom"
							label="创建时间"
						>
							<template slot-scope="scope">
								<span>{{
									scope.row.create_time | settimes
								}}</span>
							</template>
							>
						</el-table-column>

						<el-table-column label="操作" width="550">
							<template slot-scope="scope">
								<el-button
									@click="handleClick(scope.row)"
									type="text"
									size="small"
									>配置</el-button
								>
								<el-button
									type="text"
									size="small"
									@click="updatauser(scope.row)"
									>复制配置</el-button
								>
								<el-button
									type="text"
									size="small"
									@click="pwdwetout(scope.row)"
									>监控</el-button
								>
								<el-button
									type="text"
									size="small"
									@click="disableuser(scope.row)"
									v-if="scope.row.state == 1"
									>停用</el-button
								>
								<el-button
									type="text"
									size="small"
									@click="enableuser(scope.row)"
									v-else
									>启用</el-button
								>
								<el-button
									type="text"
									size="small"
									@click="deleateuser(scope.row)"
									v-if="scope.row.state !== 1"
									style="color:#666666;"
									>删除</el-button
								>
								<el-button
									type="text"
									size="small"
									disabled
									v-else
									style="color:#c5c5c5;"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</el-table>
					<!-- 配置弹窗 -->
					<el-dialog
						title="添加用户"
						:visible.sync="dialog"
						custom-class="customWidth"
					>
						<el-form :model="details">
							<el-form-item
								label="使用状态"
								:label-width="formLabelWidth"
							>
								<el-radio
									v-model="radioes"
									label="1"
									:disabled="true"
									>启用</el-radio
								>
								<el-radio
									v-model="radioes"
									label="2"
									:disabled="true"
									>停用</el-radio
								>
							</el-form-item>
							<el-form-item
								label="账号"
								:label-width="formLabelWidth"
							>
								<el-input
									v-model="details.nickname"
									:disabled="true"
									placeholder="请输入账号"
									autocomplete="off"
								></el-input>
							</el-form-item>
							<el-form-item
								label="真实姓名"
								:label-width="formLabelWidth"
							>
								<el-input
									v-model="details.username"
									:disabled="true"
									placeholder="请输入真实姓名"
									autocomplete="off"
								></el-input>
							</el-form-item>
							<el-form-item
								label="联系方式"
								:label-width="formLabelWidth"
							>
								<el-input
									v-model="details.phone"
									maxlength="11"
									:disabled="true"
									placeholder="请输入有效手机号"
									autocomplete="off"
								></el-input>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button type="primary" @click="dialog = false"
								>确 定</el-button
							>
						</div>
					</el-dialog>
					<!-- 底部按钮 -->
					<div
						v-show="tableData.length > 0"
						style="margin-top: 20px;display: flex;justify-content: space-between;align-items: center;"
					>
						<div>
							<el-button
								type="text"
								size="small"
								@click="enableuser()"
								>启用</el-button
							>
							<el-button
								type="text"
								style="color:#E54545;"
								size="small"
								@click="disableuser()"
								>停用</el-button
							>
							<el-button
								type="text"
								size="small"
								@click="deleateuser()"
								>删除</el-button
							>
							<!-- <el-button @click="enableuser()" type="success">启用</el-button>
            <el-button @click="disableuser()" type="warning">禁用</el-button>
            <el-button @click="deleateuser()" type="danger">删除</el-button>-->
						</div>
						<fenye
							style="float:right;margin:10px 0 20px 0;"
							@fatherMethod="getpage"
							@fathernum="gettol"
							:pagesa="total_cnt"
							:currentPage="currentPage"
						></fenye>
					</div>
				</div>
				<!-- </el-tab-pane> -->
				<!-- @expand-change="toggleRowExpansion"
								:tree-props="{
									children: 'children',
									hasChildren: 'hasChildren',
								}" -->
				<!-- <el-tab-pane label="点播回源" name="second"> -->
				<!-- <div class="con_lable host_table">
					<el-table
						:data="demotableData"
						:span-method="arraySpanMethod"
						style="width: 100%;margin-bottom: 20px;"
						row-key="id"
						border
						:cell-style="rowClass"
						:header-cell-style="headClass"
					>
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-table
									:data="scope.row.childrens"
									border
									style="width: 100%"
									:cell-style="rowClass"
									:header-cell-style="headClass"
								>
									<el-table-column
										prop="acce"
										label="操作内容"
									></el-table-column>
									<el-table-column
										prop="start_time"
										label="回源开始时间"
									></el-table-column>
									<el-table-column
										prop="end_time"
										label="回源结束时间"
									></el-table-column>
									<el-table-column prop="state" label="状态">
										<template slot-scope="scope">
											<span v-if="scope.row.state == 0"
												>进行中</span
											>
											<span
												v-else-if="scope.row.state == 1"
												style="color:#E54545;"
												>已关闭</span
											>
											<span
												v-else-if="scope.row.state == 2"
												style="color:#E54545;"
												>回源失败</span
											>
											<span
												v-else-if="scope.row.state == 3"
												style="color:#0abf5b;"
												>完成</span
											>
										</template>
									</el-table-column>
									<el-table-column prop="jingdu" label="进度">
										<template slot-scope="scope">
											<el-progress
												:percentage="scope.row.jingdu"
											></el-progress> </template
									></el-table-column>
									<el-table-column label="操作">
										<template slot-scope="scope">
											<el-button
												type="text"
												size="small"
												:disabled="
													scope.row.state == 1 ||
														scope.row.state == 2
												"
											>
												关闭回源
											</el-button>
										</template>
									</el-table-column>
								</el-table>
							</template>
						</el-table-column>
						<el-table-column type="selection" width="55">
						</el-table-column>
						<el-table-column prop="acce" label="加速内容名称">
						</el-table-column>
						<el-table-column prop="hui_url" label="回源地址">
						</el-table-column>
						<el-table-column prop="ip" label="点播IP">
						</el-table-column>
						<el-table-column prop="start_time" label="回源开始时间">
						</el-table-column>
						<el-table-column prop="end_time" label="回源结束时间">
						</el-table-column>
						<el-table-column prop="state" label="状态" width="100">
							<template slot-scope="scope">
								<span v-if="scope.row.state == 0">进行中</span>
								<span
									v-else-if="scope.row.state == 1"
									style="color:#E54545;"
									>已关闭</span
								>
								<span
									v-else-if="scope.row.state == 2"
									style="color:#E54545;"
									>回源失败</span
								>
								<span
									v-else-if="scope.row.state == 3"
									style="color:#0abf5b;"
									>完成</span
								>
							</template>
						</el-table-column>
						<el-table-column prop="jingdu" label="回源进度">
							<template slot-scope="scope">
								<el-progress
									:percentage="scope.row.jingdu"
								></el-progress>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button
									type="text"
									size="small"
									:disabled="
										scope.row.state == 1 ||
											scope.row.state == 2
									"
									@click="closehost(scope.row)"
								>
									关闭回源
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div
						style="margin-top: 20px;display: flex;justify-content: space-between;align-items: center;"
					>
						<div>
							<el-button
								type="text"
								size="small"
								@click="closehost"
								>关闭回源</el-button
							>
						</div>
						<fenye
							style="float:right;margin:10px 0 20px 0;"
							@fatherMethod="getpage"
							@fathernum="gettol"
							:pagesa="host_total_cnt"
							:currentPage="host_currentPage"
						></fenye>
					</div>
				</div> -->
				<!-- </el-tab-pane> -->
				<!-- </el-tabs> -->
			</div>
		</div>
	</div>
</template>

<script>
import fenye from '@/components/fenye';
import { dateToMs, getymdtime } from '../../servers/sevdate';
import base from '../../components/base.vue';
import {
	query_url,
	change_state,
	delete_url,
	getterminal,
	url_export_for_admin,
} from '../../servers/api';
export default {
	mixins: [base],
	data() {
		//重置密码
		var validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else {
				if (this.ruleForm.checkPass !== '') {
					this.$refs.ruleForm.validateField('checkPass');
				}
				callback();
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.ruleForm.pass) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};
		return {
			currentPage: 1,
			multipleSelection: [],
			currentSelection: [],
			ruleForm: {
				pass: '',
				checkPass: '',
				account: '',
			},
			input: '', //搜索输入框
			value1: '',
			dialogFormVisible: false,
			zhongdisable: false,
			pimanagement: false,
			dialog: false,
			radio: '1',
			radioes: '1',
			isIndeterminate: '',
			sadioes: 1,
			pagesize: 10,
			total_cnt: 1,
			host_total_cnt: 1,
			host_currentPage: 0,
			dynamicValidateForm: {
				account: '',
				nickname: '',
				pwd: '',
				conpwd: '',
				actualname: '',
				tel: '',
				delivery: false,
				type: [],
				resource: '',
				desc: '',
				domains: [
					{
						value: '',
					},
				],
			},
			details: {},
			formLabelWidth: '60px',
			optiondisplay: false,
			rotate: false,
			gridData: [],
			tolpage: 1,
			chanid: '',
			options: [
				{
					value: -1,
					label: '全部',
				},
				{
					value: 0,
					label: '已停止',
				},
				{
					value: 1,
					label: '正常运行',
				},
				{
					value: 2,
					label: '回源失败',
				},
			],

			value: -1,
			pager: {
				count: 0,
				page: 1,
				rows: 100,
			},
			tableData: [
				// {
				//   domain: "http://www.baidu.com",
				//   url_name: "你好呀",
				//   label: "1",
				//   label2: "1",
				//   status: "1",
				//   time_create: "1583906243",
				//   camesd: "417860",
				//   buser_id: "518365830"
				// }
			],
			order: 0,
			minDate: '',
			maxDate: '',
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
			demotableData: [
				{
					id: 1,
					start_time: '2016-05-02',
					end_time: '2019-06-30',
					acce: '南方网佛偈♂',
					hui_url: 'http://www.gogogo.com',
					ip: '39.27.10.36',
					state: 3,
					jingdu: 99,
					hasChildren: false,
					childrens: [
						{
							id: 103,
							acce: 'eos fjid nfn nfdjs',
							start_time: '2016-05-02',
							end_time: '2019-06-30',
							state: 3,
							jingdu: 0,
						},
						{
							id: 104,
							acce: 'eos fjid nfn nfdjs',
							start_time: '2016-05-02',
							end_time: '2019-06-30',
							state: 3,
							jingdu: 89,
						},
						{
							id: 105,
							acce: 'eos fjid nfn nfdjs',
							start_time: '2016-05-02',
							end_time: '2019-06-30',
							state: 3,
							jingdu: 3,
						},
						{
							id: 106,
							acce: 'eos fjid nfn nfdjs',
							start_time: '2016-05-02',
							end_time: '2019-06-30',
							state: 3,
							jingdu: 0,
						},
					],
				},
				{
					id: 2,
					start_time: '2016-05-04',
					end_time: '2019-06-30',
					acce: '粉底霜粉第三方',
					hui_url: 'http://www.gogogo.com',
					ip: '39.27.10.36',
					state: 2,
					jingdu: 5,
				},
				{
					id: 3,
					start_time: '2016-05-01',
					end_time: '2019-06-30',
					acce: '管理破壳浮动',
					hui_url: 'http://www.gogogo.com',
					ip: '39.27.10.36',
					state: 0,
					jingdu: 27,
				},
				{
					id: 4,
					start_time: '2016-05-03',
					end_time: '2019-06-30',
					acce: '看法颇为灭口',
					hui_url: 'http://www.gogogo.com',
					ip: '39.27.10.36',
					state: 1,
					jingdu: 100,
				},
			],
			expands: [],
		};
	},
	filters: {
		settimes(data) {
			console.log(data);
			return String(data).length == 10
				? getymdtime(data)
				: getymdtime(data / 1000);
		},
	},
	components: {
		fenye,
	},
	created() {},
	mounted() {
		if (this.$cookies.get('id')) {
			this.chanid = this.$cookies.get('id') * 1;
		} else {
			this.$router.push({ path: '/' });
		}
		// this.$nextTick(function() {
		// 	this.$refs.tabs.$children[0].$refs.tabs[1].style.display = 'none';
		// });
		this.gettoken();
		this.getuserlist();
	},
	methods: {
		//展开
		toggleRowExpansion(row) {
			// console.log(row);
			this.expands = [];
			this.expands.push(row.id); //展开当前行的信息
		},
		//合并
		arraySpanMethod({ row, column, rowIndex, columnIndex }) {
			// console.log(row, column, rowIndex, columnIndex);
			if (row.id > 100) {
				if (columnIndex === 2) {
					return [1, 3];
				} else if (columnIndex === 3 || columnIndex === 4) {
					return [0, 0];
				}
			}
		},
		//关闭回源按钮
		closehost(row) {
			if (row) console.log(row);
		},
		//获去token列表
		gettoken() {
			this.tableData = [];
			let parmas = new Object();
			parmas.chanid = this.chanid;
			parmas.pagesize = 10;
			parmas.page = 0;
			getterminal(parmas)
				.then((res) => {
					if (res.status == 0) {
						if (res.result.cols.length <= 0) {
							this.$alert(
								'您还未添加终端，还不能操作域名！',
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
		//排序
		tableSortChange(column) {
			this.currentPage = 1;
			if (column.order == 'descending') {
				this.order = 1;
			} else {
				this.order = 0;
			}
			this.getuserlist();
		},
		//添加URL
		new_btn() {
			this.$router.push({ path: '/add_url' });
		},
		//导出表格
		exp_table() {
			let params = new Object();
			params.page = this.currentPage - 1;
			params.buser_id = this.chanid + '';
			params.url_name = this.input;
			params.state = this.value;
			params.order = this.order;
			if (!this.value1) {
				params.start_time = 0;
				params.end_time = 0;
			} else {
				params.start_time = dateToMs(this.value1[0]);
				params.end_time = dateToMs(this.value1[1]);
			}
			url_export_for_admin(params)
				.then((res) => {
					if (res.status == 0) {
						window.open(res.data.down_load, '_blank');
						this.$message({
							message: '导出成功',
							type: 'success',
						});
					} else {
						this.$message({
							message: '导出失败',
							type: 'warning',
						});
					}
				})
				.catch((error) => {});
		},
		//新建用户-删除URL
		removeDomain(item) {
			var index = this.dynamicValidateForm.domains.indexOf(item);
			if (index !== -1) {
				this.dynamicValidateForm.domains.splice(index, 1);
			}
		},
		//新建用户-添加URL
		addDomain() {
			this.dynamicValidateForm.domains.push({
				value: '',
				key: Date.now(),
			});
		},
		//上传
		upload_btn() {
			// this.$router.push({ path: "/upload" });
			this.$router.push({ path: '/simple' });
		},
		//批量管理
		setdomainlist() {
			sessionStorage.setItem('tabdata', JSON.stringify(this.tableData));
			this.$router.push({ path: '/lot_operating' });
		},
		// 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
		getRowKey(row) {
			return row.url;
		},
		getdata() {
			this.currentPage = 1;
			this.getuserlist();
		},
		//获取数据列表
		getuserlist() {
			// 已选择项
			//this.updateSelection();

			let params = new Object();
			params.page = this.currentPage - 1;
			params.buser_id = this.chanid + '';
			params.url_name = this.input;
			params.state = this.value;
			params.order = this.order;
			if (!this.value1) {
				params.start_time = 0;
				params.end_time = 0;
			} else {
				params.start_time = dateToMs(this.value1[0]);
				params.end_time = dateToMs(this.value1[1]);
			}
			query_url(params)
				.then((res) => {
					if (res.status == 0) {
						// this.pager.count = res.data.total;
						this.total_cnt = res.data.total;
						this.tableData = [];
						res.data.result.forEach((item, index) => {
							let obj = {};
							obj.buser_id = item.buser_id;
							obj.create_time = item.create_time;
							obj.domain = item.domain;
							obj.domain_id = item.domain_id;
							obj.state = item.state;
							obj.url = item.url;
							obj.host_url = item.host_url;
							obj.url_name = item.url_name;
							obj.url_type = item.url_type;
							this.tableData.push(obj);
						});
						if (res.total != 0) {
							res.data.result.forEach((item, index) => {
								let obj = {};
								obj.url = item.url;
							});
						}

						// 整理列表选中项
						this.formatChoosen(this.tableData);
					} else {
					}
				})
				.catch((err) => {});
		},

		// 刷新已选择数组
		updateSelection() {
			if (this.currentSelection.length) {
				this.multipleSelection = this.multipleSelection.concat(
					this.currentSelection
				);
				this.currentSelection = [];
			}
		},
		// 整理列表选中项
		formatChoosen(arr) {
			const urlArr = this.tableData.map((item) => item.url_name);
			urlArr.forEach((item, index) => {
				if (this.multipleSelection.includes(item)) {
					// 如果存在item，就在selection中删掉，再添加到currentSelection内
					const idx = this.multipleSelection.indexOf(item);
					this.multipleSelection.splice(idx, 1);
					setTimeout(() => {
						this.$refs.multipleTable.toggleRowSelection(
							this.tableData[index]
						);
					}, 200);
				}
			});
		},
		//多选
		handleSelectionChange(val) {
			if (val.length) {
				this.currentSelection = val.map((item) => item);
			}
		},
		//获取页码
		getpage(pages) {
			this.currentPage = pages;
			this.getuserlist();
		},
		//获取每页数量
		gettol(pagetol) {
			this.pagesize = pagetol;
			// this.getuserlist();
		},
		//回车事件
		onSubmit() {
			this.currentPage = 1;
			this.getuserlist();
		},
		//筛选按钮
		option_display() {
			this.optiondisplay = !this.optiondisplay;
			this.rotate = !this.rotate;
		},
		//确定搜索
		seachuser() {
			this.currentPage = 1;
			this.getuserlist();
			// this.optiondisplay = false;
			// this.rotate = !this.rotate;
			// this.value = "";
			// this.input = "";
			// this.value1 = "";
		},
		//自定义事时间
		gettimes() {
			this.currentPage = 1;
			this.getuserlist();
		},
		//搜索重置
		reset() {
			this.currentPage = 1;
			this.value = -1;
			this.value1 = '';
			this.input = '';
			this.getuserlist();
		},

		//配置
		handleClick(row) {
			this.$router.push({
				path: '/batch_management',
				query: { urlress: row.url_name },
			});
		},
		//复制配置
		updatauser(row) {
			this.$router.push({
				path: '/copy_configuration',
				query: { urlress: row.url_name },
			});
		},
		//监控
		pwdwetout(row) {
			this.$router.push({ path: '/resources', query: { urldata: row } });
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$message({
						message: '密码重置成功',
						type: 'success',
					});
					this.dialpwdset = false;
				} else {
					return false;
				}
			});
		},
		// 禁用
		disableuser(datalist) {
			if (!datalist) {
				if (this.currentSelection.length <= 0) {
					this.$message('至少选择一个源站域名进行操作！');
					return false;
				}
			}
			this.$confirm(
				'禁用后该加速内容将关闭加速服务，是否继续？',
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(() => {
					// let params = new Object();
					// if (datalist) {
					// 	params.data_array = [];
					// 	params.data_array.push(datalist.url_name);
					// 	params.data_count = 0;
					// } else {
					// 	let urllist = [];
					// 	const arr = this.multipleSelection.concat(
					// 		this.currentSelection
					// 	);
					// 	params.data_array = arr;
					// 	params.data_count = arr.length;
					// }
					// params.state = 0;
					// params.buser_id = this.chanid + '';

					let params = new Object();
					let arr = new Array();
					let urllist = [];
					if (datalist) {
						let newobj = new Object();
						newobj.buser_id = this.chanid + '';
						newobj.data_count = 0;
						newobj.state = 0;
						newobj.data_array = [];
						newobj.data_array.push(datalist.url_name);

						urllist.push(newobj);
						params.data_count = 0;
						params.data = urllist;
					} else {
						const arr = this.multipleSelection.concat(
							this.currentSelection
						);
						console.log(arr);
						let newobj = new Object();
						newobj.buser_id = this.chanid + '';
						newobj.data_count = 0;
						newobj.state = 0;
						newobj.data_array = [];
						arr.forEach((item, index) => {
							newobj.data_array.push(item.url_name);
						});
						urllist.push(newobj);
						params.data = urllist;
						params.data_count = urllist.length;
					}
					change_state(params)
						.then((res) => {
							if (res.status == 0) {
								this.getuserlist();
								this.$message({
									type: 'success',
									message: '操作成功!',
								});
							} else {
								this.$message.error(res.msg);
							}
						})
						.catch((error) => {});
				})
				.catch((eerr) => {
					this.$message({
						type: 'info',
						message: '已取消',
					});
				});
		},
		//启用
		enableuser(datalist) {
			if (!datalist) {
				if (this.currentSelection.length <= 0) {
					this.$message('至少选择一个源站域名进行操作！');
					return false;
				}
			}
			console.log(datalist);
			let params = new Object();
			let arr = new Array();
			let urllist = [];
			if (datalist) {
				let newobj = new Object();
				newobj.buser_id = this.chanid + '';
				newobj.data_count = 0;
				newobj.state = 1;
				newobj.data_array = [];
				newobj.data_array.push(datalist.url_name);
				urllist.push(newobj);
				params.data_count = 0;
				params.data = urllist;
				// if (datalist.url_type == 1) {
				//   this.$confirm(
				//     "该加速内容的源站域名已被停用，启用源站域名后才能启用加速内容？",
				//     "提示",
				//     {
				//       confirmButtonText: "去启用",
				//       cancelButtonText: "取消",
				//       type: "warning"
				//     }
				//   )
				//     .then(() => {
				//       this.$router.push({ path: "/accelerate_management" });
				//     })
				//     .catch(() => {
				//       this.$message({
				//         type: "info",
				//         message: "已取消启用"
				//       });
				//     });
				// }
			} else {
				const arr = this.multipleSelection.concat(
					this.currentSelection
				);
				console.log(arr);
				let newobj = new Object();
				newobj.buser_id = this.chanid + '';
				newobj.data_count = 0;
				newobj.state = 1;
				newobj.data_array = [];
				for (let i = 0; i < arr.length; i++) {
					//   if (arr[i].url_type == 1) {
					//     this.$confirm(
					//       "启用加速内容中有源站域名已被停用，启用源站域名后才能启用加速内容？",
					//       "提示",
					//       {
					//         confirmButtonText: "去启用",
					//         cancelButtonText: "取消",
					//         type: "warning"
					//       }
					//     )
					//       .then(() => {
					//         this.$router.push({ path: "/accelerate_management" });
					//       })
					//       .catch(() => {
					//         this.$message({
					//           type: "info",
					//           message: "已取消启用"
					//         });
					//       });
					//     return false;
					//   }
					newobj.data_array.push(arr[i].url_name);
				}
				arr.forEach((item, index) => {});
				urllist.push(newobj);
				params.data = urllist;
				params.data_count = urllist.length;
			}

			change_state(params)
				.then((res) => {
					if (res.status == 0 || res.noting == 0) {
						if (
							res.err_code == 750 ||
							res.data[0].fail_count == 0
						) {
							this.$message({
								type: 'success',
								message: '操作成功!',
							});
						} else {
							let url_namearr = [];
							let no_urlarr = [];
							let url_statearr = [];
							for (
								let i = 0;
								i < res.data[0].res_data.length;
								i++
							) {
								console.log(res.data[0].res_data[i][1]);
								if (res.data[0].res_data[i][1] == 1) {
									url_namearr.push(res.res_data[i][0]);
								} else if (res.data[0].res_data[i][1] == 2) {
									no_urlarr.push(res.res_data[i][0]);
								} else if (res.data[0].res_data[i][1] == 3) {
									url_statearr.push(
										res.data[0].res_data[i][0]
									);
								}
							}
							if (url_namearr.length != 0) {
								this.$message({
									type: 'error',
									message: url_namearr + '加速内容不存在!',
								});
							}
							if (no_urlarr.length != 0) {
								this.$message({
									type: 'error',
									message: no_urlarr + '域名不存在!',
								});
							}
							if (url_statearr.length != 0) {
								this.$confirm(
									url_statearr +
										'加速内容的源站域名已被停用，启用源站域名后才能启用加速内容？',
									'提示',
									{
										confirmButtonText: '去启用',
										cancelButtonText: '取消',
										type: 'warning',
									}
								)
									.then(() => {
										this.$router.push({
											path: '/accelerate_management',
										});
									})
									.catch(() => {
										this.$message({
											type: 'info',
											message: '已取消启用',
										});
									});
							}
						}
						this.getuserlist();
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((error) => {});
		},
		// 删除
		deleateuser(datalist) {
			if (!datalist) {
				if (this.currentSelection.length <= 0) {
					this.$message('至少选择一个源站域名进行操作！');
					return false;
				}
			}
			this.$confirm(
				'删除后该加速内容的信息将从列表上移除，信息不可恢复，是否继续？',
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(() => {
					// let params = new Object();
					// params.buser_id = this.chanid + '';
					// if (datalist) {
					// 	params.data_array = [];
					// 	params.data_array.push(datalist.url_name);
					// 	params.data_count = 0;
					// } else {
					// 	const arr = this.multipleSelection.concat(
					// 		this.currentSelection
					// 	);
					// 	params.data_array = arr;
					//     params.data_count = arr.length;

					// }

					let params = new Object();
					let arr = new Array();
					let urllist = [];
					if (datalist) {
						let newobj = new Object();
						newobj.buser_id = this.chanid + '';
						newobj.data_count = 0;
						newobj.state = 1;
						newobj.data_array = [];
						newobj.data_array.push(datalist.url_name);

						urllist.push(newobj);
						params.data_count = 0;
						params.data = urllist;
					} else {
						const arr = this.multipleSelection.concat(
							this.currentSelection
						);
						let newobj = new Object();
						newobj.buser_id = this.chanid + '';
						newobj.data_count = 0;
						newobj.state = 1;
						newobj.data_array = [];
						arr.forEach((item, index) => {
							newobj.data_array.push(item.url_name);
						});
						urllist.push(newobj);
						params.data = urllist;
						params.data_count = urllist.length;
					}
					delete_url(params)
						.then((res) => {
							if (res.status == 0) {
								if (res.data.fail_count == 0) {
									this.$message({
										type: 'success',
										message: '删除成功!',
									});
								} else {
									this.$message({
										type: 'warning',
										message:
											'操作成功，共' +
											res.data.fail_count +
											'条数据删除失败!请检查是操作项是否处于启用状态。',
									});
								}
								this.getuserlist();
							} else {
								this.$message.error(res.msg);
							}
						})
						.catch((error) => {});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
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
	width: 100%;
	height: 100%;
	text-align: left;
	.seach {
		// width: 100%;
		margin: 30px 25px 15px 25px;
		box-sizing: border-box;
		background: #ffffff;
		border-radius: 2px;
		padding: 21px 37px;
		box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
		.seach_top {
			width: 100%;
			height: 60px;
			line-height: 60px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.input-with-select {
				width: 15%;
			}
			.seach_top_right {
				width: 80px;
				text-align: center;
				height: 36px;
				line-height: 36px;
				margin-left: 10px;
			}
		}
		.seach_bottom {
			height: 72px;
			background: rgba(242, 246, 250, 1);
			border-radius: 2px;
			display: flex;
			align-items: center;
			padding-left: 27px;
		}
	}
	.con_lable {
		background: #ffffff;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
		border-radius: 2px;
		padding: 8px 37px 0;
		margin: 0 25px;
		margin-bottom: 30px;
	}
	.host_table {
		padding-top: 25px;
	}
}
</style>
