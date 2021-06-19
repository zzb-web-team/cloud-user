<template>
	<div class="commodity_con" ref="box_rHeight">
		<div class="top_title">概览 > 流量包商城</div>
		<ol>
			<li v-for="(item, index) in list" :key="index">
				<div class="item_title">
					<h4>{{ item.name }}</h4>
					<p>{{ item.second_name }}</p>
				</div>
				<div class="item_con">
					<h5 v-if="item.text_title">{{ item.text_title }}</h5>
					<p>{{ item.remake }}</p>
					<p>
						{{ item.text }}
					</p>
					<p v-if="item.money" class="money">￥{{ item.money }}</p>
				</div>
				<div class="item_btn">
					<div v-if="item.name == '新用户超值体验包'">
						<el-button
							type="primary"
							size="mini"
							style="width:70%;"
							@click="go_pay_money(item, 1)"
							>确认申请</el-button
						>
						<!-- <el-button size="mini">取消</el-button> -->
					</div>
					<el-button
						v-if="item.name == '流量包'"
						type="primary"
						size="mini"
						style="width:70%;"
						@click="go_pay_money(item, 2)"
						>立即购买</el-button
					>
					<el-button
						v-if="item.name == '按量计费包'"
						@click="go_pay_money(item, 3)"
						type="primary"
						size="mini"
						style="width:70%;"
						>立即开通</el-button
					>
				</div>
			</li>
		</ol>
	</div>
</template>

<script>
import { query_pktproduct, create_pktorder } from '../../servers/api';
export default {
	data() {
		return {
			clientHeight: '',
			user_id: JSON.parse(sessionStorage.getItem('id')),
			pay_id: '',
			list: [],
		};
	},
	watch: {
		clientHeight() {
			//如果clientHeight 发生改变，这个函数就会运行
			this.changeFixed(this.clientHeight);
		},
	},
	created() {},
	mounted() {
		let that = this;
		that.clientHeight = `${document.documentElement.clientHeight ||
			document.documentElement.offsetHeight}`; //获取浏览器可视区域高度
		window.onresize = function() {
			that.clientHeight = `${document.documentElement.clientHeight ||
				document.documentElement.offsetHeight}`;
		};
		this.get_data_list();
	},
	methods: {
		go_pay_money(row, type) {
			if (type == 1) {
				//创建订单
				let params = {
					user_id: this.user_id,
					product_id: this.pay_id,
					num: 1,
				};
				create_pktorder(params)
					.then((res) => {
						if (res.status == 0) {
							this.$router.push({
								path: '/pre_payment',
								query: { data: JSON.stringify(res.data) },
							});
						} else if (res.status == -7 && res.err_code == 458) {
							this.$message({
								message: '库存不足，购买失败',
								type: 'warning',
							});
						}
					})
					.catch((error) => {});
			} else if (type == 2) {
				this.$router.push({
					path: '/commodity_detil',
					query: { data: JSON.stringify(row) },
				});
			} else if (type == 3) {
				this.$router.push({
					path: '/pay_dosage',
				});
			}
		},
		get_data_list() {
			let params = {
				page: 0,
				product_name: '新用户超值体验包',
				// start_time: parseInt(this.search_time[0] / 1000), //创建开始时间 单位:秒
				// end_time: parseInt(this.search_time[1] / 1000),
			};
			query_pktproduct(params)
				.then((res) => {
					if (res.status == 0) {
						this.list = [
							{
								name: '新用户超值体验包',
								second_name:
									'入门级小额体验包，低成本快速体验点播服务',
								remake:
									'新用户限时限量申请点播加速试用，付款成功后，您可以免费享有以下服务：',
								text_title: '',
								text:
									'1、点播免费试用：24小时。2、点播流量：10GB。3、免费技术支持。4、开通后不退换。5、每位新用户仅可使用一次',
							},
							{
								name: '流量包',
								second_name: '冰点价来袭，随时随地畅所加速',
								text_title: '点播流量包',
								remake:
									'约10,000同时观看码率为500kbps的视频5小时 ',
								text:
									'1、赠一年短视频lincese精简版使用权。2、不限用户类型，每个用户限购10个。3、灵活流量包种类、流量，按需多选均可',
							},
							{
								name: '按量计费包',
								second_name:
									'按量计费，不浪费一丝一毫性价比之王',
								remake:
									'新用户限时限量申请点播加速试用，付款成功后，您可以免费享有以下服务：',
								text:
									'1、点播免费试用：24小时。2、点播流量：10GB。3、免费技术支持。',
							},
						];
						this.pay_id = res.data.data[0].product_id;
						this.list[0].money =
							res.data.data[0].price * res.data.data[0].discount;
					}
					console.log(this.list[0]);
				})
				.catch((error) => {});
		},
		//查询屏幕高度自适应
		changeFixed(data) {
			if (this.$refs.box_rHeight) {
				this.$refs.box_rHeight.style.height = data - 140 + 'px';
				this.$refs.box_rHeight.style.minHeight = 850 + 'px';
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.commodity_con {
	// width: 100%;
	background-color: #fff;
	text-align: left;
	box-sizing: border-box;
	padding: 36px;
	padding-top: 10px;
	margin: 36px;
	box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
	position: relative;
	.top_title {
		font-size: 14px;
	}
	ol {
		position: absolute;
		left: 50%;
		top: 50%;
		z-index: 0;
		transform: translate(-50%, -50%);
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		li {
			height: 660px;
			width: 30%;
			max-width: 360px;
			margin-right: 30px;
			box-shadow: 0px 10px 20px 0px rgba(51, 51, 51, 0.1);
			border-radius: 10px;
			position: relative;
			.item_title {
				background: #f7f9fc;
				box-sizing: border-box;
				padding: 36px;
				text-align: center;
				h4 {
					margin-bottom: 20px;
					font-size: 18px;
				}
				p {
					font-size: 14px;
					color: #464d51;
				}
			}
			.item_con {
				box-sizing: border-box;
				padding: 36px;
				text-align: left;
				h5 {
					margin-bottom: 10px;
				}
				p {
					margin-bottom: 10px;
				}
				.money {
					text-align: center;
					color: #ee9415;
					font-size: 18px;
				}
			}
			.item_btn {
				width: 100%;
				box-sizing: border-box;
				padding: 20px 36px;
				margin: auto;
				text-align: center;
				position: absolute;
				bottom: 36px;
				div {
					text-align: center;
				}
			}
		}
		li:last-child {
			margin-right: 0;
		}
	}
}
</style>
