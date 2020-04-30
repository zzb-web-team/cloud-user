<template>
	<div class="add_url">
		<div class="top_title">
			<span @click="goback" style="font-size: 24px;color: #202020;">
				<i
					class="el-icon-arrow-left"
					style="color:#297AFF;font-size: 18px;margin-right:23px;font-weight: 600;"
				></i>
				创建加速内容
			</span>
		</div>
		<div class="content">
			<el-form :model="dynamicValidateForm" ref="dynamicValidateForm">
				<p>创建点播加速内容</p>
				<el-form-item
					label="加速内容名称:"
					:label-width="formLabelWidth"
					prop="url_content"
					:rules="[{ validator: jioshi, trigger: 'blur' }]"
				>
					<el-input
						class="other_bgc"
						v-model="dynamicValidateForm.url_content"
						placeholder="4-50个字符，汉字、英文、数字任意组合"
						maxlength="1024"
					></el-input>
					<span class="add_url_point">创建成功后将无法修改</span>
				</el-form-item>
				<p class="add_url_title">加速配置</p>
				<el-form-item
					label="源站域名"
					:label-width="formLabelWidth"
					prop="url_address"
					:rules="[
						{
							message: '源站域名不能为空',
							trigger: 'blur',
						},
					]"
				>
					<el-select
						v-model="dynamicValidateForm.url_address"
						placeholder="请选择"
					>
						<el-option
							v-for="(item, index) in url_arr"
							:key="index"
							:label="item.label"
							:value="item.label"
						></el-option>
					</el-select>
					<el-button
						type="text"
						size="small"
						@click="go_accelerate_management"
						v-show="yewu.length < 0"
						>去添加</el-button
					>
				</el-form-item>
				<el-form-item
					label="回源路径:"
					:label-width="formLabelWidth"
					prop="back_path"
					:rules="[{ validator: jiozhu, trigger: 'blur' }]"
				>
					<el-input
						class="other_bgc"
						v-model="dynamicValidateForm.back_path"
						placeholder="开头固定为/，2-1024字符内"
						maxlength="1024"
					></el-input>
				</el-form-item>
				<el-form-item
					label="播放路径:"
					:label-width="formLabelWidth"
					prop="play_path"
					:rules="[{ validator: jiozhu, trigger: 'blur' }]"
				>
					<el-input
						class="other_bgc"
						v-model="dynamicValidateForm.play_path"
						placeholder="开头固定为/，2-1024字符内"
						autocomplete="off"
						maxlength="50"
					></el-input>
				</el-form-item>
				<el-form-item
					label="视频格式"
					:label-width="formLabelWidth"
					prop="format"
					:rules="[
						{
							message: '视频格式不能为空',
							trigger: 'blur',
						},
					]"
				>
					<el-select
						v-model="dynamicValidateForm.format"
						placeholder="请选择"
					>
						<el-option
							v-for="(item, index) in yewu"
							:key="index"
							:label="item.label"
							:value="item.label"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="add_urlfooter">
				<el-button
					type="primary"
					@click="dialogFormVisiblea('dynamicValidateForm')"
					style="width:96px;height:36px;background:rgba(41,122,255,1);border-radius:2px;"
					>确 定</el-button
				>
				<el-button
					@click="dialogFormVisibles('dynamicValidateForm')"
					style="width:96px;height:36px;background:rgba(225,225,225,1);border-radius:2px;color:#666666;"
					>取 消</el-button
				>
			</div>
		</div>
	</div>
</template>

