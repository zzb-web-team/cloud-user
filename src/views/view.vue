<template>
	<div class="myownStyle">
		<el-row class="container">
			<el-col :span="24" class="header">
				<el-col :span="8">
          			<span style="fontSize:18px;color:#fff">总览</span>
					<el-dropdown trigger="hover" style="margin-left: 15px;">
						<span style="fontSize:22px;color:#fff">
							产品
						</span>
						<el-dropdown-menu slot="dropdown">
							<!-- <el-dropdown-item>我的消息</el-dropdown-item> -->
							<el-dropdown-item @click.native="dibble"><span style="fontSize:18px;color:#000">点播加速</span></el-dropdown-item>
							<el-dropdown-item divided @click.native="live"><span style="fontSize:18px;color:#000">直播加速</span></el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
        		</el-col>
				<el-col :span="4" class="userinfo">
					<el-dropdown trigger="hover">
						<span class="el-dropdown-link userinfo-inner">
							<img src="../assets/download.jpg" />
							{{ sysUserName }}
						</span>
						<el-dropdown-menu slot="dropdown">
							<!-- <el-dropdown-item>我的消息</el-dropdown-item> -->
							<el-dropdown-item @click.native="goinfo"
								>账号信息</el-dropdown-item
							>
							<el-dropdown-item divided @click.native="logout"
								>退出登录</el-dropdown-item
							>
						</el-dropdown-menu>
					</el-dropdown>
				</el-col>
			</el-col>

			<el-col :span="24" class="main">
				
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
            this.$router.push({path: '/overview'});
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
		//折叠导航栏
		collapse: function() {
			this.collapsed = !this.collapsed;
		},
		showMenu(i, status) {
			this.$refs.menuCollapsed.getElementsByClassName(
				'submenu-hook-' + i
			)[0].style.display = status ? 'block' : 'none';
		},
	},
};
</script>

<style scoped lang="scss">
// @import "../assets/css/style/newstyle";
.item {
	line-height: 12px;
}
.container {
	position: absolute;
	top: 0px;
	bottom: 0px;
	left: 0;
	right: 0;
	width: 100%;
	margin: 0 auto;
	.header {
		height: 60px;
		line-height: 60px;
		//	background: $color-primary;
		color: #000;
		background: #297aff;
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
		.logo {
			//width:230px;
			height: 60px;
			font-size: 22px;
			padding-left: 20px;
			padding-right: 20px;
			border-color: #eef1924d;
			border-right-width: 1px;
			border-right-style: solid;
			background: #ffffff;
			img {
				width: auto;
				float: left;
				margin: 10px 10px 10px 18px;
			}
			.txt {
				color: #fff;
			}
		}
		.logo-width {
			width: 230px;
		}
		.logo-collapse-width {
			width: 60px;
		}
		.tools {
			padding: 0px 23px;
			width: 14px;
			height: 60px;
			line-height: 60px;
			cursor: pointer;
		}
	}
	.main {
		display: flex;
		// background: #324057;
		position: absolute;
		top: 60px;
		bottom: 0px;
		overflow: hidden;
		aside {
			flex: 0 0 230px;
			width: 230px;
			// position: absolute;
			// top: 0px;
			// bottom: 0px;
			.el-menu {
				height: 100%;
				text-align: center;
				box-shadow: 2px 0px 7px 0px rgba(38, 101, 160, 0.08);
			}
			.collapsed {
				width: 60px;
				.item {
					position: relative;
				}
				.submenu {
					position: absolute;
					top: 0px;
					left: 60px;
					z-index: 99999;
					height: auto;
					display: none;
				}
			}
		}
		.menu-collapsed {
			flex: 0 0 60px;
			width: 60px;
		}
		.menu-expanded {
			flex: 0 0 280px;
			width: 280px;
			//margin-top: -60px;
		}
		.content-container {
			// background: #f1f2f7;
			flex: 1;
			// position: absolute;
			// right: 0px;
			// top: 0px;
			// bottom: 0px;
			// left: 230px;
			overflow-y: scroll;
			// padding: 20px;
			.breadcrumb-container {
				//margin-bottom: 15px;
				float: none !important;
				.title {
					width: 200px;
					float: left;
					color: #ffffff;
					text-align: left;
					font-size: 22px;
				}
				.breadcrumb-inner {
					float: right;
				}
			}
			.content-wrapper {
				// background-color: #272731;
				box-sizing: border-box;
				width: 100%;
				height: 100%;
				// color: #ffffff;
			}
		}
	}
}
.active {
	background: #297aff;
	pointer-events: none;
}
.textdanger {
	background: #ffffff;
	color: #333333;
	pointer-events: none; //不可点击
	text-align: left;
	height: 64px;
	line-height: 64px;
	span {
		font-size: 18px;
	}
}
.onle {
	span {
		font-size: 18px;
	}
}

el-submenu {
	text-align: center;
}
</style>
