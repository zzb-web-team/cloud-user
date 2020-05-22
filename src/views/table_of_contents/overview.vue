<template>
	<div class="content">
		<div class="top_title">概览页</div>
		<!-- 主体内容 -->
		<div class="content_top">
			<div class="content_top_title">
				<span>资源用量</span>
				<span @click="godosage">更多数据</span>
			</div>
			<div class="content_top_con">
				<p>本月使用流量</p>
				<p>
					<span style="font-size: 32px;color: #333333;">{{
						dataL
					}}</span
					>G
				</p>
			</div>
		</div>
		<div class="content_bottom">
			<div class="content_bottom_title">
				<span>资源用量</span>
				<span @click="godosage">更多数据</span>
			</div>
			<div
				style="height: 483px;padding: 43px 54px;background: #ffffff;box-shadow:0px 2px 3px 0px rgba(6,17,36,0.14);"
			>
				<div
					id="myChart3"
					:style="{ height: '397px', fontSize: '16px' }"
				></div>
			</div>
		</div>
	</div>
</template>

<script>
import { dataflow_curve } from '../../servers/api';
import { dateToMs, getymdtime } from '../../servers/sevdate';
import echarts from 'echarts';
export default {
	data() {
		return {
			dataL: 0,
			dataFlowArray: [],
			timeArray: [],
			chanid: '',
		};
	},
	mounted() {
		if (this.$cookies.get('id')) {
			this.chanid = this.$cookies.get('id') * 1;
		} else {
			this.$router.push({ path: '/' });
		}
		this.getlist();
	},
	methods: {
		//请求数据
		getlist() {
			let params = new Object();
			let starttime =
				new Date(new Date().toLocaleDateString()).getTime() / 1000;
			params.start_ts = starttime - 60 * 60 * 24 * 30;
			params.end_ts = starttime;
			params.chanId = this.chanid + '';
			params.fileName = '*';
			params.timeUnit = 60 * 24;
			params.acce = '*';
			dataflow_curve(params)
				.then((res) => {
					if (res.data.totalUsage == 0) {
						this.dataL = 0;
					} else {
						this.dataL = (
							res.data.totalUsage /
							1024 /
							1024 /
							1024
						).toFixed(4);
					}
					this.dataFlowArray = res.data.dataFlowArray;
					res.data.timeArray.forEach((item, index) => {
						this.timeArray.push(getymdtime(item));
					});
					this.configure();
				})
				.catch((err) => {});
		},
		//跳转页面
		godosage() {
			this.$router.push({ path: '/dosage_query' });
		},
		//绘图
		configure() {
			let myChart = echarts.init(document.getElementById('myChart3')); //这里是为了获得容器所在位置
			window.onresize = myChart.resize;
			let options = {
				title: {
					text: '流量趋势',
					itemGap: 10,
					textStyle: {
						//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
						fontSize: 14,
						color: '#666666',
						fontStyle: 'normal',
						fontWeight: '400',
					},
				},
				toolbox: {
					//show: true,
					itemSize: 20,
					itemGap: 30,
					right: 50,
					feature: {
						// mark: { show: true },
						// dataView: { show: true, readOnly: false },
						// magicType: { show: true, type: ['line', 'bar'] },
						// restore: { show: true },
						// saveAsImage: { show: false },
						// mydow: {
						// 	show: true,
						// 	title: '导出',
						// 	icon:'path://M552 586.178l60.268-78.53c13.45-17.526 38.56-20.83 56.085-7.38s20.829 38.56 7.38 56.085l-132 172c-16.012 20.863-47.454 20.863-63.465 0l-132-172c-13.45-17.526-10.146-42.636 7.38-56.085 17.525-13.45 42.635-10.146 56.084 7.38L472 586.177V152c0-22.091 17.909-40 40-40s40 17.909 40 40v434.178zM832 512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 61.856-50.144 112-112 112H224c-61.856 0-112-50.144-112-112V512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 17.673 14.327 32 32 32h576c17.673 0 32-14.327 32-32V512z',
						// 	onclick: function() {
						// 		alert('myToolHandler1');
						// 	},
						// },
					},
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985',
						},
					},
				},
				xAxis: {
					type: 'category',
					data: this.timeArray,
				},
				yAxis: {
					type: 'value',
				},
				series: [
					{
						data: this.dataFlowArray,

						type: 'line',
						symbol: 'none',
						smooth: true,
						itemStyle: {
							normal: {
								color: '#09b0f5',
							},
						},
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(
									0,
									0,
									0,
									1,
									[
										{ offset: 0, color: '#A7D5FF' },
										{ offset: 0.5, color: '#D0E8FF' },
										{ offset: 1, color: '#ffffff' },
									]
								),
							},
						}, //填充区域样式
					},
				],
				backgroundColor: '#FFFFFF',
			};
			myChart.setOption(options);
		},
	},
};
</script>

<style lang="scss" scoped>
.content {
	.content_top {
		padding: 15px 0 25px;
		width: 100%;
		// border: 1px solid #000;
		.content_top_title {
			margin: auto;
			margin-right: 45px;
			margin-left: 45px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 75px;
			span:nth-child(1) {
				color: #202020;
				font-weight: 400;
				font-size: 16px;
			}
			span:nth-child(2) {
				color: #297aff;
				font-weight: 400;
				font-size: 14px;
			}
		}
		.content_top_con {
			height: 116px;
			background: #ffffff;
			margin: auto;
			margin-right: 45px;
			margin-left: 45px;
			box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
			border-radius: 2px;
			text-align: left;
			padding-left: 53px;
			color: #333333;
			p {
				line-height: 65px;
				font-size: 14px;
				color: #333333;
			}
			p:nth-child(2) {
				line-height: 16px;
			}
		}
	}
	.content_bottom {
		margin-top: 70px;
		margin: auto;
		margin-left: 45px;
		margin-right: 45px;
		.content_bottom_title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 75px;
			span:nth-child(1) {
				color: #202020;
				font-weight: 400;
				font-size: 16px;
			}
			span:nth-child(2) {
				color: #297aff;
				font-weight: 400;
				font-size: 14px;
			}
		}
		// padding: 10px;
		p {
			text-align: right;
			color: #1296db;
		}
	}
}
</style>
