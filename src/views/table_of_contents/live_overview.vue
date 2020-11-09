<template>
	<div class="content">
		<div class="top_title">概览</div>
		<!-- 主体内容 -->
		<div class="content_top">
			<div class="itemStyle">
				<p class="titleStyle" style="background: #0DD2E1;">加速内容数量</p>
				<p class="contentStyle">100</p>
			</div>
			<div class="itemStyle" >
				<p class="titleStyle" style="background: #3F7AF2;">观众数</p>
				<p class="contentStyle">
                    58623
					<span style="font-size: 16px;color: #333;">(实时)</span>
				</p>
                <p class="detailStyle">今日累计在线观众：96983236人</p>
			</div>
            <div class="itemStyle" >
                <p class="titleStyle" style="background: #1BE1B2;">今日统计节点流量</p>
				<p class="contentStyle">
                    236.25
					<span style="font-size: 16px;color: #333;">(GB)</span>
				</p>
			</div>
            <div class="itemStyle" >
				<p class="titleStyle" style="background: #3F7AF2;">在线流数</p>
				<p class="contentStyle">
                    60
					<span style="font-size: 16px;color: #333;">(实时)</span>
				</p>
                <p class="detailStyle">今日累计在线流数：185</p>
			</div>
		</div>
		<div class="content_middle">
			<div class="content_middle_title">
				<p style="font-size: 18px; color: #333;">近一周节点流量趋势</p>
				<p style="font-size: 16px; color: #999;">更多数据 ></p>
			</div>
            <div id="myChart" :style="{ height: '450px', width: '100%' }"></div>
		</div>
        <div class="bottomTitle">访问IP数分布</div>
        <div class="content_bottom">
			<div class="itemsStyle">
                <p class="titlesStyle">今日观众端IP分布</p>
                <div id="myChart1" :style="{ height: '450px', width: '100%' }"></div>
            </div>
            <div class="itemsStyle">
                <p class="titlesStyle">今日观众端运营商网络分布</p>
                <div id="myChart2" :style="{ height: '450px', width: '100%' }"></div>
            </div>
		</div>
	</div>
</template>

