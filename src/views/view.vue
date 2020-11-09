<template>
	<div class="myownStyle">
		<el-row class="container">
			<el-col :span="24" class="header">
				<div>
          			<span style="fontSize:24px; color:#fff; margin-left: 80px;">总览</span>
					<el-dropdown trigger="hover" style="margin-left: 103px; cursor: pointer">
						<span style="fontSize:16px;color:#fff">产品
							<i class="el-icon-caret-bottom"></i>
						</span>
						<el-dropdown-menu slot="dropdown" style="margin: -8px 0 0 10px;">
							<el-dropdown-item @click.native="dibble"><span style="fontSize:16px; color:#000">点播加速</span></el-dropdown-item>
							<el-dropdown-item divided @click.native="live"><span style="fontSize:16px; color:#000">直播加速</span></el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
        		</div>
				<div class="userinfo">
					<el-dropdown trigger="hover">
						<span class="el-dropdown-link userinfo-inner">
							<img src="../assets/download.jpg" />
							{{ sysUserName }}
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="goinfo">账号信息</el-dropdown-item>
							<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</el-col>
			<el-col :span="24" class="main">
				<div class="wrapper">
					<div class="topItem">
						<div class="imgStyle">
							<img src="../assets/download.jpg" />
						</div>
						<div class="infoStyle">
							<p>{{sysUserName}}</p>
							<p style="cursor: pointer;" @click="goinfo">
								更多
								<img src="../assets/img/jiantou.png" alt="">
							</p>
						</div>
						<div class="descStyle">
							<p><img width="24" height="22" style="margin-right: 8px;" src="../assets/img/youxiang.png" alt="">  安全邮箱</p>
							<p><img width="20" height="24" style="margin-right: 8px; margin-left: 80px;" src="../assets/img/shouji.png" alt="">  安全手机</p>
						</div>
					</div>
					<p class="title">产品服务</p>
					<div class="bottomItem">
						<div class="itemStyle">
							<img src="../assets/img/dibble.png" alt="">
							<p>点播加速</p>
							<button @click="dibble">立即使用</button>
						</div>
						<div class="itemStyle">
							<img src="../assets/img/live.png" alt="">
							<p>直播加速</p>
							<button @click="live">立即使用</button>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
export default {
	data() {
		return {
			sysName: '云点播',
			sysUserName: '',
		};
	},
	mounted() {
		if (this.$cookies.get('user')) {
			var user = this.$cookies.get('user');
			sessionStorage.setItem(
				'id',
				JSON.stringify(this.$cookies.get('id'))
			);
			sessionStorage.setItem(
				'user',
				JSON.stringify(this.$cookies.get('user'))
			);
		}
		if (user) {
			// user = JSON.parse(user);
			this.sysUserName = user || '';
		} else {
			this.$router.push({ path: '/' });
		}
	},
	methods: {
		handleopen() {
			//console.log('handleopen');
		},
		handleclose() {
			//console.log('handleclose');
		},
        handleselect: function(a, b) {},
        dibble() {
            localStorage.setItem('type', 'dibble');
            this.$router.push({path: '/overview'});
            this.$forceUpdate()
        },
        live() {
            localStorage.setItem('type', 'live');
            this.$router.push({path: '/live_overview'});
        },
		//跳转个人信息
		goinfo() {
			this.$router.push({ path: '/information' });
		},
		//退出登录
		logout: function() {
			var _this = this;
			this.$confirm('确认退出吗?', '提示', {
				type: 'warning',
			})
				.then(() => {
					sessionStorage.removeItem('user');
					sessionStorage.removeItem('id');
					sessionStorage.removeItem('token');
					_this.$cookies.set('user', '', 0);
					_this.$cookies.set('id', '', 0);
					_this.$cookies.set('token', '', 0);
					_this.$router.push('/');
				})
				.catch(() => {});
		},
	},
};
</script>

<style scoped lang="scss" scoped>
.container {
	position: absolute;
	top: 0px;
	bottom: 0px;
	left: 0;
	right: 0;
	width: 100%;
	margin: 0 auto;
	background: #F9F9F9;
	.header {
		position: absolute;
		height: 60px;
		line-height: 60px;
		color: #000;
		background: #644CF7;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		.userinfo {
			text-align: right;
			padding-right: 35px;
			float: right;
			.userinfo-inner {
				cursor: pointer;
				color: #fff;
				img {
					width: 40px;
					height: 40px;
					border-radius: 20px;
					margin: 10px 0px 10px 10px;
					float: right;
				}
			}
		}
	}
	.main {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #F9F9F9;
		.wrapper{
			.topItem{
				position: relative; 
				width: 804px;
				height: 160px;
				border-radius: 32px;
				background: #fff;
				box-shadow: 0px 8px 16px 0px rgba(51, 51, 51, 0.06);
				.imgStyle{
					position: absolute; 
					top: -10px;
					left: -10px;
					img{
						width: 112px; 
						height: 112px;
						border-radius: 112px;
					}
				}
				.infoStyle{
					display: flex;
					justify-content: space-between;
					padding: 40px 48px 40px 154px;
				}
				.descStyle{
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					padding: 0px 0px 0px 154px;
					p{
						color: #666;
						font-size: 16px;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
					}
				}
			}
			.title{
				width: 100%;
				text-align: left;
				font-size: 18px;
				color: #333;
				font-weight: 500;
				margin: 100px 0 35px;
			}
			.bottomItem{
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				.itemStyle{
					width: 48.5%;
					height: 350px;
					background: #fff;
					border-radius: 32px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					box-shadow: 0px 8px 16px 0px rgba(51, 51, 51, 0.06);
					img{
						width: 110px;
						height: 110px;
					}
					button{
						width: 144px;
						height: 56px;
						background: #F6F4FF;
						color: #644CF7;
						border: 1px solid #644CF7;
						outline: none;
						border-radius: 28px;
						margin-top: 47px;
						cursor: pointer;
					}
				}
			}
		}
	}
}
</style>
