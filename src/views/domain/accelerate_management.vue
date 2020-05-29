<template>
	<div class="content accelerate_ma">
		<!-- title -->
		<div class="top_title">域名管理</div>
		<div
			style="margin: auto;margin-left: 45px;margin-right: 45px;"
			class="acceleerate_con"
		>
			<!-- 搜索栏 -->
			<div class="seach">
				<div class="seach_top">
					<el-input
						placeholder="请输入源站域名"
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
						:picker-options="pickerOptions0"
					></el-date-picker>
					<!-- <el-button
						type="primary"
						size="mini"
						@click="seachuser()"
						style="margin-left: 10px;"
						>确定</el-button
					> -->
					<el-button
						plain
						size="mini"
						@click="reset()"
						style="margin-left: 10px;"
						>重置</el-button
					>
				</div>
			</div>
			<!-- 表格头部按钮 -->
			<div class="con_lable">
				<div
					class="con_lable_top_btn"
					style="padding:10px 0 18px;display: flex;justify-content: space-between;"
				>
					<div>
						<el-button type="primary" @click="new_btn">
							<span class="el-icon-plus"></span>
							添加域名
						</el-button>
					</div>
				</div>

				<!-- 主体表格 -->
				<el-table
					ref="multipleTable"
					:data="tableData"
					stripe
					border
					tooltip-effect="dark"
					style="width: 100%"
					:cell-style="rowClass"
					:header-cell-style="headClass"
					:default-sort="{ prop: 'date', order: 'descending' }"
					@selection-change="handleSelectionChange"
					@sort-change="tableSortChange"
				>
					<el-table-column
						type="selection"
						width="55"
					></el-table-column>
					<el-table-column
						prop="domain"
						label="源站域名"
						width="320"
						class-name="firsturl"
						:show-overflow-tooltip="true"
					></el-table-column>
					<el-table-column label="状态">
						<template slot-scope="scope">
							<span
								v-if="scope.row.state == 0"
								style="color:#E54545;"
								>已停止</span
							>
							<span
								v-else-if="scope.row.state == 1"
								style="color:#0ABF5B;"
								>正常运行</span
							>
							<span
								v-else-if="scope.row.state == 2"
								style="color:#E54545;"
								>回源失败</span
							>
						</template>
					</el-table-column>
					<el-table-column
						prop="create_time"
						sortable="custom"
						label="创建时间"
					>
						<template slot-scope="scope"
							><span>{{
								scope.row.create_time | settimes
							}}</span></template
						>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button
								@click="revise(scope.$index, scope.row)"
								class="lab_btn"
								type="text"
								size="small"
								>修改</el-button
							>
							<el-button
								v-if="scope.row.state == 1"
								@click="disableuser(scope.$index, scope.row)"
								type="text"
								size="small"
								>停用</el-button
							>
							<el-button
								v-if="scope.row.state != 1"
								@click="enableuser(scope.$index, scope.row)"
								type="text"
								size="small"
								>启用</el-button
							>
							<el-button
								v-if="scope.row.state != 1"
								@click="deleateuser(scope.$index, scope.row)"
								class="lab_btn"
								type="text"
								size="small"
								>删除</el-button
							>
						</template>
					</el-table-column>
				</el-table>
				<!-- 底部分页和按钮 -->
				<div
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
							size="small"
							@click="disableuser()"
							>停用</el-button
						>
						<el-button
							type="text"
							size="small"
							v-show="del_show"
							@click="deleateuser()"
							>删除</el-button
						>
					</div>
					<fenye
						style="padding: 10px 0 20px;;text-align:right"
						@fatherMethod="getpage"
						@fathernum="gettol"
						:pagesa="total_cnt"
						:currentPage="currentPage"
					></fenye>
				</div>

				<!-- 添加域名弹窗 -->
				<el-dialog
					:title="dialog_title"
					:visible.sync="dialogFormVisible"
					class="add_dialog"
					@close="handleClose"
				>
					<el-form :model="form" ref="accelerate_dialog">
						<el-form-item
							label="源站域名"
							:label-width="formLabelWidth"
							prop="name"
							:rules="[{ validator: jiourl, trigger: 'blur' }]"
						>
							<el-input
								v-model="form.name"
								autocomplete="off"
								placeholder="http://或https://开头，72字符内"
							></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="quxzteaone">取 消</el-button>
						<el-button type="primary" @click="quxzteao">{{
							dialog_title == '新增域名' ? '确定' : '修改'
						}}</el-button>
					</div>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script>
