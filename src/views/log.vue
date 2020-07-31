<template>
	<div class="Login">
		<el-form
			:model="ruleForm2"
			:rules="rules2"
			ref="ruleForm2"
			label-position="left"
			label-width="0px"
			class="demo-ruleForm login-container"
		>
			<div class="title" style="font-weight: 600;">登录</div>
			<div style="border: 1px solid #E6E6E6;">
				<el-form-item
					prop="account"
					style="display:flex; margin-bottom: 0;"
					class="log_input"
				>
					<img
						src="../assets/img/user.png"
						alt
						style="width: 44px;height: 44px;display: inline-block; vertical-align: middle;"
					/>
					<el-input
						type="text"
						v-model="ruleForm2.account"
						auto-complete="off"
						placeholder="请输入账号"
						style="font-size: 16px;display: flex;align-items: center;"
						class="login-form-input"
					></el-input>
				</el-form-item>
			</div>
			<div style="border: 1px solid #E6E6E6;margin-top: 21px;">
				<el-form-item
					prop="checkPass"
					style="display:flex; margin-bottom: 0;"
					class="log_input"
				>
					<img
						src="../assets/img/pwd.png"
						alt
						style="width: 44px;height: 44px;display: inline-block; vertical-align: middle;"
					/>
					<el-input
						type="password"
						v-model="ruleForm2.checkPass"
						auto-complete="off"
						placeholder="请输入密码"
						style="font-size: 16px;display: flex;align-items: center;"
						class="login-form-input"
						@keyup.enter.native="handleSubmit2"
					></el-input>
				</el-form-item>
			</div>
			<div
				style="display: flex;justify-content: space-between;align-items: center;color: #999999;font-size: 16px;margin-top: 23px;"
			>
				<span @click="goforget()">忘记密码？</span>
				<span @click="goregister()">注册</span>
			</div>
			<!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
			<el-form-item style="width:100%;">
				<el-button
					round
					style="width: 361px;margin-top: 50px;height: 61.5px;border-radius: 35px;font-size:19px;font-weight:bold;box-shadow:0px 3px 8px 0px rgba(34,100,207,0.38);background:#297AFF;color:#FFF;"
					size="medium"
					@click.native.prevent="handleSubmit2"
					:loading="logining"
					>立即登录</el-button
				>
			</el-form-item>
			<div
				style="display: flex;justify-content: space-evenly;align-items: center;color:#297AFF;font-size:16px;"
			>
				<span @click="gophonelog()">手机验证登录</span>
			</div>
		</el-form>
	</div>
</template>

<script>
import { login } from '../servers/api';
//import NProgress from 'nprogress'
export default {
	data() {
		var validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入账号'));
			} else {
				if (value.replace(/\s*/g, '') == '') {
					callback(new Error('请输入账号'));
				} else {
					callback();
				}
			}
		};
		return {
			logining: false,
			ruleForm2: {
				account: '',
				checkPass: '',
			},
			rules2: {
				account: [
					{
						required: true,
						validator: validatePass,
						trigger: 'blur',
					},
					//{ validator: validaePass }
				],
				checkPass: [
					{
						required: true,
						message: '请输入密码',
						trigger: 'blur',
					},
					//{ validator: validaePass2 }
				],
			},
			checked: true,
		};
	},
	mounted() {
		if (this.$cookies.get('id')) {
			this.$router.push({
				path: '/overview',
			});
		}
	},
	methods: {
		//忘记密码
		goforget() {
			this.$router.push({
				path: '/forget_password',
			});
		},
		//去注册
		goregister() {
			this.$router.push({
				path: '/registered',
			});
		},
		//验证码登录
		gophonelog() {
			this.$router.push({
				path: '/phone_log',
			});
		},
		//重置
		handleReset2() {
			this.$refs.ruleForm2.resetFields();
		},
		//登录
		handleSubmit2(ev) {
			var _this = this;
			this.$refs.ruleForm2.validate((valid) => {
				if (valid) {
					this.logining = true;
					var loginParams = {
						username: this.ruleForm2.account.replace(/\s*/g, ''),
						password: this.ruleForm2.checkPass.replace(/\s*/g, ''),
					};
					// this.$router.push({
					//   path: "/user"
					// });
					login(loginParams).then((data) => {
						this.logining = false;

						if (data.status !== 0) {
							this.$message({
								message: data.msg,
								type: 'error',
							});
						} else {
							sessionStorage.setItem(
								'id',
								JSON.stringify(data.msg.id)
							);
							sessionStorage.setItem(
								'user',
								JSON.stringify(data.msg.username)
							);
							sessionStorage.setItem(
								'token',
								JSON.stringify(data.token)
							);
							this.$cookies.set(
								'user',
								data.msg.username,
								7 * 24 * 60 * 60
							);
							this.$cookies.set(
								'id',
								data.msg.id,
								7 * 24 * 60 * 60
							);
							this.$cookies.set(
								'token',
								data.token,
								7 * 24 * 60 * 60
							);
							this.$router.push({
								path: '/overview',
							});
						}
					});
				} else {
					return false;
				}
			});
		},
	},
};
</script>

<style lang="scss">
.Login {
	background: url(../assets/img/login.png);
	background-size: 100% 100%;
	width: 100%;
	height: 100%;
	.el-form {
		.el-form-item {
			.el-form-item__content {
				width: 100%;
			}
		}
	}
}

.login-container {
	/*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
	background-clip: padding-box;
	margin: auto;
	padding: 61px 65px 0px 72px;
	background: #fff;
	border: 1px solid #eaeaea;
	// box-shadow: 0 0 25px #cac6c6;
	position: fixed;
	top: 50%;
	margin-top: -256.5px;
	right: 15%;
	width: 365px;
	height: 450px;

	.title {
		width: 394px;
		text-align: left;
		height: 92px;
		font-size: 34px;
		font-family: Alibaba PuHuiTi;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}

	.remember {
		margin: 0px 0px 35px 0px;
	}
}
</style>
