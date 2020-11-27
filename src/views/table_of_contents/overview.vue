<template>
	<div class="content">
		<div class="content_top">
			<div>
				<p style="color:#333;font-size: 18px;text-align: left;">资源用量</p>
				<p style="color:#333;font-size: 16px;margin-top: 27px;text-align: left;">本月使用流量<span style="font-size: 32px;color: #333;font-weight:bold;margin-left: 38px;">{{dataL}}</span>{{ unitdata }}</p>
			</div>
			<img width="278px" height="254px" src="../../assets/img/pic1.png" alt="" @click="godosage">
		</div>
		<div class="content_bottom">
			<div class="content_bottom_title">
				<span>用量趋势</span>
				<span @click="godosage" class="astyle">更多数据 ></span>
			</div>
			<div id="myChart3" :style="{ height: '450px', width: 'auto', fontSize: '16px' }"></div>
		</div>
	</div>
</template>

<script>
var _this;
import { dataflow_curve,manage_dataflow_curve, } from '../../servers/api';
import {
	dateToMs,
	getymdtime,
	getlocaltimesformatBytes,
	formatBkb,
	getlocaltimes,
	formatBytes,
	splitTimes,
	getymdtime1
} from '../../servers/sevdate';
import echarts from 'echarts';
export default {
	data() {
		return {
			dataL: 0,
			dataFlowArray: [],
			timeArray: [],
			chanid: '',
			unitdata: 'B',
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
		// 本月第一天
		getCurrentMonthFirst() {
			var date = new Date();
			date.setDate(1);
			return (
				new Date(new Date(date).toLocaleDateString()).getTime() / 1000
			);
		},
		//请求数据
		getlist() {
			// let params = new Object();
			let starttime = this.getCurrentMonthFirst();
			let endtime = Date.parse(new Date()) / 1000;
			// params.start_ts = starttime;
			// params.end_ts = endtime;
			// params.chanId = this.chanid + '';
			// params.fileName = '*';
			// params.timeUnit = 1440;
            // params.acce = '*';
            

            let arr=[];
           	arr.push(this.chanid + '');
            let params = new Object();
			params.startTs = starttime;
            params.endTs = endtime;
            params.channelId = arr;
			params.urlName = '*';
			params.domain = '*';
			params.timeUnit = 1440;
			params.terminalName = -1;
			params.pageNo = 0;
			params.pageSize = 10;
			manage_dataflow_curve(params)
				.then((res) => {
					if (res.status == 0) {
						if (res.data.total == 0) {
							this.dataL = 0;
							this.unitdata = 'B';
						} else {
							this.unitdata = formatBytes(res.data.total);
							this.dataL = formatBkb(
								res.data.total,
								this.unitdata
							);
						}
						if(res.data.data[0].dataflowArray.length == 0){
							let arr = splitTimes(starttime, endtime, 1440);	
							console.log(arr)						
							arr.forEach((item, index) => {
								this.timeArray.push(getymdtime1(item));
							});
							this.dataFlowArray = _.fill(Array(arr.length), 0);
						}else{
							res.data.data[0].dataflowArray.forEach((item, index) => {
								this.dataFlowArray.push(
									formatBkb(item, this.unitdata)
								);
							});
							this.dataFlownum = res.data.data[0].dataflowArray.length - 1;
							res.data.data[0].timeArray.forEach((item, index) => {
								this.timeArray.push(getymdtime1(item));
							});
						}
						// res.data.data[0].dataflowArray.forEach((item) => {
						// 	this.dataFlowArray.push(
						// 		formatBkb(item, this.unitdata)
						// 	);
						// });
						// res.data.data[0].timeArray.forEach((item, index) => {
						// 	this.timeArray.push(getlocaltimes(item));
						// });

						this.configure();
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {});
		},
		//跳转页面
		godosage() {
			this.$router.push({ path: '/dosage_query' });
		},
		//绘图
		configure() {
			var _this = this;
			let myChart = echarts.init(document.getElementById('myChart3')); //这里是为了获得容器所在位置
			window.onresize = myChart.resize;
			let options = {
				title: {
					text: '流量趋势',
					// itemGap: 10,
					textStyle: {
						//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
						fontSize: 16,
						color: '#333',
						fontStyle: 'normal',
						fontWeight: '400',
					},
				},
				
 				grid:{
					top:"50px",
					left:"50px",
					right:"15px",
					bottom:"50px"
                },
				toolbox: {
					itemSize: 20,
					itemGap: 30,
					right: 50,
				},
				tooltip: {
					trigger: 'axis',
					formatter: function(params) {
						return (
							params[0].name +
							'<br>' +
							params[0].seriesName +
							':' +
							params[0].data +
							_this.unitdata
						);
					},
				},
				xAxis: {
					type: 'category',
					data: this.timeArray,
				},
				yAxis: {
					
					type: 'value',
					// name: _this.unitdata,
				},
				series: [
					{
						name: '流量',
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
		margin-top: 72px;
		padding: 71px;
		width: 100%;
		background: #fff;
		border-radius: 32px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		position: relative;
		img{
			position: absolute;
			right:71px;
			bottom: 18px;
		}
	}
	.content_bottom {
		margin-top: 72px;
		padding: 71px;
		width: 100%;
		background: #fff;
		border-radius: 32px;
		.content_bottom_title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 40px;
			span:nth-child(1) {
				color: #333;
				font-weight: 400;
				font-size: 18px;
			}
			span:nth-child(2) {
				color: #999;
				font-weight: 400;
				font-size: 16px;
			}
		}
	}
	.astyle:hover {
		cursor: pointer;
	}
}
</style>