import fenye from '@/components/fenye';
import { dateToMs, getymdtime } from '../../servers/sevdate';
import {
	query_url,
	change_state,
	delete_url,
	getterminal,
	add_domain,
	modify_domain,
	query_domain,
	del_domain,
	change_domainstate,
} from '../../servers/api';
export default {
	data() {
		return {
			rotate: false,
			optiondisplay: false,
			currentPage: 1,
			currentPage: 1,
			dialog_title: '新增域名',
			title_num: 0,
			total_cnt: 1,
			del_show: true,
			order: 0,
			input: '', //搜索输入框
			value: -1,
			value1: '',
			tolpage: 1,
			domain_id: '',
			options: [
				{
					value: -1,
					label: '全部',
				},
				{
					value: 0,
					label: '已停用',
				},
				{
					value: 1,
					label: '正常运行',
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
			tableData: [
				// {
				// 	domain: 'http://www.baidu.com',
				// 	state: '1',
				// 	time_create: '1583906243',
				// },
				// {
				// 	domain: 'http://www.baidu.com',
				// 	status: '0',
				// 	time_create: '1583906243',
				// },
			],
			form: {
				name: '',
			},
			formLabelWidth: '120px',
			dialogFormVisible: false,
			currentSelection: [],
			multipleSelection: [],
		};
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
	components: {
		fenye,
	},
	mounted() {
		if (this.$cookies.get('id')) {
			this.chanid = this.$cookies.get('id') * 1;
		} else {
			this.$router.push({ path: '/' });
		}
		this.gettoken();
		this.getuserlist();
	},
	methods: {
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
		//获取数据--请求
		getuserlist() {
			// 已选择项
			this.updateSelection();
			let params = new Object();
			params.page = this.tolpage - 1;
			params.buser_id = this.chanid + '';
			params.domain = this.input;
			params.state = this.value;
			params.order = this.order;
			if (!this.value1) {
				params.start_time = 0;
				params.end_time = 0;
			} else {
				params.start_time = dateToMs(this.value1[0]);
				params.end_time = dateToMs(this.value1[1]);
			}
			query_domain(params)
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
		//修改
		revise(num, row) {
			console.log(row, num);
			this.dialog_title = '修改域名';
			this.form.name = row.domain;
			this.domain_id = row.domain_id;
			this.title_num = num;
			this.dialogFormVisible = true;
		},
		//停用
		disableuser(num, row) {
			console.log(row);
			if (row) {
				this.enable_disable(0, row.domain_id);
			} else {
				this.enable_disable(0);
			}
		},
		//启用
		enableuser(num, row) {
			if (row) {
				this.enable_disable(1, row.domain_id);
			} else {
				this.enable_disable(1);
			}
		},
		//删除
		deleateuser(num, row) {
			console.log(row);
			if (row) {
				this.delete_domin(row.domain_id);
			} else {
				this.delete_domin();
			}
		},
		//添加URL
		new_btn() {
			this.dialog_title = '新增域名';
			this.dialogFormVisible = true;
		},
		//确定搜索
		seachuser() {
			this.getuserlist();
		},
		//搜索重置
		reset() {
			this.value = -1;
			this.value1 = '';
			this.input = '';
			this.getuserlist();
		},
		//筛选状态
		gettimes() {
			this.getuserlist();
		},
		//筛选按钮
		option_display() {
			this.optiondisplay = !this.optiondisplay;
			this.rotate = !this.rotate;
		},
		//获取页码
		getpage(pages) {
			this.tolpage = pages;
			this.getuserlist();
		},
		//获取每页数量
		gettol(pagetol) {
			this.pagesize = pagetol;
			this.getuserlist();
		},
		//回车事件
		onSubmit() {
			this.getuserlist();
		},
		//筛选状态
		getdata() {
			this.getuserlist();
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
		//多选
		handleSelectionChange(val) {
			let stateagr = 0;
			if (val.length) {
				this.currentSelection = val.map((item) => item);
			}
			console.log(this.currentSelection);
			stateagr = 0;
			for (let i = 0; i < this.currentSelection.length; i++) {
				if (this.currentSelection[i].state == 1) {
					stateagr = 1;
				}
			}
			console.log(stateagr);
			if (stateagr == 0) {
				this.del_show = true;
			} else {
				this.del_show = false;
			}
		},
		// 刷新已选择数组
		updateSelection() {
			if (this.currentSelection.length) {
				this.multipleSelection = this.multipleSelection.concat(
					this.currentSelection
				);
				this.currentSelection = [];
				console.log('updateSelection:', this.multipleSelection);
			}
		},
		// 整理列表选中项
		formatChoosen(arr) {
			const urlArr = this.tableData.map((item) => item.domain);
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
			console.log(
				'formatChoosen--multipleSelection:',
				this.multipleSelection
			);
		},
		//计算长度
		getBLen(str) {
			if (str == null) return 0;
			if (typeof str != 'string') {
				str += '';
			}
			return str.replace(/[^\x00-\xff]/g, '01').length;
		},
		//校验url
		jiourl(rule, value, callback) {
			if (value === '') {
				callback(new Error('请输入源站域名'));
			} else {
				var resyzm = /^http(s)?:\/\/[^\u4e00-\u9fa5]{1,68}$/;
				// objExp = new RegExp(resyzm);
				if (this.getBLen(value) > 72) {
					callback(new Error('源站域名长度不能超出72个字符'));
				} else if (resyzm.test(value) === false) {
					callback(new Error('源站域名格式错误'));
				} else {
					callback();
				}
			}
		},
		//添加--关闭
		handleClose() {
			this.quxzteaone();
		},
		//添加--取消
		quxzteaone() {
			this.dialogFormVisible = false;
			this.$refs.accelerate_dialog.resetFields();
			this.form.name = '';
		},
		//添加--确定
		quxzteao() {
			let _this = this;
			this.$refs.accelerate_dialog.validate((valid) => {
				if (valid) {
					if (this.dialog_title == '修改域名') {
						let num = _this.title_num;
						this.$confirm(
							'确认修改源站域名为' +
								_this.form.name +
								'？修改后原源站域名' +
								_this.tableData[num].domain +
								'下的加速内容的源站域名将全部自动修改替换为' +
								_this.form.name,
							'修改确认',
							{
								distinguishCancelAndClose: true,
								confirmButtonText: '确定',
								cancelButtonText: '取消',
							}
						)
							.then(() => {
								_this.tableData[num].domain = _this.form.name;
								this.dialogFormVisible = false;
								this.update_domain();
							})
							.catch((action) => {
								this.$message({
									type: 'info',
									message:
										action === 'cancel'
											? '取消修改'
											: '停留在当前页面',
								});
								this.dialogFormVisible = false;
							});
					} else {
						// let timestamp = new Date().getTime();
						// let obj = {};
						// obj.dominds = this.form.name;
						// obj.status = '';
						// obj.time_create = timestamp / 1000;
						// this.tableData.push(obj);
						// this.$message({
						// 	message: '源站域名添加成功',
						// 	type: 'success',
						// });
						this.add_domin();
					}
				}
			});
		},
		//添加域名--请求
		add_domin() {
			let params = new Object();
			let arr = new Array();
			let dataobj = new Object();
			let timestamp3 = Date.parse(new Date()) / 1000;
			dataobj.domain = this.form.name;
			dataobj.create_time = timestamp3;
			dataobj.buser_id = this.chanid + '';
			arr.push(dataobj);
			params.data_count = 1;
			params.data_array = arr;
			add_domain(params)
				.then((res) => {
					if (res.status == 0) {
						if (res.data.failed_count == 0) {
							this.$message({
								message: '源站域名添加成功',
								type: 'success',
							});
							this.dialogFormVisible = false;
							this.getuserlist();
						} else {
							if (res.data.res_data[0][1] == 1) {
								this.$message.error('您添加的地址格式有误');
							} else if (res.data.res_data[0][1] == 2) {
								this.$message.error('您添加的地址已存在');
							} else if (res.data.res_data[0][1] == 3) {
								this.$message.error('渠道ID不存在');
							} else if (res.data.res_data[0][1] == 4) {
								this.$message.error(
									'改成渠道ID不存在或终端还未创建'
								);
							}
						}
					}
				})
				.catch((error) => {
					console.log(error);
				});
		},
		//修改--请求
		update_domain() {
			let params = new Object();
			params.buser_id = this.chanid + '';
			params.domain_id = this.domain_id;
			params.domain = this.form.name;
			modify_domain(params)
				.then((res) => {
					if (res.status == 0) {
						this.$message({
							type: 'success',
							message: '修改成功',
						});
						this.getuserlist();
					} else {
						this.$message(res.err_msg);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		},
		//启用/禁用--请求
		enable_disable(stat, datalist) {
			console.log(stat, datalist);
			let params = new Object();
			let arr = new Array();
			let urllist = [];
			if (datalist) {
				let newobj = new Object();
				newobj.buser_id = this.chanid + '';
				newobj.data_count = 0;
				newobj.state = stat;
				newobj.data_array = [];
				newobj.data_array.push(datalist);

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
				newobj.state = stat;
				newobj.data_array = [];
				arr.forEach((item, index) => {
					newobj.data_array.push(item.domain_id);
				});
				urllist.push(newobj);
				params.data = urllist;
				params.data_count = urllist.length;
			}
			change_domainstate(params)
				.then((res) => {
					if (res.status == 0) {
						this.$message({
							message: '操作完成',
							type: 'success',
						});
						this.getuserlist();
					} else {
						this.$message(res.err_msg);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		},
		//删除--请求
		delete_domin(datalist) {
			let params = new Object();
			let arr = new Array();
			let urllist = [];
			if (datalist) {
				let newobj = new Object();
				newobj.buser_id = this.chanid + '';
				newobj.data_count = 0;
				newobj.data_array = [];
				newobj.data_array.push(datalist);
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
				newobj.data_array = [];
				arr.forEach((item, index) => {
					newobj.data_array.push(item.domain_id);
				});
				urllist.push(newobj);
				params.data = urllist;
				params.data_count = 0;
			}
			del_domain(params)
				.then((res) => {
                    //后台返回状态不一致（成功res.tatus==0，失败res.noting==0）
					if (res.noting == 0) {
						if (res.data[0].res_data[0][1] == 1) {
							this.$message.error('域名下存在加速资源，不可删除');
						} else if (res.data[0].res_data[0][1] == 2) {
							this.$message.error('域名不存在');
						} else if (res.data[0].res_data[0][1] == 3) {
							this.$message.error('系统出错请稍后重试');
						}
					} else if (res.status == 0) {
						if (res.data.fail_count == 0) {
							this.$message({
								message: '源站域名删除成功',
								type: 'success',
							});
							this.getuserlist();
						} else {
							if (res.data.res_data[0][1] == 1) {
								this.$message.error(
									'域名下存在加速资源，不可删除'
								);
							} else if (res.data.res_data[0][1] == 2) {
								this.$message.error('域名不存在');
							} else if (res.data.res_data[0][1] == 3) {
								this.$message.error('系统出错请稍后重试');
							}
						}
					} else {
						this.$message(res.err_msg);
					}
				})
				.catch((error) => {
					console.log(error);
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
		width: 100%;
		margin: 30px 0 30px 0;
		background: #ffffff;
		border-radius: 2px;
		padding: 21px 37px;
		box-shadow: 0px 0px 7px 0px rgba(41, 108, 171, 0.1);
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
		width: 100%;
		background: #ffffff;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
		border-radius: 2px;
		padding: 8px 37px 0;
	}
}
.el-dialog {
	margin-top: 25vh;
	width: 25%;
	height: 280px;
}
.lab_btn {
	padding: 0;
}
</style>
