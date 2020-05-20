<template>
	<div class="contendst forget_pwd">
		<div class="titletext">
			<el-form
				:model="ruleForm"
				status-icon
				ref="ruleForm"
				label-width="100px"
				class="demo-ruleForm forget_from"
			>
				<el-form-item>
					<p
						style="color: #333333;font-size: 30px;font-weight: 600;text-align: left;margin-bottom: 10px;"
					>
						忘记密码
					</p>
				</el-form-item>
				<el-form-item
					label
					prop="name"
					:rules="[{ validator: jiophone, trigger: 'blur' }]"
				>
					<el-input
						type="text"
						placeholder="手机号或邮箱"
						v-model="ruleForm.name"
						maxlength="11"
					>
					</el-input>
				</el-form-item>
				<el-form-item
					label
					prop="yzm"
					:rules="[{ validator: jioyzm, trigger: 'blur' }]"
				>
					<el-input
						v-model.number="ruleForm.yzm"
						placeholder="请输入验证码"
						maxlength="6"
						show-word-limit
					>
						<el-button
							slot="append"
							@click="sendyam"
							style="background: #297AFF;color: #fff;width:112px;height:35px;"
							:disabled="getyzmcode"
							>{{
								getyzmcode == true ? num : '获取验证码'
							}}</el-button
						>
					</el-input>
				</el-form-item>
				<el-form-item
					label
					prop="pass"
					:rules="[{ validator: jiouserpwa, trigger: 'blur' }]"
				>
					<el-input
						type="password"
						v-model="ruleForm.pass"
						autocomplete="off"
						placeholder="登陆密码(8~16个字符支持英文，数字，符号组合)"
					></el-input>
				</el-form-item>
				<el-form-item
					label
					prop="checkPass"
					:rules="[{ validator: jioqpwd, trigger: 'blur' }]"
				>
					<el-input
						type="password"
						v-model="ruleForm.checkPass"
						autocomplete="off"
						placeholder="请再次输入密码(两次输入的密码须一致)"
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-button
						round
						style="width: 361px;margin-top: 24px;height: 61.5px;border-radius: 35px;font-size:19px;font-weight:bold;box-shadow:0px 3px 8px 0px rgba(34,100,207,0.38);background:#297AFF;color: #fff;"
						size="medium"
						@click="submitForm('ruleForm')"
						:loading="logining"
						>完成</el-button
					>
					<!-- <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>-->
				</el-form-item>
				<p
					style="text-align: center;color: #297AFF;"
					@click="gologin()"
				>
					去登陆
				</p>
			</el-form>
		</div>
	</div>
</template>

<script>
import { resetpassword, forgetpassword } from '../servers/api';
export default {
	data() {
		return {
			logining: false,
			getyzmcode: false,
			num: 60,
			ruleForm: {
				name: '',
				yzm: '',
				pass: '',
				checkPass: ''
			}
		};
	},
	methods: {
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		sendyam() {
			if (!this.ruleForm.name) {
				this.$message.error('手机号或邮箱不能为空');
			} else {
				this.getyzmcode = true;
				let params = new Object();
				let phonenumber = this.ruleForm.name + '';
				params.user = phonenumber;
				if (phonenumber.indexOf('@') != -1) {
					params.type = 'email';
				} else {
					params.type = 'phone';
				}
				forgetpassword(params)
					.then(res => {
						if (res.status == 0) {
							this.$message({
								message: '获取验证码成功',
								type: 'success'
							});
							let sertiem = setInterval(() => {
								this.num -= 1;
								if (this.num <= 0) {
									clearInterval(sertiem);
									this.num = 60;
									this.getyzmcode = false;
								}
							}, 1000);
						} else {
							this.getyzmcode = false;
							this.$message.error(res.msg);
						}
					})
					.catch(err => {
						this.getyzmcode = false;
					});
			}
		},
		gologin() {
			this.$router.push({
				path: '/'
			});
		},
		//密码重置
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let params = new Object();
					let phonenumber = this.ruleForm.name + '';
					if (phonenumber.indexOf('@') != -1) {
						params.type = 'email';
					} else {
						params.type = 'phone';
					}
					params.user = phonenumber;
					params.password = this.ruleForm.pass;
					params.password2 = this.ruleForm.checkPass;
					params.code = this.ruleForm.yzm;
					resetpassword(params)
						.then(res => {
							if (res.status == 0) {
								this.$message({
									message: '密码重置成功',
									type: 'success'
								});
								setTimeout(() => {
									this.$router.push({ path: '/' });
								}, 1000);
							} else {
								this.$message.error(res.msg);
							}
						})
						.catch(err => {});
				}
			});
		},
		//校验密码
		jiouserpwa(rule, value, callback) {
			var fspwd = /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{8,16}$/;
			if (value === '') {
				callback(new Error('请输入密码'));
			} else {
				if (fspwd.test(value) === false) {
					callback(new Error('密码格式错误'));
				} else {
					if (this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			}
		},
		//校验确认密码
		jioqpwd(rule, value, callback) {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.ruleForm.pass) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		},
		//校验电话号/邮箱
		jiophone(rule, value, callback) {
			if (value === '') {
				callback(new Error('请输入手机号或邮箱'));
			} else {
				if ((value + '').indexOf('@') != -1) {
					var fsemail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
					if (fsemail.test(value) === false) {
						callback(new Error('邮箱格式错误'));
					} else {
						callback();
					}
				} else {
					var fsdtel = /^[1]([3-9])[0-9]{9}$/;
					if (fsdtel.test(value) === false) {
						callback(new Error('手机号格式错误'));
					} else {
						callback();
					}
				}
			}
		},
		//校验验证码
		jioyzm(rule, value, callback) {
			if (value === '') {
				callback(new Error('请输入验证码'));
			} else {
				var resyzm = /^\d{6}$/;
				if (resyzm.test(value) === false) {
					callback(new Error('验证码格式错误'));
				} else {
					callback();
				}
			}
		}
	},
	mounted() {}
};
</script>

<style lang="scss" scoped>
.contendst {
	width: 100%;
	height: 100%;
	background: url(../assets/img/login.png);
	background-size: 100% 100%;

	.titletext {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		.demo-ruleForm {
			width: 368px;
			height: 462px;
			background: #fff;
			padding: 57px 68px 0 69px;
			position: fixed;
			top: 50%;
			right: 15%;
			margin-top: -259.5px;
		}
	}
}
</style>
