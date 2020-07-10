<template>
	<div class="simple">
		<div class="top_title" style=" display: flex;">
			<span @click="goback" style="font-size: 24px;color: #202020;">
				<i
					class="el-icon-arrow-left"
					style="color:#297AFF;font-size: 18px;font-weight: 600;margin-right:23px;"
				></i
				>批量导入加速内容
			</span>
		</div>
		<div class="con">
			<el-button type="primary" @click="down" plain id="dwonexcel"
				>下载模板</el-button
			>

			<el-upload
				class="upload-demo"
				ref="upload"
				:action="excel_url"
				:on-preview="handlePreview"
				:on-remove="handleRemove"
				:file-list="fileList"
				:on-success="handleAvatarSuccess"
				name="excel"
				:auto-upload="false"
			>
				<el-button
					slot="trigger"
					size="small"
					class="MyctiveButton"
					type="primary"
					>上传Excel文件</el-button
				>
				<el-button
					style="position: absolute;left: 37px;bottom: 23px;width:85px;"
					size="small"
					type="success"
					@click="submitUpload"
					>导 入</el-button
				>
				<el-button
					style="position: absolute;left: 130px;bottom: 23px;width:85px;"
					size="small"
					type="success"
					:disabled="disable"
					@click="submitUploadOK"
					>确定</el-button
				>
			</el-upload>
			<div class="url_con" v-if="tableType">
				<!-- 表格 -->
				<el-table
					border
					:data="tableList"
					style="width: 100%"
					height="420px"
					:cell-style="rowClass"
					:header-cell-style="headClass"
				>
					<el-table-column
						label="加速内容名称"
						prop="url_name"
						width="280px"
					>
						<template slot-scope="scope">
							<span
								style="color:red"
								v-if="scope.row.err_acc == false"
								>{{ scope.row.url_name }}</span
							>
							<span style="color:green;" v-else>
								{{ scope.row.url_name }}
							</span>
						</template>
					</el-table-column>
					<el-table-column
						label="源站域名"
						prop="domain"
						width="280px"
					>
						<template slot-scope="scope">
							<span
								style="color:red"
								v-if="scope.row.err_domain == false"
								>{{ scope.row.domain }}</span
							>
							<span style="color:green;" v-else>
								{{ scope.row.domain }}
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="host_url" label="回源路径">
						<template slot-scope="scope">
							<span
								style="color:red"
								v-if="scope.row.err_hosturl == false"
								>{{ scope.row.host_url }}</span
							>
							<span style="color:green;" v-else>
								{{ scope.row.host_url }}
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="url" label="播放路径">
						<template slot-scope="scope">
							<span
								style="color:red"
								v-if="scope.row.err_url == false"
								>{{ scope.row.url }}</span
							>
							<span style="color:green;" v-else>
								{{ scope.row.url }}
							</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="url_type"
						label="视频类型(0:mp4 1:hls 2:flv)"
						width="210px"
					>
						<template slot-scope="scope">
							<span
								style="color:red"
								v-if="scope.row.err_url_type == false"
								>{{ scope.row.url_type }}</span
							>
							<span style="color:green;" v-else>
								{{ scope.row.url_type }}
							</span>
						</template>
					</el-table-column>
					<!-- <el-table-column
						prop="buser_id"
						label="渠道ID"
					></el-table-column> -->
					<!-- <el-table-column prop="label" label="标签">
            <template slot-scope="scope">
              <span v-if="scope.row.err_label == false" style="color:red">{{ scope.row.label }}</span>
              <span v-else style="color:green;">
                {{
                scope.row.label
                }}
              </span>
            </template>
          </el-table-column> -->
					<!-- <el-table-column prop="label2" label="视频终端">
            <template slot-scope="scope">
              <span v-if="scope.row.err_label2 == false" style="color:red">{{ scope.row.label2 }}</span>
              <span v-else style="color:green;">
                {{
                scope.row.label2
                }}
              </span>
            </template>
          </el-table-column>-->
					<el-table-column label="上传状态">
						<template slot-scope="scope">
							<span
								v-if="scope.row.status == '成功'"
								style="color:green"
								>成功</span
							>
							<span
								v-else-if="scope.row.status == '待上传'"
								style="color:grey"
								>待上传</span
							>
							<span v-else style="color:red">
								{{ scope.row.status }}
							</span>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button
								@click.native.prevent="
									deleteRow(scope.$index, tableList)
								"
								type="text"
								size="small"
								v-if="
									scope.row.err == false ||
										scope.row.err_url_type == false ||
										scope.row.err_url_name == false
								"
								>移除</el-button
							>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
				<div v-for="item in message" :key="item" class="cerr">
					<span>{{ item.url }}</span>
					<span>{{ item.state }}</span>
				</div>
				<span slot="footer" class="dialog-footer">
					<!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
					<el-button type="primary" @click="dialogVisible = false"
						>确 定</el-button
					>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import { query_url, add_url, uploadurl } from '../../servers/api';
