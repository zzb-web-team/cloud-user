<template>
	<div class="add_url">
		<div class="top_title">
			<span @click="goback" style="font-size: 24px;color: #202020;"
				><i
					class="el-icon-arrow-left"
					style="color:#297AFF;font-size: 18px;margin-right:23px;font-weight: 600;"
				></i>
				添加URL</span
			>
		</div>
		<div class="content">
			<el-form :model="dynamicValidateForm" ref="dynamicValidateForm">
				<el-form-item
					label="URL:"
					:label-width="formLabelWidth"
					prop="url_a"
					:rules="[{ validator: jiourl, trigger: 'blur' }]"
				>
					<el-input
						class="other_bgc"
						v-model="dynamicValidateForm.url_a"
						placeholder="URL头固定为https:// 或http://，1024字符内"
						maxlength="1024"
					></el-input>
				</el-form-item>
				<el-form-item
					label="视频名称:"
					:label-width="formLabelWidth"
					prop="url_name"
					:rules="[{ validator: jioshi, trigger: 'blur' }]"
				>
					<el-input
						class="other_bgc"
						v-model="dynamicValidateForm.url_name"
						placeholder="4~50个字符，汉字、英文字母、数字组合，或纯汉字或英文，不能为纯数字"
						autocomplete="off"
						maxlength="50"
					></el-input>
				</el-form-item>
				<el-form-item
					label="视频格式"
					:label-width="formLabelWidth"
					prop="radio"
					:rules="{
						required: true,
						message: '业务类型不能为空',
						trigger: 'blur'
					}"
				>
					<el-select
						v-model="dynamicValidateForm.radio"
						placeholder="请选择"
					>
						<el-option
							v-for="(item, index) in yewu"
							:key="index"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="视频终端:"
					:label-width="formLabelWidth"
					prop="labe2"
					:rules="{
						required: true,
						message: '视频终端不能为空',
						trigger: 'blur'
					}"
				>
					<el-select
						v-model="dynamicValidateForm.labe2"
						placeholder="请选择"
					>
						<el-option
							v-for="(item, index) in fu"
							:key="index + item"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="标签:"
					:label-width="formLabelWidth"
					prop="labe1"
					:rules="[{ validator: jiozhu, trigger: 'blur' }]"
				>
					<el-input
						class="other_bgc"
						v-model="dynamicValidateForm.labe1"
						placeholder="4~64个字符，英文字母或字母+数字组合"
						autocomplete="off"
					></el-input>
				</el-form-item>
			</el-form>
			<p>
				说明：用户可以自定义标签设置，标签设置为自选项，标签设置的作用是保护源站信息隐藏不被泄露，防止黑客攻击
			</p>
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
import { add_url, check_label, getterminal } from '../../servers/api';
export default {
	data() {
		return {
			dynamicValidateForm: {
				url_name: '',
				labe1: '',
				labe2: '',
				radio: '',
				url_a: ''
			},
			formLabelWidth: '100px',
			yewu: [
				{
					value: 0,
					label: 'mp4'
				},
				{
					value: 1,
					label: 'flv'
				},
				{
					value: 2,
					label: 'hls'
				}
			],
			fu: [
				// {
				//   value: 0,
				//   label: "腾讯视频"
				// },
				// {
				//   value: 1,
				//   label: "南瓜视频"
				// }
			],
			label2: [],
			chanid: '',
			page: 0
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
		this.getlabrl2();
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
			this.dynamicValidateForm.url_name = '';
			this.dynamicValidateForm.labe1 = '';
			this.dynamicValidateForm.labe1 = '';
			this.dynamicValidateForm.radio = '';
			this.dynamicValidateForm.url_a = '';
			this.dialogFormVisible = false;
			this.$refs[formName].resetFields();
			this.$router.go(-1);
		},
		//获取视频终端
		getlabrl2() {
			let parmas = new Object();
			parmas.chanid = this.chanid;
			parmas.page = this.page;
			getterminal(parmas)
				.then(res => {
					res.result.cols.forEach((item, index) => {
						let obj = {};
						obj.value = item.id;
						obj.label = item.name + '--' + '(' + item.type + ')';
						this.label2.push(obj);
					});
					if (res.result.les_count == 0) {
						var obj = {};
						for (var i = 0; i < this.label2.length; i++) {
							if (!obj[this.label2[i].value]) {
								this.fu.push(this.label2[i]);
								obj[this.label2[i].value] = true;
							}
						}
						return false;
					} else {
						this.page++;
						this.getlabrl2();
					}
				})
				.catch(error => {});
		},
		//验证标签
		jiaotabel() {
			if (this.dynamicValidateForm.labe1 != '') {
				let parmas = new Object();
				let labelarr = [];
				labelarr.push(this.dynamicValidateForm.labe1);
				parmas.data_count = 1;
				parmas.data_array = labelarr;
				check_label(parmas)
					.then(res => {
						if (res.status == 0) {
							if (res.data.success_count == 0) {
								this.$message.error('标签已存在');
								return false;
							} else {
								this.addurl();
							}
						} else {
							this.$message.error(res.err_msg);
							return false;
						}
					})
					.catch(error => {});
			} else {
				this.addurl();
			}
		},
		addurl() {
			//添加url
			let parmise = new Object();
			let arr = [];
			let dataobj = new Object();
			dataobj.url = this.dynamicValidateForm.url_a;
			dataobj.url_type = this.dynamicValidateForm.radio;
			dataobj.url_name = this.dynamicValidateForm.url_name;
			dataobj.label = this.dynamicValidateForm.labe1;
			dataobj.label2 = this.dynamicValidateForm.labe2;
			dataobj.buser_id = this.chanid + '';
			dataobj.create_time = Date.parse(new Date()) / 1000;
			arr.push(dataobj);
			parmise.data_array = arr;
			parmise.data_count = 1;
			add_url(parmise)
				.then(res => {
					if (res.status == 0) {
						if (res.data.failed_count == 0) {
							this.$message({
								message: 'URL添加成功',
								type: 'success'
							});
							this.dynamicValidateForm.url_name = '';
							this.dynamicValidateForm.labe1 = '';
							this.dynamicValidateForm.labe2 = '';
							this.dynamicValidateForm.radio = '';
							this.dynamicValidateForm.url_a = '';
							this.dialogFormVisible = false;
							setTimeout(() => {
								this.$router.push({
									path: '/domain_management'
								});
							}, 1000);
						} else {
							if (res.data.res_data[0][1] === 1) {
								this.$message.error('添加信息格式错误');
							} else if (res.data.res_data[0][1] === 2) {
								this.$message.error('url已存在');
							} else if (res.data.res_data[0][1] === 3) {
								this.$message.error('标签已存在');
							} else if (res.data.res_data[0][1] === 4) {
								this.$message.error('渠道ID不存在');
							} else if (res.data.res_data[0][1] === 5) {
								this.$message.error('数据库写人错误');
							} else {
								this.$message({
									message: 'URL添加成功',
									type: 'success'
								});
							}
						}
					}
				})
				.catch(error => {});
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
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.jiaotabel();
				} else {
					return false;
				}
			});
		},
		//校验url
		jiourl(rule, value, callback) {
			if (value === '') {
				callback(new Error('请输入URL'));
			} else {
				var resyzm = /^http(s)?:\/\/[^\u4e00-\u9fa5]{1,1020}$/;
				// objExp = new RegExp(resyzm);
				if (this.getBLen(value) > 1024) {
					callback(new Error('URL长度不能超出1024个字符'));
				} else if (resyzm.test(value) === false) {
					callback(new Error('URL格式错误'));
				} else {
					callback();
				}
			}
		},
		//校验视频名称
		jioshi(rule, value, callback) {
			if (value === '') {
				callback(new Error('请输入视频名称'));
			} else {
				var resyzm = /^(?!(\d+)$)[\u4e00-\u9fffa-zA-Z\d]{2,50}$/;
				if (this.getBLen(value) > 50) {
					callback(new Error('视频名称不能超出50个字符'));
				} else if (this.getBLen(value) < 4) {
					callback(new Error('视频名称不能少于4个字符'));
				} else if (resyzm.test(value) === false) {
					callback(new Error('视频名称格式错误'));
				} else {
					callback();
				}
			}
		},
		//校验标签
		jiozhu(rule, value, callback) {
			if (value === '') {
				callback();
			} else {
				var resyzm = /^[\u4e00-\u9fffa-zA-Z\d]{4,64}$/;
				if (resyzm.test(value) === false) {
					callback(new Error('标签格式错误'));
				} else {
					callback();
				}
			}
		}
	}
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
		width: 396px;
		height: 30px;
		font-size: 12px;
		font-weight: 500;
		text-align: left;
		color: #999999;
		line-height: 18px;
	}
	.add_urlfooter {
		border-top: 1px solid #e3e3e3;
		text-align: left;
		margin-top: 24px;
		padding-top: 21px;
	}
}
</style>
