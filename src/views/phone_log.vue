<template>
	<div class="contendst phone_log">
		<div class="titletext">
			<el-form
				:model="ruleForm"
				status-icon
				ref="ruleForm"
				label-width="100px"
				class="demo-ruleForm phone_log"
			>
				<el-form-item>
					<p
						style="font-size: 30px;color: #333333;text-align: left;margin-bottom: 20px;font-weight: 600;"
					>
						短信验证登录
					</p>
				</el-form-item>
				<el-form-item
					label
					prop="name"
					:rules="[{ validator: jiophone, trigger: 'blur' }]"
				>
					<el-input
						v-model.number="ruleForm.name"
						maxlength="11"
						placeholder="请输入手机号"
					></el-input>
				</el-form-item>
				<el-form-item
					label
					prop="yzm"
					:rules="[{ validator: jioyzm, trigger: 'blur' }]"
				>
					<el-input
						v-model.number="ruleForm.yzm"
						maxlength="6"
						show-word-limit
						placeholder="请输入验证码"
                        @keyup.enter.native="phonlog('ruleForm')"
					>
						<el-button
							slot="append"
							@click="sendyam"
							:disabled="getyzmcode"
							style="background: #297AFF;color: #fff;border:1px solid #297AFF;width:112px;height:38px;"
							>{{
								getyzmcode == true ? num : '获取验证码'
							}}</el-button
						>
					</el-input>
				</el-form-item>
				<div
					style="display: flex;justify-content: space-between;align-items: center;color: #999999;font-size: 16px;margin: 23px 0;"
				>
					<span @click="goforget()">忘记密码？</span>
					<span @click="goregister()">注册</span>
				</div>
				<el-form-item>
					<el-button
						round
						style="width: 361px;margin-top: 20px;height: 61.5px;border-radius: 35px;font-size:19px;font-weight:bold;box-shadow:0px 3px 8px 0px rgba(34,100,207,0.38);background:#297AFF;color:#FFF;"
						size="medium"
						@click="phonlog('ruleForm')"
						:loading="logining"
						>立即登录</el-button
					>
				</el-form-item>
				<div
					style="display: flex;justify-content: space-evenly;align-items: center;color:#297AFF;font-size:16px;"
				>
					<span @click="gophonelog()">账号密码登陆</span>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script>
import { forgetpassword, loginbyphone } from '../servers/api';
export default {
	data() {
		return {
			logining: false,
			getyzmcode: false,
			num: 60,
			ruleForm: {
				name: '',
				yzm: ''
			}
		};
	},
	mounted() {
		if (this.$route.query.phone) {
			this.ruleForm.name = this.$route.query.phone;
		}
	},
	methods: {
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		sendyam() {
			this.loading = true;
			this.getyzmcode = true;
			let params = new Object();
			params.user = this.ruleForm.name + '';
			params.type = 'phone';
			forgetpassword(params)
				.then(res => {
					this.loading = false;
					if (res.status == 0) {
						this.$message({
							message: '获取验证码成功',
							type: 'success'
						});
						this.getyzmcode = true;
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
					this.loading = false;
					this.getyzmcode = false;
				});
		},
		//登陆
		phonlog(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let params = new Object();
					params.phone = this.ruleForm.name + '';
					params.code = this.ruleForm.yzm;
					loginbyphone(params)
						.then(res => {
							if (res.status == 0) {
								sessionStorage.setItem(
									'id',
									JSON.stringify(res.msg.id)
								);
								sessionStorage.setItem(
									'user',
									JSON.stringify(res.msg.username)
								);
								this.$cookies.set(
									'user',
									res.msg.username,
									7 * 24 * 60 * 60
								);
								this.$cookies.set(
									'id',
									res.msg.id,
									7 * 24 * 60 * 60
								);
								this.$cookies.set(
									'token',
									res.token,
									7 * 24 * 60 * 60
								);
								this.$router.push({
									path: '/overview'
								});
							} else {
								this.$message({
									message: res.msg,
									type: 'error'
								});
							}
						})
						.catch(err => {});
				}
			});
		},

		//忘记密码
		goforget() {
			this.$router.push({
				path: '/forget_password'
			});
		},
		//去注册
		goregister() {
			this.$router.push({
				path: '/registered'
			});
		},
		//验证码登陆
		gophonelog() {
			this.$router.push({
				path: '/'
			});
		},
		//校验电话号
		jiophone(rule, value, callback) {
			if (value === '') {
				callback(new Error('请输入手机号'));
			} else {
				var fsdtel = /^[1]([3-9])[0-9]{9}$/;
				if (fsdtel.test(value) === false) {
					callback(new Error('手机号格式错误'));
				} else {
					callback();
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
	}
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
			width: 369px;
			height: 452px;
			background: #fff;
			padding: 61px 68px 0px 68px;
			position: fixed;
			top: 50%;
			margin-top: -256.5px;
			right: 15%;
		}
	}
}
</style>