<script>
var _this;
import {} from '../../servers/api';
import {

} from '../../servers/sevdate';
import echarts from 'echarts';
export default {
	data() {
		return {

		};
	},
	mounted() {
        this.drawLine();
        this.drawLine1();
        this.drawLine2();
	},
	methods: {
		drawLine(){
            let myChart = this.$echarts.init(
				document.getElementById('myChart')
			);
            window.onresize = myChart.resize;
            let options =  {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                legend: {
                    data: ['节点流量用量'],
                    left: 'center'
                },
                xAxis: {
                    type: 'category',
                    splitLine: {
                        show: false
                    },
                    boundaryGap: false,
                    data: ['2020-11-01', '2020-11-02', '2020-11-03', '2020-11-04', '2020-11-05', '2020-11-06', '2020-11-07']
                },
                yAxis: {
                    name: '流量(GB)',
                    type: 'value',
                },
                series: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    smooth: 0.6,
                    symbol: 'none',
                    lineStyle: {
                        color: '#644CF7',
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 1,
                            x2: 0,
                            y2: 0,
                            colorStops: [{
                                offset: 0, color: '#fefefe' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#E6E4F8' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                        //'rgba(37, 24, 114, 0.5)'
                    }
                }]
            };
            myChart.setOption(options)
        },
        drawLine1(){
            let myChart = this.$echarts.init(
				document.getElementById('myChart2')
            );
            let options = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'horizontal',
                    left: 'left',
                    bottom: 'bottom',
                    data: ['中国移动', '中国电信', '中国联通', '鹏博士', '广电网', '长城宽带', '天威宽带', '方正网络', '重庆广电', '其他']
                },
                series: [
                    {
                        name: '占比',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: false,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 20, name: '中国移动'},
                            {value: 40, name: '中国电信'},
                            {value: 10, name: '中国联通'},
                            {value: 5, name: '鹏博士'},
                            {value: 10, name: '广电网'},
                            {value: 5, name: '长城宽带'},
                            {value: 3, name: '天威宽带'},
                            {value: 3, name: '方正网络'},
                            {value: 3, name: '重庆广电'},
                            {value: 1, name: '其他'},
                        ],
                    }
                ]
            };
            window.onresize = myChart.resize;
            myChart.setOption(options)
        },
        drawLine2() {
            // let data = [];
            // let curveList = this.locationCurveList.sort((a,b)=>{return this.radioPlayFlow == 1 ? b.p2p_flow - a.p2p_flow : b.cdn_flow - a.cdn_flow})
            // curveList.forEach(v=>{
            //     let obj = {};
            //     obj.name = v.region;
            //     obj.value = this.radioPlayFlow == 1 ? v.p2p_flow : v.cdn_flow;
            //     data.push(obj)
            // })
            let myChart = this.$echarts.init(document.getElementById("myChart1"));
            window.onresize = myChart.resize;
            console.log(this.locationMax);
            let options =  {
                tooltip: {
                    // formatter:function(params,ticket, callback){
                    //     let value = params.value ? common.formatByteActive(params.value) : 0;
                    //     return params.name+'<br />'+params.seriesName+'：'+ value;
                    // }
                },
                visualMap: {
                    min: 0,
                    max: 1024*1024*500,
                    left: 'left',
                    top: 'bottom',
                    text: ['高','低'],
                    inRange: {
                        color: ['#C4B7FE', '#644CF7']
                    },
                    show:true
                },
                geo: {
                    map: 'china',
                    roam: false,
                    zoom:1.23,
                    label: {
                        normal: {
                            show: true,
                            fontSize:'10',
                            color: 'rgba(0,0,0,0.7)'
                        }
                    },
                    itemStyle: {
                        normal:{
                            borderColor: 'rgba(0, 0, 0, 0.2)'
                        },
                        emphasis:{
                            areaColor: '#F3B329',
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 20,
                            borderWidth: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },
                series : [
                    {
                        name: '播放流量',
                        type: 'map',
                        geoIndex: 0,
                        data: [{
                            "name": "北京",
                            "value": 599
                        }, {
                            "name": "上海",
                            "value": 142
                        }, {
                            "name": "黑龙江",
                            "value": 44
                        }, {
                            "name": "深圳",
                            "value": 92
                        }, {
                            "name": "湖北",
                            "value": 810
                        }, {
                            "name": "四川",
                            "value": 453
                        }]
                    }
                ]
            };
            myChart.setOption(options);
        },
	},
};
</script>

<style lang="scss" scoped>
.content {
	.content_top {
		margin: 48px 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
		.itemStyle{
            width: 24%;
            height: 240px;
            background: #fff;
            border-radius: 12px;
            padding: 32px;
            overflow: hidden;
            // justify-content: flex-start;
            .titleStyle{
                width: 100%;
                height: 72px;
                text-align: left;
                padding-left: 31px;
                border-radius: 12px;
                line-height: 72px;
                color: #fff;
            }
            .contentStyle{
                text-align: left;
                padding-left: 31px;
                margin-top: 32px;
                font-size: 34px;
                font-weight: bold;
                color: #333;
            }
            .detailStyle{
                text-align: left;
                padding-left: 31px;
                margin-top: 15px;
                font-size: 16px;
                color: #999;
            }
        }
    }
    .content_middle {
        width: 100%;
        height: 672px;
        background: #fff;
        border-radius: 32px;
        padding: 63px 73px;
        .content_middle_title{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
    }
    .bottomTitle{
        margin: 48px 0;
        color: #333;
        font-size: 18px;
        text-align: left;
    }
    .content_bottom{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 48px;
        .itemsStyle{
            width: 49%;
            height: 615px;
            background: #fff;
            border-radius: 32px;
            padding: 64px 72px;
            .titlesStyle{
                text-align: left;
                font-size: 18px;
                color: 18px;
                font-weight: 400;
            }
        }
    }
}
</style>
