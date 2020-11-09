<template>
<div>
  <section class="content">
    <div class="top_title">节点流量用量</div>
    <div class="content-main">
        <div class="seach">
        <el-input
            v-model="valueRoomId"
            placeholder="请输入直播间ID"
            style="width:10%;margin-right: 10px;"
            @keyup.enter.native="onChanges"
        >
            <i slot="prefix" class="el-input__icon el-icon-search" @click="onChanges()"></i>
        </el-input>
        <el-input
            v-model="valueStreamName"
            placeholder="请输入直播流名称"
            style="width:10%;margin-right: 10px;"
            @keyup.enter.native="onChanges"
        >
            <i slot="prefix" class="el-input__icon el-icon-search" @click="onChanges()"></i>
        </el-input>
        <el-select
            v-model="valueIpfsChannel"
            placeholder="全部节点渠道"
            style="width: 10%;margin-right: 10px;"
            @change="onChanges"
        >
            <el-option label="全部" value="*"></el-option>
            <el-option
            v-for="(item, index) in hashidSets"
            :key="index"
            :label="item.label"
            :value="item.value"
            ></el-option>
        </el-select>
        <SelectTime ref="selectTime" @selectTime="selectTime" :type="'daterange'" />
        </div>
        <div class="device_table" style="display: flex; flex-direction: row; align-items: flex-start; justify-content: space-between; flex-wrap: wrap;">
            <div class="user_item" style="margin-right: 100px;">
                <div class="item_left" style="margin-right: 30px;">
                    <div class="item_text" style="text-align:center;">总流量</div>
                    <div class="item_count" style="text-align:center;">
                        <span>{{ totalYl | setbytes }}</span>
                    </div>
                </div>
                <img src="../../assets/img/pic.png" /> 
            </div>
            <div style="flex: 1; min-width: 400px;">
                <el-row type="flex" class="row_active">
                <el-col :span="23">
                    <el-table
                    :data="tablecdn"
                    border
                    style="width: 100%; max-height: 530px; overflow-y: auto;"
                    :cell-style="rowClass"
                    :header-cell-style="headClass"
                    >
                    <el-table-column label="总流量">
                        <template slot-scope="scope">
                        <div>{{ scope.row.dataFlow | setbytes }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="时间" prop="time" :formatter="timeFormatter"></el-table-column>
                    </el-table>
                    <fenye
                    style="float:right;margin:10px 0 0 0;"
                    @handleCurrentChange="handleCurrentChange"
                    @handleSizeChange="handleSizeChange"
                    :pagesa="total_cnt"
                    :currentPage="pageNo"
                    ></fenye>
                </el-col>
                </el-row>
            </div>
        </div>
    </div>
  </section>
  <div class="device_form">
    <div id="myChart" :style="{ height: '507px' }"></div>
  </div>
</div>
</template>

<script>
import { dateToMs, getymdtime, getymdtime1, splitTimes, formatBytes, formatBkb} from "../../servers/sevdate";
import fenye from "@/components/fenye";
import SelectTime from "@/components/SelectTime";
import {
  manage_dataflow_curve,
  manage_dataflow_table,
  export_manage_dataflow_table_file,
  get_nodetype_enum,
  live_manage_dataflow_curve,
  live_manage_dataflow_table,
  export_live_manage_dataflow_table_file
} from "../../servers/api";
import echarts from "echarts";
import common from "../../comm/js/util";
import _ from "lodash";

export default {
  data() {
    return {
      search: "",
      valueDomain: "",
      valueIpfsChannel: "",
      valueRoomId: "",
      valueStreamName: "",
      duibi: false,
      hashidSets: [],
      chanid: [],
      optionssearch: [],
      valueContent: "",
      tablecdn: [],
      activeName: "first",
      timeUnit: 120,
      starttime: "",
      endtime: "",
      dataFlowArray: [], //图1
      timeArray: [], //图1
      pageSize: 10, //每页数量
      pageNo: 1, //当前页码
      total_cnt: 1, //数据总量
      pageActive: 0,
      pageActive1: 0,
      flowunit: "",
      totalYl: 0,
    };
  },
  filters: {
    settimes(data) {
      var stat = getymdtime(data);
      return stat;
    },
    setbytes(data) {
      return common.formatByteActive(data);
    },
  },
  components: { fenye, SelectTime },
  mounted() {
    if (this.$cookies.get('id')) {
        this.chanid = this.chanid.concat(this.$cookies.get('id'));
    } else {
        this.$router.push({ path: '/' });
    }
    this.getNodeType();
    this.starttime = new Date(new Date().toLocaleDateString()).getTime() / 1000;
    this.endtime = Date.parse(new Date()) / 1000;
    this.liveDataFlowCurve()
  },
  filters: {
    settimes(data) {
      var stat = getymdtime(data);
      return stat;
    },
    setbytes(data) {
      return common.formatByteActive(data);
    },
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
    this.drawLine();
    this.drawLine1();
  },
  methods: {
    selectTime(val){
      this.starttime = val.starttime;
      this.endtime = val.endtime;
      this.tablecdn = [];
      this.totalYl = 0;
      this.liveDataFlowCurve();
    },
    //  统计时间段
    timeFormatter(row, column){
      if(this.timeUnit == 120){
        let startTime = row.time * 1000;
        let endTime = (row.time + 2*60*60 -1) * 1000
        return this.common.getTimes(startTime) + '-' + this.common.getTimes(endTime)
      }else{
        return this.common.getTimess(row.time * 1000)
      }
    },
    //获取页码
    handleCurrentChange(pages) {
        this.pageNo = pages;
        this.liveDataFlowCurve()
    },
    //获取每页数量
    handleSizeChange(pagetol) {
      this.pageSize = pagetol;
    },
    //设置时间粒度
		settimeunit(sratime, endtime) {
			if (endtime - sratime <= 86400) {
				this.timeUnit = 120;
			} else if (86400 < endtime - sratime) {
				this.timeUnit = 1440;
			}
		},
    onChanges(){
        this.pageNo = 1;
        this.liveDataFlowCurve()
    },
    //图表导出
    exoprtant_Yl() {
      this.dataFlowArray = [];
      this.timeArray = [];
      let params = new Object();
      params.startTs = this.starttime;
      params.endTs = this.endtime;
      params.channelId = this.chanid;
      if (this.valueContent) {
        params.urlName = this.valueContent;
      } else {
        params.urlName = "*";
      }
      if (this.valueDomain !== "") {
        params.domain = this.valueDomain;
      } else {
        params.domain = "*";
      }
      if (this.valueIpfsChannel != "") {
        params.ipfsChannel = this.valueIpfsChannel;
      } else {
        params.ipfsChannel = "*";
      }
      params.timeUnit = this.common.timeUnitActive(
        this.starttime,
        this.endtime
      );
      (params.pageNo = 0),
        (params.pageSize = 10),
        export_manage_dataflow_table_file(params)
          .then((res) => {
            if (res.status == 0) {
              window.open(res.msg, "_blank");
            }
          })
          .catch((err) => {});
    },
    //获取节点渠道
    getNodeType(){
      let param = {}
      get_nodetype_enum(param).then(
        (res) => {
          let data = res.data.firstchan;
          let list = data.map((item)=>{
            let obj = {};
            obj.label = item.name;
            obj.value = item.value;
            return obj
          })
          this.hashidSets = list;
        })
        .catch((err)=>{
          console.log(err)
        })
    },
    //直播节点流量用量图
    liveDataFlowCurve() {
      this.dataFlowArray = [];
      this.timeArray = [];
      let params = new Object();
      params.startTs = this.starttime;
      params.endTs = this.endtime;
      params.channelId = this.chanid;
      if (this.valueRoomId !== "") {
        params.roomId = this.valueRoomId;
      } else {
        params.roomId = "*";
      }
      if (this.valueStreamName !== "") {
        params.streamName = this.valueStreamName;
      } else {
        params.streamName = "*";
      }
      if (this.valueIpfsChannel != "") {
        params.ipfsChannel = this.valueIpfsChannel;
      } else {
        params.ipfsChannel = "*";
      }
      params.timeUnit = this.common.timeUnitActive(
        this.starttime,
        this.endtime
      );
      this.timeUnit = this.common.timeUnitActive(
        this.starttime,
        this.endtime
      );
      live_manage_dataflow_curve(params)
        .then((res) => {
          if (res.status == 0) {
						if (res.data.total == 0) {
							this.totalYl = 0;
							this.allunitdata = 'B';
						} else {
							this.allunitdata = formatBytes(
								res.data.total
							);
							this.totalYl = formatBkb(
								res.data.total,
								this.allunitdata
							);
						}
						if (res.data.data[0].dataflowArray.length == 0) {
							this.unitdata = 'B';
						} else {
							let maxnum = _.max(res.data.data[0].dataflowArray);
							this.unitdata = formatBytes(maxnum);
						}
						if(res.data.data[0].dataflowArray.length == 0){
							let arr = splitTimes(this.starttime, this.endtime, this.timeUnit);							
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
						this.drawLine();
					} else {
						this.$message.error(res.msg);
					}
        })
        .catch((err) => {
          console.log(err);
        });

      params.pageNo = this.pageNo - 1;
      params.pageSize = this.pageSize;
      live_manage_dataflow_table(params)
        .then((res) => {
          if (res.status == 0) {
            this.tablecdn = res.data.list;
            this.total_cnt = res.data.totalCnt;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 表头样式设置
    headClass() {
      return "text-align: center; background: #FDFBFB; font-weight: 500; color: #333";
    },
    // 表格样式设置
    rowClass() {
      return "text-align: center;";
    },
    drawLine() {
			var _this = this;
			// 基于准备好的dom，初始化echarts实例
			let myChart = this.$echarts.init(
				document.getElementById('myChart')
			);
			window.onresize = myChart.resize;
			// 绘制图表
			let options = {
				title: {
					text: '流量',
				},
				toolbox: {
					//show: true,
					itemSize: 20,
					itemGap: 30,
					right: 50,
					feature: {
						mydow: {
							show: true,
							title: '导出',
							icon:
								'path://M552 586.178l60.268-78.53c13.45-17.526 38.56-20.83 56.085-7.38s20.829 38.56 7.38 56.085l-132 172c-16.012 20.863-47.454 20.863-63.465 0l-132-172c-13.45-17.526-10.146-42.636 7.38-56.085 17.525-13.45 42.635-10.146 56.084 7.38L472 586.177V152c0-22.091 17.909-40 40-40s40 17.909 40 40v434.178zM832 512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 61.856-50.144 112-112 112H224c-61.856 0-112-50.144-112-112V512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 17.673 14.327 32 32 32h576c17.673 0 32-14.327 32-32V512z',
							onclick: function() {
								_this.exportant_dataflow();
							},
						},
					},
				},
				grid: {
					// 间距是 根据x、y轴计算的；假如都是0，x、y轴的label汉字就隐藏掉了。
					left: '5%', // 默认10%，给24就挺合适的。
					top: 60, // 默认60
					right: 35, // 默认10%
					bottom: 60, // 默认60
				},
				color: '#297AFF',
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
						label: {
							backgroundColor: '#6a7985',
						},
						shadowStyle: {
							color: 'rgba(150,150,150,0.3)', // 阴影颜色
						},
					},
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
					data: this.timeArray,
					axisTick: {
						show: false,
					},
				},
				yAxis: {
					name: _this.unitdata,
				},
				series: [
					{
						name: '流量',
						type: 'bar',
						// barWidth: 30, //柱图宽度
						barMaxWidth: 30,
						data: this.dataFlowArray,
						smooth: true, //设置折线图的弧度
						itemStyle: {
							normal: {
								lineStyle: {
									color: '#297AFF', //线的颜色
								},
							},
							color: '#00FF00',
						},
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(
									0,
									0,
									0,
									1,
									[
										{ offset: 0, color: '#409EFF' },

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
.el-table /deep/.disabledCheck .cell .el-checkbox__inner {
  display: none !important;
}
.el-table /deep/.disabledCheck .cell:before {
  content: "";
  position: absolute;
  right: 11px;
}

.user_item {
  background: #FDFBFB;
  width: 500px;
  height: 300px;
  border-radius: 32px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  padding: 36px 71px;

  .item_left {
    width: 49%;
    height: 58px;
    .item_text {
      font-size: 14px;
      color: #333333;
    }
    .item_count {
      line-height: 55px;
      span {
        font-size: 34px;
      }
    }
  }
  .item_right {
    height: 48px;
    width: 49%;
    padding-left: 40px;
    .item_text {
      font-size: 14px;
      color: #333333;
    }
    .item_count {
      line-height: 55px;
      span {
        font-size: 34px;
      }
    }
  }
}
</style>
