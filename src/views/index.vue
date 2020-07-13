<template>
	<div class="myownStyle">
		<el-row class="container">
			<el-col :span="24" class="header">
				<!-- <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
          <div style="fontSize:20px;color:#000">云点播管理平台</div>
        </el-col>-->
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
				<aside :class="collapsed ? 'menu-collapsed' : 'menu-expanded'">
					<div
						style="color: #333;font-size: 20px;background: #fff;height: 60px;line-height: 60px;position: relative;z-index: 1;"
					>
						点播控制台
					</div>
					<el-menu
						:default-active="$route.path"
						class="el-menu-vertical-demo"
						@open="handleopen"
						@close="handleclose"
						@select="handleselect"
						unique-opened
						router
					>
						<!-- 一级菜单 -->
						<template
							v-for="item in $router.options.routes"
							v-if="!item.hidden"
						>
							<el-submenu
								v-if="item.children && item.children.length"
								:index="item.path"
								:key="item.path"
								style="text-align: left;"
							>
								<template slot="title">
									<i
										:class="item.icon"
										style="margin-right: 10px;margin-left: 10px;"
									></i>
									<span>{{ item.name }}</span>
								</template>

								<!-- 二级菜单 -->
								<template
									v-for="itemChild in item.children"
									v-if="!itemChild.hidden"
								>
									<el-submenu
										v-if="
											itemChild.children &&
												itemChild.children.length
										"
										:index="itemChild.path"
										:key="itemChild.path"
									>
										<template slot="title">
											<i
												:class="itemChild.icon"
												style="margin-right: 10px;margin-left: 10px;"
											></i>
											<span>{{ itemChild.name }}</span>
										</template>

										<!-- 三级菜单 -->
										<el-menu-item
											v-for="itemChild_Child in itemChild.children"
											:index="itemChild_Child.path"
											:key="itemChild_Child.path"
											v-if="!itemChild_Child.hidden"
										>
											<i
												:class="itemChild_Child.icon"
												style="margin-right: 10px;margin-left: 10px;"
											></i>
											<span slot="title">{{
												itemChild_Child.name
											}}</span>
										</el-menu-item>
									</el-submenu>

									<el-menu-item
										v-else
										:index="itemChild.path"
										:key="itemChild.path"
									>
										<i :class="itemChild.icon"></i>
										<span slot="title">{{
											itemChild.name
										}}</span>
									</el-menu-item>
								</template>
							</el-submenu>

							<el-menu-item
								v-else
								:index="item.path"
								:key="item.path"
								style="text-align: left;padding-left: 70px;"
								class="fist_el_meau"
								v-bind:class="{
									active: item.bgc == true,
									textdanger: item.bgc == false,
									onle: item.bsgc == true,
								}"
							>
								<i
									v-if="item.icon"
									:class="item.icon"
									style="margin-right: 10px;margin-left: 5px;"
								></i>
								<span slot="title">{{ item.name }}</span>
							</el-menu-item>
						</template>
					</el-menu>
				</aside>
				<section class="content-container">
					<div class="grid-content bg-purple-light">
						<el-col :span="24" class="content-wrapper">
							<transition name="fade" mode="out-in">
								<router-view></router-view>
							</transition>
						</el-col>
					</div>
				</section>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { refresh_state } from '../servers/api';
export default {
	data() {
		return {
			sysName: '云点播',
			collapsed: false,
			sysUserName: '',
			sysUserAvatar: '',
			form: {
				name: '',
				region: '',
				date1: '',
				date2: '',
				delivery: false,
				type: [],
				resource: '',
				desc: '',
            },
            page:0,
		};
	},
	methods: {
		tanchuan() {
			if (localStorage.getItem('yure_url_name')) {
				let _this = this;
                let yure = JSON.parse(localStorage.getItem('yure_url_name'));
                this.get_yun_statue(this.page,yure);
				setInterval(() => {
					_this.$notify({
						title: '成功',
						message: '这是一条成功的提示消息',
						type: 'success',
					});
				}, 60000);
			}
		},
		get_yun_statue(pagr,url_name) {
			let parmas = new Object();
			parmas.url_name = this.input;
			parmas.buser_id = this.$cookies.get('id');
			parmas.refresh_type = '';
			parmas.state = -1;
			parmas.page = 0;
			parmas.order = 1;
			parmas.start_time = url_name[0].creatte_time;
			parmas.end_time = (Date.parse(new Date()) / 1000).toFixed(0);
			refresh_state(parmas)
				.then((res) => {
					if (res.status == 0) {
                        console.log(res.data.result);
                        res.data.result.forEach((item,index)=>{

                        });
					}
				})
				.catch((err) => {});
		},
		handleopen() {
			//console.log('handleopen');
		},
		handleclose() {
			//console.log('handleclose');
		},
		handleselect: function(a, b) {},
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
			this.tanchuan();
		} else {
			this.$router.push({ path: '/' });
		}
	},
};
</script>

<style scoped lang="scss">
// @import "../assets/css/style/newstyle";
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
