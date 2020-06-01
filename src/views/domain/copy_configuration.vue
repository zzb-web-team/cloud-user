<template>
	<div class="copy_configuration">
		<div class="top_title">
			<span @click="goback" style="font-size: 24px;color: #202020;">
				<i
					class="el-icon-arrow-left"
					style="color:#297AFF;font-size: 18px;margin-right:23px;font-weight: 600;"
				></i>
				复制配置
			</span>
		</div>
		<p class="copy_title">
			复制配置允许将一个加速内容的配置项复制到多个加速内容，帮助您对加速内容进行批量配置
		</p>
		<div class="copy_con">
			<div>
				<el-steps
					:active="actives"
					finish-status="success"
					simple
					style="margin-top: 20px;width:50%;"
				>
					<el-step
						title="选择配置项"
						description="这是一段很长很长很长的描述性文字"
					></el-step>
					<el-step
						title="选择加速内容"
						description="这是一段很长很长很长的描述性文字"
					></el-step>
					<el-step
						title="完成"
						description="这是一段很长很长很长的描述性文字"
					></el-step>
				</el-steps>
			</div>

			<div v-show="actives === 1">
				<el-table
					ref="multipleTable_pei"
					:data="futableData"
					tooltip-effect="dark"
					stripe
					style="width: 100%"
					:cell-style="rowClass"
					:header-cell-style="headClass"
					:row-key="getRowKeysfirst"
					@selection-change="handleSelectionChange"
				>
					<el-table-column
						type="selection"
						width="55"
						:reserve-selection="true"
					></el-table-column>
					<el-table-column
						prop="configuration"
						label="配置项"
					></el-table-column>
					<el-table-column
						prop="nowconfiguration"
						label="当前配置"
						show-overflow-tooltip
					>
						<template slot-scope="scope">
							<div
								v-if="scope.row.nowconfiguration == '已配置'"
								style="display: flex;justify-content: center;align-items: center;color:#333333;"
							>
								<i
									class="iconfont icon-dian"
									style="font-size: 36px;color:#297AFF;"
								></i>
								<span>{{ scope.row.nowconfiguration }}</span>
							</div>
							<div
								v-else
								style="display: flex;justify-content: center;align-items: center;color:#949494;"
							>
								<i
									class="iconfont icon-dian"
									style="font-size: 36px;color:#828282;"
								></i>
								<span>{{ scope.row.nowconfiguration }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column>
						<template slot-scope="scope" label="操作">
							<el-button
								@click="handleClick(scope.row)"
								type="text"
								size="small"
								style="color:#547DC0;"
								v-if="scope.row.nowconfiguration == '已配置'"
								>详情</el-button
							>
							<el-button
								@click="handleClick(scope.row)"
								type="text"
								size="small"
								v-else
								>配置</el-button
							>
						</template>
					</el-table-column>
				</el-table>
				<el-button
					style="margin-top: 12px;"
					type="primary"
					@click="next"
					>下一步</el-button
				>
				<el-button style="margin-top: 12px;" @click="fureset(1)"
					>取消</el-button
				>
			</div>
			<div v-show="actives === 2">
				<div
					style="display: flex;justify-content: flex-start;align-items: center;margin: 10px 0"
				>
					<span
						style="margin-right:21px;color:#333333;font-size:14px;"
						>加速内容列表</span
					>
					<el-input
						placeholder="加速内容"
						v-model="fuinput"
						style=" width:300px"
						class="input-with-select"
						maxlength="70"
						@keyup.enter.native="onSubmit"
					></el-input>
				</div>
				<div class="copy_prompt">
					<div class="banyuan"></div>
					<i
						class="el-icon-info"
						style="color:#6666FF;font-size:18px;margin-left:15px;"
					></i>
					已选择
					<span>{{ urlnum }}</span
					>个配置项，最多允许50个
					<span @click="seturllist()" v-if="urlnum !== 0"
						>点击查看</span
					>
				</div>
				<!-- 弹窗 -->
				<div class="copy_active2">
					<el-dialog title="url地址" :visible.sync="urllistVisible">
						<el-table
							:data="urldisable"
							:cell-style="rowClass"
							:header-cell-style="headClass"
						>
							<el-table-column
								type="index"
								label="序号"
								width="150"
							></el-table-column>
							<el-table-column
								prop="url"
								label="url"
							></el-table-column>
						</el-table>

						<div slot="footer" class="dialog-footer">
							<el-button
								@click="urllistVisible = false"
								type="primary"
								>确 定</el-button
							>
						</div>
					</el-dialog>
				</div>
				<!--  -->
				<div>
					<el-table
						ref="multipleTable"
						:data="urllist"
						tooltip-effect="dark"
						stripe
						style="width: 100%"
						:cell-style="rowClass"
						:row-key="getRowKey"
						:header-cell-style="headClass"
						@selection-change="handlistChange"
					>
						<el-table-column
							type="selection"
							width="55"
							:reserve-selection="true"
						></el-table-column>
						<el-table-column
							prop="url"
							label="加速内容"
						></el-table-column>
					</el-table>
					<fenye
						style="text-align:right;margin:20px 0 10px 0;"
						@fatherMethod="getpage"
						@fathernum="gettol"
						:pagesa="total_cnt"
						:currentPage="currentPage"
					></fenye>
				</div>
				<el-button style="margin-top: 2px;" type="primary" @click="last"
					>上一步</el-button
				>
				<el-button style="margin-top: 2px;" type="primary" @click="next"
					>下一步</el-button
				>
				<el-button style="margin-top: 2px;" @click="fureset(2)"
					>取消</el-button
				>
			</div>
		</div>
	</div>
</template>

<script>
import fenye from '@/components/fenye';
import {
	query_url,
	config_url,
	query_urllabel,
	query_config,
} from '../../servers/api';
import { dateToMs, getymdtime } from '../../servers/sevdate';
export default {
	data() {
		return {
			currentPage: 1,
			actives: 1,
			fuinput: '',
			urlname: '',
			urllistVisible: false,
			urllist: [],
			urlnum: 0,
			tolpage: 1,
			pagesize: 10,
			total_cnt: 1,
			chanid: '',
			urldisable: [],
			futableData: [
				// {
				//   configuration: "回源HOST",
				//   nowconfiguration: "已配置",
				//   pname: "host_url",
				//   tabnum: "two",
				//   index: 0
				// },
				{
					configuration: '缓存设置',
					nowconfiguration: '已配置',
					pname: 'cache_config',
					tabnum: 'there',
					index: 1,
				},
				{
					configuration: '缓存过期时间',
					nowconfiguration: '已配置',
					pname: 'expire_time',
					tabnum: 'second',
					index: 2,
				},
				{
					configuration: '自定义页面',
					nowconfiguration: '',
					pname: 'custom_page',
					tabnum: 'four',
					index: 3,
				},
			],
			//配置信息
			datalist: {
				url: '',
				label: '',
				create_time: '',
				label2: 0,
				host_url: {
					valid: 0,
					url: '',
				},
				cache_config: {
					// val: "",
					valid: 0,
					expire_time: 0,
					weight: 0,
				},
				band_config: {
					valid: 0,
					top_band: 0,
				},
				custom_page: [],
			},
			copydatalist: {},
			multipleSelection: [],
			configuration: {}, //配置项
		};
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
		this.urlname = this.$route.query.urlress;
		this.geturlconfig();
		this.geturllist();
	},
	methods: {
		getRowKey(row) {
			return row.url;
		},
		getRowKeysfirst(row) {
			return row.tabnum; // 设定每一条对应一个key
		},

		//获取页码
		getpage(pages) {
			this.tolpage = pages;
			this.geturllist();
		},
		//获取每页数量
		gettol(pagetol) {
			this.pagesize = pagetol;
			// this.geturllist();
		},
		//获取url配置
		geturlconfig() {
			let params = new Object();
			params.url_name = this.urlname;
			params.type = 0;
			params.buser_id = this.chanid + '';
			query_config(params)
				.then((res) => {
					if (res.status == 0) {
						this.copydatalist = res.data.data;
						console.log(this.copydatalist);
						//自定义配置
						if (res.data.data.custom_page.length <= 0) {
							this.futableData[2].nowconfiguration = '未配置';
						} else {
							this.futableData[2].nowconfiguration = '已配置';
						}
						//缓存配置
						if (res.data.data.cache_config.valid == 0) {
							this.futableData[0].nowconfiguration = '未配置';
						} else {
							this.futableData[0].nowconfiguration = '已配置';
						}
						//缓存配置--过期时间
						if (res.data.data.cache_config.data.length <= 0) {
							this.futableData[1].nowconfiguration = '未配置';
						} else {
							this.futableData[1].nowconfiguration = '已配置';
						}
						//回源配置
						// if (res.data.data.host_url.url == "") {
						//   this.futableData[0].nowconfiguration = "未配置";
						// } else {
						//   this.futableData[0].nowconfiguration = "已配置";
						// }
					}
				})
				.catch((err) => {});
		},
		//获取url列表
		geturllist() {
			this.urllist = [];
			let params = new Object();
			params.page = this.tolpage - 1;
			params.buser_id = this.chanid + '';
			params.url_name = this.fuinput;
			params.state = -1;
			params.start_time = 0;
			params.end_time = 0;
			params.order = 0;
			query_url(params)
				.then((res) => {
					if (res.status == 0) {
                        this.total_cnt = res.data.total;
						for (let i = 0; i < res.data.result.length; i++) {
                            let urlobj = {};
							if (res.data.result[i].url_name == this.urlname) {
								continue;
							} else {
								urlobj.url = res.data.result[i].url_name;
								this.urllist.push(urlobj);
								
							}
                        }
					}
				})
				.catch((err) => {});
		},
		//搜索
		onSubmit() {
			this.geturllist();
		},
		//配置项
		seturlconfig() {
			this.multipleSelection.forEach((item, index) => {
				// if (item.pname == "host_url") {
				//   this.configuration[item.pname] = JSON.parse(
				//     JSON.stringify(this.copydatalist[item.pname])
				//   );
				// } else
				if (item.pname == 'cache_config') {
					let dataarr = {};
					dataarr.cache_config = {};
					dataarr.cache_config.data = this.copydatalist.cache_config.data;
					dataarr.cache_config.valid = this.copydatalist.cache_config.valid;
					this.configuration.cache_config = dataarr;
				} else if (item.pname == 'expire_time') {
					this.configuration.cache_config = JSON.parse(
						JSON.stringify(this.copydatalist.cache_config)
					);
				} else if (item.pname == 'custom_page') {
					this.configuration.custom_page = JSON.parse(
						JSON.stringify(this.copydatalist.custom_page)
					);
				}
			});
		},
		//复制配置
		copyconfig() {
			let params = new Object();
			params.data_array = [];
			this.urldisable.forEach((item, index) => {
				this.copydatalist.base_config.url_name = item.url;
				let jsonobj = new Object();
				jsonobj = Object.assign({}, this.configuration);
				// jsonobj.base_config = new Object();
				// jsonobj.base_config = Object.assign(
				// 	{},
				// 	this.copydatalist.base_config
				// );
				jsonobj.url_name = item.url;
				params.data_array.push(jsonobj);
			});
			params.buser_id = this.chanid + '';
			params.data_count = params.data_array.length;
			config_url(params)
				.then((res) => {
					this.$refs.multipleTable.clearSelection();
					this.urlnum = 0;
					this.urldisable = [];
					if (res.status == 0) {
						if (res.data.failed_count == 0) {
							this.$message({
								type: 'success',
								message: '复制配置成功!',
							});
							setTimeout(() => {
								this.$router.push({
									path: '/domain_management',
								});
							}, 1000);
						} else {
							let errarr = '';
							res.data.res_data.forEach((item, index) => {
								errarr = errarr.concat(item[0] + '</br>');
							});
							this.$alert(
								`${errarr}复制配置失败`,
								res.data.failed_count + '条复制配置失败',
								{
									dangerouslyUseHTMLString: true,
								}
							);
						}
					}
				})
				.catch((error) => {});
		},
		//下一步按钮
		next() {
			console.log(this.actives);
			if (this.actives == 1) {
				if (this.multipleSelection.length <= 0) {
					this.$message.error('请至少勾选一个配置项');
					return false;
				} else {
					this.seturlconfig();
				}
			}
			if (this.actives == 2) {
				if (this.urldisable.length <= 0) {
					this.$message.error('请至少选择一个域名进行复制配置');
					return false;
				}
				const confirmText = [
					'域名配置复制后，操作不可逆，请务必确认您的域名复制选择无误。流量宽带较大的域名，请谨慎复制；若您之前有通过工单进行过后端特殊配置（非控制台功能配置），该特殊配置将无法复制。',
				];
				const newDatas = [];
				const h = this.$createElement;
				for (const i in confirmText) {
					newDatas.push(h('p', null, confirmText[i]));
				}

				this.$confirm('您确定要批量复制配置吗？', {
					title: '您确定要批量复制配置吗？',
					message: h('div', null, newDatas),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.copyconfig();
						this.dialupdata = false;
						this.actives = 1;
						// 请求成功之后，调用接口
					})
					.catch(() => {
						this.dialupdata = false;
						this.actives = 2;
						this.$message({
							type: 'info',
							message: '已取消操作',
						});
					});
			}
			if (this.actives++ > 2) {
				this.active = 0;
				return false;
			}
		},
		//复制配置上一步
		last() {
			let _this = this;
			if (_this.actives == 2) {
				_this.$nextTick(function() {
					_this.multipleSelection.forEach((item) => {
						console.log(item.index);
						_this.$refs.multipleTable_pei.toggleRowSelection(
							_this.futableData[item.index],
							true
						);
					});
				});
			}
			if (_this.actives-- < 1) {
				_this.actives = 1;
				return false;
			}
		},
		//选择配置项
		handleSelectionChange(val) {
			this.multipleSelection = [];
			if (val) {
				val.forEach((item, index) => {
					this.multipleSelection.push(item);
				});
			}
		},
		//选择域名--多选
		handlistChange(val) {
			if (val) {
				this.urlnum = val.length;
				this.urldisable = [];
				val.forEach((item, index) => {
					let obj = {};
					obj.url = item.url;
					this.urldisable.push(obj);
				});
			} else {
			}
		},
		//选择配置项--详情
		handleClick(confignum) {
			this.$router.push({
				path: '/batch_management',
				query: { urlress: this.urlname, tabpne: confignum.tabnum },
			});
		},
		//查看已选url
		seturllist() {
			this.urllistVisible = true;
		},
		//复制配置取消
		fureset(num) {
			console.log(num);
			if (num == 1) {
				this.$nextTick(function() {
					this.$refs.multipleTable_pei.clearSelection();
					this.$router.go(-1);
					// this.multipleSelection.forEach((item) => {
					// 	this.$refs.multipleTable_pei.toggleRowSelection(
					// 		this.futableData[item.index],
					// 		false
					// 	);
					// });
				});
			} else {
				this.$refs.multipleTable.clearSelection();
				this.actives--;
			}
			this.dialupdata = false;
		},
		//返回
		goback() {
			this.$router.go(-1);
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
.copy_configuration {
	.copy_title {
		width: auto;
		height: 40px;
		background: rgba(224, 240, 255, 1);
		border: 1px solid rgba(97, 157, 255, 1);
		font-size: 14px;
		color: #728abd;
		margin: auto;
		margin-top: 20px;
		margin-bottom: 20px;
		margin-left: 45px;
		margin-right: 45px;
		line-height: 40px;
		text-align: left;
		padding-left: 17px;
	}
	.copy_con {
		width: auto;
		min-height: 675px;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
		border-radius: 6px;
		margin: auto;
		margin-left: 45px;
		margin-right: 45px;
		padding: 45px 37px;
		.copy_prompt {
			text-align: left;
			width: 632px;
			height: 50px;
			line-height: 50px;
			background: #f0f0ff;
			margin-bottom: 2px;
			border-radius: 2px;
			display: flex;
			align-items: center;
			border-radius: 2px;
			.banyuan {
				width: 5px;
				height: 100%;
				background: #6666ff;
				border-top-left-radius: 15px;
				border-bottom-left-radius: 15px;
			}
			span {
				font-size: 18px;
				color: #6666ff;
			}
		}
	}
}
</style>