export default {
	inject: ['reload'],
	data() {
		return {
			fileList: [],
			message: [],
			tableList: [],
			title: '',
			chanid: '',
			errnum: 0,
			excel_url: '',
			disable: true,
			dialogVisible: false,
			tableType: false,
		};
	},
	mounted() {
		if (this.$cookies.get('id')) {
			this.chanid = this.$cookies.get('id') * 1;
		} else {
			this.$router.push({ path: '/' });
		}

		this.excel_url = uploadurl + '/url_mgmt/excelurluser';
		// console.log(uploadurl, '*************', this.excel_url);
	},
	methods: {
		splitData(list) {
			this.uploadData(list, 1);
		},
		uploadData(list, page) {
			var remaining = 0;
			var len = list.length;
			var i = (page - 1) * 10;
			if (i > len) {
				return false;
			}
			if (list.length - 10 <= 0) {
				remaining = 0;
			} else {
				remaining = list.length - i;
			}
			var res = [];
			if (i != 0) {
				if (remaining > 10) {
					res = list.slice(i, i + 10);
				} else {
					res = list.slice(i, i + remaining);
				}
			} else {
				if (remaining > 10) {
					res = list.slice(i, i + 10);
				} else {
					res = list.slice(i, len);
				}
			}
			let param = new Object();
			param.data_count = res.length;
			param.data_array = res;
			// param.data_array = list;
			add_url(param)
				.then((res) => {
					if (res.status == 0) {
						let nowarr = res.data.res_data;
						for (var i = 0; i < nowarr.length; i++) {
							for (var j = 0; j < this.tableList.length; j++) {
								if (
									this.tableList[j].url_name == nowarr[i][0]
								) {
									if (nowarr[i][1] === 0) {
										this.tableList[j].status = '成功';
									} else if (nowarr[i][1] === 1) {
										this.tableList[j].status = '格式错误';
									} else if (nowarr[i][1] === 2) {
										this.tableList[j].status =
											'加速内容重复';
									} else if (nowarr[i][1] === 3) {
										this.tableList[j].status = '用户不存在';
									} else if (nowarr[i][1] === 4) {
										this.tableList[j].status =
											'渠道ID不存在或终端还未创建';
									} else {
										this.tableList[j].status =
											'源站域名不存在';
									}
								}
							}
						}
						if (parseInt(list.length / 10) <= page - 1) {
							if (res.data.failed_count == 0) {
								setTimeout(() => {
									this.$router.push({
										path: '/domain_management',
									});
								}, 2000);
							}
						} else {
							page++;
							this.uploadData(list, page);
						}
					}
				})
				.catch((error) => {});
		},
		//确定上传
		submitUploadOK() {
			if (this.tableList.length <= 0) {
				this.$message.error('导入信息不能为空');
				return false;
			} else {
				this.splitData(this.tableList);
			}
		},
		goback() {
			this.$router.go(-1);
		},
		//文件列表移除文件
		submitUpload() {
			this.$refs.upload.submit();
		},
		//上传
		handlePreview(file) {},
		//移除上传文件
		deleteRow(index, rows) {
			rows.splice(index, 1);
			this.errnum--;
			if (this.errnum <= 0) {
				this.disable = false;
			}
			if (this.tableList.length <= 0) {
				this.disable = true;
			}
		},
		handleRemove(file, fileList) {},
		//上传成功
		handleAvatarSuccess(res, file) {
			this.message = [];
			this.title = '';
			if (res.status == 0) {
				if (res.err_code == 0) {
					this.tableType = true;
					for (var i = 0; i < res.data.length; i++) {
						// res.data[i].label = res.data[i].label + '';
						res.data[i].status = '';
						res.data[i].buser_id = this.chanid + '';
						var resyzm = /^http(s)?:\/\/[^\u4e00-\u9fa5]{1,1020}$/; // 校验url
						// var resship = /^(?!(\d+)$)[\u4e00-\u9fffa-zA-Z\d]{2,50}$/; //校验视频名称
						// var restable = /^[\u4e00-\u9fffa-zA-Z\d]{4,64}$/; //校验标签
						// var resnum = /^[0-9]*$/; //校验终端
						var resaccelerate = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,1024}$/; //加速内容
						//var respath = /^\/{1}[0-9a-zA-Z\/\+\.?%#&=]{1,1024}$/; //路径
						var respath = /^\/{1}.{1,1024}$/;

						if (respath.test(res.data[i].url) === false) {
							res.data[i].err_url = false;
							this.disable = true;
							res.data[i].status += '播放路径格式错误\n';
						}
						if (respath.test(res.data[i].host_url) === false) {
							res.data[i].err_hosturl = false;
							this.disable = true;
							res.data[i].status += '回源路径格式错误\n';
						}
						if (resyzm.test(res.data[i].domain) === false) {
							res.data[i].err_domain = false;
							this.disable = true;
							res.data[i].status += '源站域名格式错误\n';
						}
						if (this.getBLen(res.data[i].domain) < 4) {
							res.data[i].err_url_name +=
								'视频名称不能小于4字符\n';
							res.data[i].err_url_name = false;
						}
						if (this.getBLen(res.data[i].domain) > 1024) {
							res.data[i].err_url_name +=
								'视频名称不能大于1024字符\n';
							res.data[i].err_url_name = false;
						}
						if (
							res.data[i].url_type >= 3 ||
							res.data[i].url_type < 0
						) {
							res.data[i].status += '视频类型错误\n';
							res.data[i].err_url_type = false;
						}
						if (
							resaccelerate.test(res.data[i].url_name) === false
						) {
							res.data[i].status += '加速内容格式错误\n';
							res.data[i].err_acc = false;
						}

						if (res.data[i].status == '') {
							res.data[i].status = '待上传';
						} else {
							this.errnum++;
							// res.data[i].status = res.data[i].status.slice(0,-1);
						}
					}
					if (this.errnum == 0) {
						this.disable = false;
					}
					this.tableList = res.data;
				}
			} else {
				this.$message({
					showClose: true,
					message: '服务器响应超时',
					type: 'error',
				});
			}
		},
		//检查字符串长度
		getBLen(str) {
			if (str == null) return 0;
			if (typeof str != 'string') {
				str += '';
			}
			return str.replace(/[^\x00-\xff]/g, '01').length;
		},
		errormove(err, file, fileList) {},
		down() {
			var url = uploadurl + '/static/user_url.xls';
			window.location.href = url;
		},
		// 表头样式设置
		headClass() {
			return 'text-align: center;background:#eef1f6;color:#333333;font-size:16px;';
		},
		// 表格样式设置
		rowClass() {
			return 'text-align: center;';
		},
	},
};
</script>

<style lang="scss" scoped>
.con {
	position: relative;
	width: auto;
	height: 600px;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
	border-radius: 2px;
	margin: auto;
	margin-left: 45px;
	margin-right: 45px;
	margin-top: 20px;
	padding: 18px 37px;
	text-align: left;
}

.MyctiveButton {
	position: absolute;
	top: 18px;
	left: 37px;
}

// .el-button--small {
//     padding: 12px 15px !important;
// }

.url_con {
	width: 100%;
	height: 300px;
	background: #999999;
}
</style>
