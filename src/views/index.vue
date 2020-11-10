<template>
	<div class="myownStyle">
		<el-row class="container">
			<el-col :span="24" class="main">
				<aside>
					<div style="background: #644CF7;height: 60px;line-height: 60px;">
						<span v-show="!isCollapse" style="color: #fff;font-size: 20px;">{{this.type == 'dibble' ? '云点播控制台' : '直播控制台'}}</span>
						<i @click="changeCollapse" style="fontSize:16px;color:#ffffff;" class="iconfont icon-caidanzhankaishousuo"></i>
					</div>
					<el-menu
						:collapse="isCollapse" 
						:collapse-transition="false"
						:default-active="$route.path"
						class="el-menu-vertical-demo"
						@open="handleopen"
						@close="handleclose"
						@select="handleselect"
						unique-opened
						width="200px" 
					>

						<!-- <template
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


										<el-menu-item
											v-for="itemChild_Child in itemChild.children"
											:index="itemChild_Child.path"
											:key="itemChild_Child.path"
											v-if="!itemChild_Child.hidden && itemChild_Child.alias == 'Dibble'"
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
										<el-badge
											:is-dot=false
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
								<el-badge :is-dot=false class="item" v-if="item.path=='/terminal_management'">{{ item.name }}</el-badge>
								<span slot="title" v-else>{{ item.name }}</span>
							</el-menu-item>
						</template> -->
						<el-submenu index="1">
							<template slot="title">
								<i class="iconfont icon-dianbokongzhitai"></i>
								<span style="color: #fff; margin-left: 8px;">概览</span>
							</template>
							<el-menu-item index="1-1" v-if="type=='dibble'">
									<router-link to="/overview" >
										<div class="circle"></div>
										<span style="color: #fff;">概览</span>
									</router-link>
							</el-menu-item>
							<el-menu-item index="1-1" v-if="type=='live'">
									<router-link to="/overview" >
										<div class="circle"></div>
										<span style="color: #fff;">概览</span>
									</router-link>
							</el-menu-item>
						</el-submenu>
						<el-submenu index="2">
							<template slot="title">
								<i class="iconfont icon-peizhiguanli"></i>
								<span style="color: #fff;margin-left: 8px;">加速内容管理</span>
							</template>
							<el-menu-item index="2-1" v-if="type=='dibble'">
								<template slot="title">
									<router-link to="/accelerate_management" >
										<div class="circle"></div>
										<span style="color: #fff;">域名管理</span>
									</router-link>
								</template>
							</el-menu-item>
							<el-menu-item index="2-2" v-if="type=='dibble'">
								<template slot="title">
									<router-link to="/domain_management" >
										<div class="circle"></div>
										<span style="color: #fff;">点播加速管理</span>
									</router-link>
								</template>
							</el-menu-item>
							<el-menu-item index="2-3" v-if="type=='dibble'">
								<template slot="title">
									<router-link to="/yure_management" >
										<div class="circle"></div>
										<span style="color: #fff;">刷新预热</span>
									</router-link>
								</template>
							</el-menu-item>
							<el-menu-item index="2-4" v-if="type=='live'">
								<template slot="title">
									<router-link to="/live_content" >
										<div class="circle"></div>
										<span style="color: #fff;">直播加速内容</span>
									</router-link>
								</template>
							</el-menu-item>
							<el-menu-item index="2-5" v-if="type=='live'">
								<template slot="title">
									<router-link to="/live_info" >
										<div class="circle"></div>
										<span style="color: #fff;">直播流信息</span>
									</router-link>
								</template>
							</el-menu-item>
						</el-submenu>
						<el-submenu index="3">
							<template slot="title">
								<i class="iconfont icon-shujuzhongxin"></i>
								<span style="color: #fff; margin-left: 8px;">数据中心</span>
							</template>
							<el-submenu index="3-1">
								<template slot="title">
									<div class="circle"></div>
									<span style="color: #fff;">节点流量统计</span>
								</template>
								<el-menu-item index="3-1-1" v-if="type=='dibble'">
									<template slot="title">
										<router-link to="/dosage_query" >
											<span style="color: #fff;">节点流量用量</span>
										</router-link>
									</template>
								</el-menu-item>
								<el-menu-item index="3-1-1" v-if="type=='live'">
									<template slot="title">
										<router-link to="/live_dosage_query" >
											<span style="color: #fff;">节点流量用量</span>
										</router-link>
									</template>
								</el-menu-item>
								<el-menu-item index="3-1-2" v-if="type=='dibble'">
									<template slot="title">
										<router-link to="/node_flow" >
											<span style="color: #fff;">节点流量监控</span>
										</router-link>
									</template>
								</el-menu-item>
								<el-menu-item index="3-1-2" v-if="type=='live'">
									<template slot="title">
										<router-link to="/live_node_flow" >
											<span style="color: #fff;">节点流量监控</span>
										</router-link>
									</template>
								</el-menu-item>
							</el-submenu>
							<el-submenu index="3-2">
								<template slot="title">
									<div class="circle"></div>
									<span style="color: #fff;">播放统计</span>
								</template>
								<el-menu-item index="3-2-1" v-if="type=='dibble'">
									<template slot="title">
										<router-link to="/resources" >
											<span style="color: #fff;">播放流量</span>
										</router-link>
									</template>
								</el-menu-item>
								<el-menu-item index="3-2-1" v-if="type=='live'">
									<template slot="title">
										<router-link to="/live_resources" >
											<span style="color: #fff;">播放流量</span>
										</router-link>
									</template>
								</el-menu-item>
								<el-menu-item index="3-2-2" v-if="type=='dibble'">
									<template slot="title">
										<router-link to="/statistics" >
											<span style="color: #fff;">统计分析</span>
										</router-link>
									</template>
								</el-menu-item>
								<el-menu-item index="3-2-2" v-if="type=='live'">
									<template slot="title">
										<router-link to="/live_statistics" >
											<span style="color: #fff;">统计分析</span>
										</router-link>
									</template>
								</el-menu-item>
							</el-submenu>
						</el-submenu>
						<el-submenu index="4">
							<template slot="title">
								<i class="iconfont icon-zhongduanguanli"></i>
								<span style="color: #fff; margin-left: 8px;">终端管理</span>
							</template>
							<el-menu-item index="4-1">
								<template slot="title">
									<router-link to="/terminal_management" >
									<div class="circle"></div>
										<span style="color: #fff;">终端管理</span>
									</router-link>
								</template>
							</el-menu-item>
						</el-submenu>
					</el-menu>
				</aside>
				<section class="content-container">
					<div class="header">
						<div>
							<span style="fontSize:18px;color:#333;font-weight: bold;margin-left:80px;cursor:pointer;" @click="gotoIndex">总览</span>					
							<span style="fontSize:22px;color:#333;margin-left:64px;">{{this.type == 'dibble' ? '点播加速' : '直播加速'}}</span>
						</div>
						<div :span="4" class="userinfo">
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
						</div>
					</div>
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
			type: 'dibble',
			isCollapse: false,
			sysUserName: '',
			processing_arr: [],
			page: 0,
			yu_error: '',
			yu_success: '',
			shua_error: '',
			shua_success: '',
		};
	},
	created () {
		this.type = localStorage.getItem('type');
	},
	mounted() {
		this.type = localStorage.getItem('type');
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
		changeCollapse() {
			this.isCollapse = !this.isCollapse;
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
                            console.log(this.processing_arr);
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
                                this.yu_success='';
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
                                this.shua_success='';
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
                                this.yu_error='';
                                this.shua_error='';
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
                                this.yu_error='';
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
                                this.shua_error='';
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
		//返回总览
		gotoIndex() {
			this.$router.push({ path: '/view' });
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
		}
	},
};
</script>

<style scoped lang="scss">
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
		color: #333;
		background: #fff;
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
				color: #333;
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
		display: flex;
		// background: #324057;
		position: absolute;
		top: 0px;
		bottom: 0px;
		overflow: hidden;
		aside {
			// flex: 0 0 230px;
			// width: 230px;
			.el-menu-vertical-demo:not(.el-menu--collapse){
				width: 230px;
			}
			.circle {
				display:inline-block;
				width:4px;
				height:4px;
				background:#fff;
				border-radius:50%;
				margin-left: 10px;
			}
		}
		.content-container {
			flex: 1;
			overflow-y: scroll;
			.content-wrapper {
				box-sizing: border-box;
				width: 100%;
				height: 100%;
			}
		}
	}
}
// .active {
// 	background: #297aff;
// 	pointer-events: none;
// }
// .textdanger {
// 	background: #ffffff;
// 	color: #333333;
// 	pointer-events: none; //不可点击
// 	text-align: left;
// 	height: 64px;
// 	line-height: 64px;
// 	span {
// 		font-size: 18px;
// 	}
// }
// .onle {
// 	span {
// 		font-size: 18px;
// 	}
// }
</style>
