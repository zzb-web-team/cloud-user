<template>
	<div class="myownStyle">
		<el-row class="container">
			<el-col class="header">
				<el-col
					class="logo"
					:class="collapsed ? 'logo-collapse-width' : 'logo-width'"
				>
					<div style="fontSize:20px;color:#ffffff">点播控制台</div>
				</el-col>
				<el-col :span="4">
					<el-radio-group
						v-model="menu_type"
						class="my_radio"
						@change="change_tab('label')"
					>
						<el-radio-button label="管理中心"></el-radio-button>
						<el-radio-button label="数据中心"></el-radio-button>
					</el-radio-group>
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
				<aside :class="collapsed ? 'menu-collapsed' : 'menu-expanded'">
					<!-- <div
						style="color: #333;font-size: 20px;background: #fff;height: 60px;line-height: 60px;position: relative;z-index: 1;"
					>
						点播控制台
					</div> -->
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
						<template v-for="item in menu_list" v-if="!item.hidden">
							<p
								v-if="item.meta && item.meta.title != '概览'"
								class="menu_item_title"
							>
								{{ item.meta.title }}
							</p>
							<el-submenu
								v-if="item.children && item.children.length"
								:index="item.path"
								:key="item.path"
								style="text-align: left;"
							>
								<template slot="title">
									<i :class="item.icon"></i>

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
											<i :class="itemChild.icon"></i>
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
										<el-badge
											:is-dot="false"
											class="item"
											v-show="
												itemChild.name == '刷新预热'
											"
											>{{ itemChild.name }}</el-badge
										>
										<span
											slot="title"
											v-show="
												itemChild.name != '刷新预热'
											"
											>{{ itemChild.name }}</span
										>
									</el-menu-item>
								</template>
							</el-submenu>

							<el-menu-item
								v-else
								:index="item.path"
								:key="item.path"
								class="fist_el_meau"
								:class="item.name == '概览' ? 'fitst_li' : ''"
							>
								<i
									v-if="item.icon"
									:class="item.icon"
									style="margin-right: 10px;margin-left: 5px;"
								></i>
								<span
									slot="title"
									v-if="item.name == '概览'"
									style="font-weight: 600;font-size: 14px;color: #6a6a6c;margin-left: -30px;"
									>概览</span
								>
								<span
									slot="title"
									v-else
									style="margin-left: -16px;"
									>{{ item.name }}</span
								>
							</el-menu-item>
						</template>
						<p class="last_boder"></p>
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
			menu_type: '管理中心',
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
			processing_arr: [],
			page: 0,
			yu_error: '',
			yu_success: '',
			shua_error: '',
			shua_success: '',
			manage_list: [],
			data_list: [],
			menu_list: [],
			fitst_li: 'fitst_li',
		};
	},
	mounted() {
		if (localStorage.getItem('menu_type')) {
			this.menu_type = localStorage.getItem('menu_type');
		}
		let _this = this;
		this.manage_list = this.$router.options.routes.filter(function(elem) {
			if (elem.name == '节点流量统计' && elem.hidden != true) {
				elem.children[0].meta = { title: '数据中心' };
				_this.data_list = _this.data_list.concat(elem.children);
			} else if (elem.name == '播放统计' && elem.hidden != true) {
				_this.data_list = _this.data_list.concat(elem.children);
			}
			if (
				elem.hidden != true &&
				elem.name != '节点流量统计' &&
				elem.name != '播放统计'
			) {
				return elem;
			}
		});
		this.change_tab();
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
	methods: {
		change_tab(label) {
			if (this.menu_type == '管理中心') {
				this.menu_list = this.manage_list;
			} else {
				this.menu_list = this.data_list;
			}
			localStorage.setItem('menu_type', this.menu_type);
			if (label) {
				this.$router.push(this.menu_list[0].path);
			}
		},
		tanchuan() {
			var _this = this;
			setInterval(() => {
				setTimeout(() => {
					if (localStorage.getItem('yure_url_name')) {
						let yure = JSON.parse(
							localStorage.getItem('yure_url_name')
						);
						this.get_yun_statue(this.page, yure);
					} else {
						this.processing_arr = [];
					}
				}, 0);
			}, 10000);
		},
		get_yun_statue(page, url_name) {
			var _this = this;
			let parmas = new Object();
			parmas.url_name = '';
			parmas.buser_id = this.$cookies.get('id');
			parmas.refresh_type = '';
			parmas.state = -1;
			parmas.page = page;
			parmas.order = 1;
			parmas.start_time = url_name[0].creatte_time * 1;
			parmas.end_time = (Date.parse(new Date()) / 1000).toFixed(0) * 1;
			refresh_state(parmas)
				.then((res) => {
					if (res.status == 0) {
						if (page == 0) this.processing_arr = [];
						this.processing_arr = this.processing_arr.concat(
							res.data.result
						);
						let arr = [];
						if (res.data.remaining == 0) {
							this.yu_error = '';
							this.yu_success = '';
							this.shua_error = '';
							this.shua_success = '';
							this.processing_arr.forEach((item, index) => {
								if (item.state == 1) {
									arr.push(item);
									if (item.refresh_type == 1) {
										this.yu_success += item.url_name + ',';
									} else {
										this.shua_success +=
											item.url_name + ',';
									}
								} else if (item.state == 3) {
									arr.push(item);
									if (item.refresh_type == 1) {
										this.yu_error += item.url_name + ',';
									} else {
										this.shua_error += item.url_name + ',';
									}
								}
							});
							if (
								this.yu_success != '' &&
								this.shua_success != ''
							) {
								this.yu_success = this.yu_success.slice(
									0,
									this.yu_success.length - 1
								);
								this.shua_success = this.yu_success.slice(
									0,
									this.shua_success.length - 1
								);
								_this.$notify({
									title: '成功',
									message: `
                                    ${this.yu_success}预热成功</br>
                                    ${this.shua_success}刷新成功
                                    `,
									type: 'success',
								});
								this.yu_success = '';
								this.shua_success = '';
							} else if (
								this.yu_success != '' &&
								this.shua_success == ''
							) {
								this.yu_success = this.yu_success.slice(
									0,
									this.yu_success.length - 1
								);
								_this.$notify({
									title: '成功',
									message: `
                                    ${this.yu_success}预热成功
                                    `,
									type: 'success',
								});
								this.yu_success = '';
							} else if (
								this.yu_success == '' &&
								this.shua_success != ''
							) {
								this.shua_success = this.yu_success.slice(
									0,
									this.shua_success.length - 1
								);
								_this.$notify({
									title: '成功',
									message: `
                                    ${this.shua_success}刷新成功
                                    `,
									type: 'success',
								});
								this.shua_success = '';
							}

							if (this.yu_error != '' && this.shua_error != '') {
								this.yu_error = this.yu_error.slice(
									0,
									this.yu_error.length - 1
								);
								this.shua_error = this.shua_error.slice(
									0,
									this.shua_error.length - 1
								);
								_this.$notify({
									title: '失败',
									message: `
                                     ${this.yu_error}预热失败</br>
                                     ${this.shua_error}刷新失败
                                    `,
									type: 'warning',
								});
								this.yu_error = '';
								this.shua_error = '';
							} else if (
								this.yu_error != '' &&
								this.shua_error == ''
							) {
								this.yu_error = this.yu_error.slice(
									0,
									this.yu_error.length - 1
								);
								_this.$notify({
									title: '失败',
									message: `
                                     ${this.yu_error}预热失败
                                    `,
									type: 'warning',
								});
								this.yu_error = '';
							} else if (
								this.yu_error == '' &&
								this.shua_error != ''
							) {
								this.shua_error = this.shua_error.slice(
									0,
									this.shua_error.length - 1
								);
								_this.$notify({
									title: '失败',
									message: `
                                     ${this.shua_error}刷新失败
                                    `,
									type: 'warning',
								});
								this.shua_error = '';
							}
							if (arr.length > 0) {
								this.testing(arr, url_name);
							}
							return false;
						} else {
							page++;
							this.get_yun_statue(page, url_name);
						}
					}
				})
				.catch((err) => {});
		},
		testing(arr, url_list) {
			arr.forEach((item) => {
				url_list.forEach((xtime, index) => {
					if (xtime.url_name == item.url_name) {
						url_list.splice(index, 1);
					}
				});
			});
			if (url_list.length <= 0) {
				localStorage.removeItem('yure_url_name');
			} else {
				localStorage.setItem('yure_url_name', JSON.stringify(url_list));
			}
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
					localStorage.removeItem('menu_type');
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
			width: 200px;
			height: 60px;
			font-size: 22px;
			padding-left: 20px;
			padding-right: 20px;
			border-color: #eef1924d;
			border-right-width: 1px;
			border-right-style: solid;
			background: #297aff;
			color: #fff;
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
			width: 200px;
			color: #fff;
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
				background: #f5f5f5;
				// box-shadow: 2px 0px 7px 0px rgba(38, 101, 160, 0.08);
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
			flex: 0 0 200px;
			width: 200px;
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
		.menu_item_title {
			display: inline-block;
			width: 100%;
			font-size: 14px;
			font-weight: bold;
			margin: 10px 0;
			padding-top: 15px;
			text-align: left;
			box-sizing: border-box;
			padding-left: 40px;
			position: relative;
			color: #6a6a6c;
			margin-left: -30px;
		}
		.menu_item_title::before {
			content: ''; /*CSS伪类用法*/
			position: absolute; /*定位背景横线的位置*/
			width: 65%; /*宽和高做出来的背景横线*/
			height: 0.5px;
			background: #afafaf;
			top: 0px;
			z-index: 1;
		}
		.menu_item_title:first-child::before {
			content: ''; /*CSS伪类用法*/
			position: absolute; /*定位背景横线的位置*/
			width: 0; /*宽和高做出来的背景横线*/
			height: 0;
			background: #ffffff;
			top: 0;
			z-index: -1;
		}
		.last_boder {
			position: relative;
			&:after {
				content: ''; /*CSS伪类用法*/
				position: absolute; /*定位背景横线的位置*/
				width: 65%; /*宽和高做出来的背景横线*/
				height: 0.5px;
				background: #afafaf;
				top: 10px;
				left: 30px;
				z-index: 1;
			}
		}
	}
}
el-submenu {
	text-align: center;
}
</style>