<script>
import { add_url, query_domain } from '../../servers/api';
export default {
	data() {
		return {
			dynamicValidateForm: {
				url_content: '',
				url_address: '',
				back_path: '',
				play_path: '',
				format: '',
			},
			formLabelWidth: '110px',
			url_arr: [],
			pagenum: 0,
			yewu: [
				{
					value: 0,
					label: 'mp4',
				},
				{
					value: 1,
					label: 'hls',
				},
				{
					value: 2,
					label: 'flv',
				},
			],
			fu: [],
			label2: [],
			chanid: '',
			page: 0,
		};
	},
	mounted() {
		if (this.$cookies.get('id')) {
			this.chanid = this.$cookies.get('id') * 1;
		} else {
			this.$router.push({ path: '/' });
		}
		this.fu = [];
		this.label2 = [];
		this.getuserlist(0);
	},
	methods: {
		//返回
		goback() {
			this.$router.go(-1);
		},
		//添加URL
		new_btn() {
			this.dialogFormVisible = true;
		},
		//添加URL取消
		dialogFormVisibles(formName) {
			this.dynamicValidateForm.url_content = '';
			this.dynamicValidateForm.url_address = '';
			this.dynamicValidateForm.back_path = '';
			this.dynamicValidateForm.play_path = '';
			this.dynamicValidateForm.format = '';
			this.dialogFormVisible = false;
			this.$refs[formName].resetFields();
			this.$router.go(-1);
		},
		addurl() {
			//添加url
			let parmise = new Object();
			let arr = [];
			let dataobj = new Object();
			dataobj.url_name = this.dynamicValidateForm.url_content;
			dataobj.domain = this.dynamicValidateForm.url_address;
			dataobj.host_url = this.dynamicValidateForm.back_path;
			dataobj.url = this.dynamicValidateForm.play_path;
			if (this.dynamicValidateForm.format == 'mp4') {
				dataobj.url_type = 0;
			} else if (this.dynamicValidateForm.format == 'hls') {
				dataobj.url_type = 1;
			} else if (this.dynamicValidateForm.format == 'flv') {
				dataobj.url_type = 2;
			}
			dataobj.buser_id = this.chanid + '';
			dataobj.create_time = Date.parse(new Date()) / 1000;
			arr.push(dataobj);
			parmise.data_array = arr;
			parmise.data_count = 1;
			add_url(parmise)
				.then((res) => {
					if (res.status == 0) {
						if (res.data.failed_count == 0) {
							this.$message({
								message: '加速内容添加成功',
								type: 'success',
							});
							this.dynamicValidateForm.url_content = '';
							this.dynamicValidateForm.url_address = '';
							this.dynamicValidateForm.back_path = '';
							this.dynamicValidateForm.play_path = '';
							this.dynamicValidateForm.format = '';
							this.dialogFormVisible = false;
							setTimeout(() => {
								this.$router.push({
									path: '/domain_management',
								});
							}, 1000);
						} else {
							if (res.data.res_data[0][1] === 1) {
								this.$message.error('添加信息格式错误');
							} else if (res.data.res_data[0][1] === 2) {
								this.$message.error('url已存在');
							} else if (res.data.res_data[0][1] === 3) {
								this.$message.error('渠道ID不存在');
							} else if (res.data.res_data[0][1] === 4) {
								this.$message.error('数据库写人错误');
							}
						}
					}
				})
				.catch((error) => {});
		},
		//获取url列表--请求
		getuserlist(page) {
			// 已选择项
			let params = new Object();
			params.page = page;
			params.buser_id = this.chanid + '';
			params.domain = '';
			params.state = -1;
			params.order = 0;
			params.start_time = 0;
			params.end_time = 0;
			query_domain(params)
				.then((res) => {
					if (res.status == 0) {
						res.data.result.forEach((item, index) => {
							let obj = {};
							obj.buser_id = item.buser_id;
							obj.create_time = item.create_time;
							obj.label = item.domain;
							obj.value = item.domain_id;
							obj.state = item.state;
							this.url_arr.push(obj);
						});
						if (res.data.remaining == 0) {
							return false;
						} else {
							this.pagenum++;
							this.getuserlist(this.pagenum);
						}
					} else {
					}
				})
				.catch((err) => {});
		},
		go_accelerate_management() {
			this.$router.push({ path: '/accelerate_management' });
		},
		getBLen(str) {
			if (str == null) return 0;
			if (typeof str != 'string') {
				str += '';
			}
			return str.replace(/[^\x00-\xff]/g, '01').length;
		},
		//添加URL确定
		dialogFormVisiblea(formName) {
			console.log(this.dynamicValidateForm);
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.addurl();
				} else {
					return false;
				}
			});
		},
		//校验加速内容名称
		jioshi(rule, value, callback) {
			if (value === '') {
				callback(new Error('请输入加速内容名称'));
			} else {
				var resyzm = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,1024}$/;
				if (this.getBLen(value) > 1024) {
					callback(new Error('加速内容名称不能超出1024个字符'));
				} else if (this.getBLen(value) < 2) {
					callback(new Error('加速内容名称不能少于2个字符'));
				} else if (resyzm.test(value) === false) {
					callback(new Error('加速内容名称格式错误'));
				} else {
					callback();
				}
			}
		},
		//校验路径
		jiozhu(rule, value, callback) {
			if (value === '') {
				callback(new Error('路径不能为空'));
			} else {
				var resyzm = /^\/{1}[0-9a-zA-Z\/\+\.?%#&=]{1,1024}$/;
				if (resyzm.test(value) === false) {
					callback(new Error('路径格式错误'));
				} else {
					callback();
				}
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.content {
	width: auto;
	margin: auto;
	margin-left: 45px;
	margin-right: 45px;
	height: 538px;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
	border-radius: 2px;
	margin-top: 20px;
	padding: 23px 38px;
	p {
		width: 100%;
		height: 30px;
		font-size: 16px;
		font-weight: 500;
		text-align: left;
		color: #333333;
		line-height: 18px;
		margin: 15px 0;
	}
	.add_url_title {
		display: inline-block;
		padding: 15px 0;
		border-top: 1px solid #e3e3e3;
	}
	.add_url_point {
		font-size: 12px;
		color: #9b9b9b;
	}
	.add_urlfooter {
		border-top: 1px solid #e3e3e3;
		text-align: left;
		margin-top: 24px;
		padding-top: 21px;
	}
}
input::-webkit-input-placeholder {
	color: #c0c4cc;
	font-size: 12px;
}
input::-moz-input-placeholder {
	color: #c0c4cc;
	font-size: 12px;
}
input::-ms-input-placeholder {
	color: #c0c4cc;
	font-size: 12px;
}
</style>
