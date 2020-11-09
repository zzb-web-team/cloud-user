<template>
  <div>
    <section class="content">
      <div class="top_title">统计分析</div>
      <div class="content-main">
        <el-tabs v-model="activeName" @tab-click="handleClick">
        <div class="seach">
            <el-input v-model="valueRoomId" placeholder="请输入直播间ID" style="width:160px;margin-right: 10px;" @change="onChanges">
            <i slot="prefix" class="el-input__icon el-icon-search" @click="onChanges()"></i>
            </el-input>
            <el-input v-model="valueStreamName" placeholder="请输入直播流名称" style="width:160px;margin-right: 10px;" @change="onChanges">
            <i slot="prefix" class="el-input__icon el-icon-search" @click="onChanges()"></i>
            </el-input>
            <el-select v-model="terminalName" placeholder="全部终端类型" style="width: 10%;margin-right: 10px;" @change="onChanges">
            <el-option label="全部终端" value="-1"></el-option>
            <el-option v-for="(item, index) in hashidSets" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <SelectTime ref="selectTime" @selectTime="selectTime" :type="'daterange'" />
        </div>
        <el-tab-pane label="PV/UV" name="first">
            <div class="user_item">
            <div class="item_left">
                <div class="item_text">总访问次数(PV)</div>
                <div class="item_count">
                <span>{{ totalPV }}</span>
                </div>
            </div>
            <div class="item_right">
                <div class="item_text">{{'独立IP数'}}</div>
                <div class="item_count">
                <span>{{ totalUV }}</span>
                </div>
            </div>
            <div class="item_right">
                <div class="item_text">并发连接数峰值</div>
                <div class="item_count">
                <span>{{ maxConnect }}</span>
                </div>
            </div>
            </div>
            <div style="margin-top: 40px;">
            <div id="myChart" :style="{ height: '607px' }"></div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="访问用户分布" name="second">
            <div class="device_table">
            <el-row type="flex" class="row_active">
                <el-col :span="24" style="text-align:left; font-weight: bold; margin-bottom:10px;">{{exportTitle}}</el-col>
            </el-row>
            <el-row type="flex" class="row_active">
                <el-col :span="24">
                <el-table :data="tableData" border stripe max-height="530" style="width: 100%;" :cell-style="rowClass" :header-cell-style="headClass">
                    <el-table-column :label="exportTitleTable">
                    <template slot-scope="scope">
                        <div v-if="scope.row.region">
                        {{ scope.row.region }}
                        </div>
                        <div v-else>{{ scope.row.isp }}</div>
                    </template>
                    </el-table-column>
                    <el-table-column label="访问用户总数">
                    <template slot-scope="scope">
                        <div style="display: flex;justify-content: center;">
                        <div>{{ scope.row.sumCnt }}</div>
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column label="有效访问用户数（%）">
                    <template slot-scope="scope">
                        <div style="display: flex;justify-content: center;">
                        <div>{{ scope.row.validCnt }}</div>
                        <div>({{ scope.row.validPercent | percentss }})</div>
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column label="无效访问用户数（%）">
                    <template slot-scope="scope">
                        <div style="display: flex;justify-content: center;">
                        <div>{{ scope.row.invalidCnt }}</div>
                        <div>({{ scope.row.invalidPercent | percentss }})</div>
                        </div>
                    </template>
                    </el-table-column>
                </el-table>
                <fenye style="float:right;margin:10px 0 0 0;" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" :currentPage="pageNo" :pagesa="total_cnt"></fenye>
                </el-col>
            </el-row>
            </div>
        </el-tab-pane>
        </el-tabs>
      </div>
    </section>
    <div class="device_form" v-show="activeName=='second'">
      <el-radio-group
        v-model="radios"
        size="medium"
        @change="select()"
        style="display: flex;justify-content: center;"
      >
        <el-radio-button label="1">地区</el-radio-button >
        <el-radio-button label="2">运营商</el-radio-button >
      </el-radio-group>
      <div id="myChart1" :style="{ height: '607px' }"></div>
    </div>
  </div>
</template>

<script>
import { dateToMs, getymdtime, splitTimes } from "../../servers/sevdate";
import fenye from "@/components/fenye";
import SelectTime from "@/components/SelectTime";
import {
  pv_uv_curve,
  query_topregion_accesscnt_curve,
  query_topisp_accesscnt_curve,
  export_pv_uv_curve_file,
  export_topregion_accesscnt_curve_file,
  export_topisp_accesscnt_curve_file,
  query_live_topisp_accesscnt_curve,
  query_live_topregion_accesscnt_curve,
  live_visit_statistic,
} from "../../servers/api";
import echarts from "echarts";
import common from "../../comm/js/util";

export default {
  data() {
    return {
      hashidSets: [
        {
          value: "1",
          label: "iOS",
        },
        {
          value: "0",
          label: "android",
        },
        {
          value: "2",
          label: "其他",
        },
      ],
      exportTitle: "用户访问分布",
      exportTitleTable: "省市",
      pageNo: 1,
      pageSize: 10,
      total_cnt: 0,
      valueUrlName: "",
      terminalName: "",
      valueChannelId: "",
      valueDomain: "",
      valueChannelId: "",
      valueRoomId: "",
      valueStreamName: "",
      tableData: [],
      activeName: "first",
      totalPV: 0,
      totalUV: 0,
      maxConnect: 0,
      starttime: "",
      endtime: "",
      timeUnit: 60,
      uvArray: [], //图一y1
      pvArray: [], //图一y2
      timeArray: [], //图一x
      playTimesArray1: [], //图二y
      timeArray1: [], //图二x
      radios: 1,
    };
  },
  filters: {
    setthtim(data) {
      var stat = getymdtime(data);
      return stat;
    },
    aaa(data) {
      var liu = (data / 1024 / 1024 / 1024).toFixed(4);
      return liu;
    },
    formatDataFlow(data) {
      if (data == 0) {
        return 0;
      } else {
        return common.formatByteActive(data);
      }
    },
    formatPercent(data) {
      if (data == 0) {
        return 0;
      } else {
        return (data * 100).toFixed(6);
      }
    },
    formatAvgTime(data) {
      if (data == 0) {
        return 0;
      } else {
        return data;
      }
    },
    percentss(data) {
      if (data == 0) {
        return 0 + "%";
      }
      return (data * 100).toFixed(2) + "%";
    },
  },
  components: {
    fenye, SelectTime
  },
  mounted() {
    this.starttime = new Date(new Date().toLocaleDateString()).getTime() / 1000;
    this.endtime = Date.parse(new Date()) / 1000;
    this.livePuVuCurve();
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
    //时间选择
    selectTime(val){
      this.starttime = val.starttime;
      this.endtime = val.endtime;
      this.pageNo = 1;
      this.reset();
      this.changes();
    },
    changes(){
        if(this.activeName == 'first'){
          this.livePuVuCurve();
        }else{
          if(this.radios == 1){
            this.liveTopregionCurve();
          }else{
            this.liveTopispCurve()
          }
        }
    },
    //用户用户供应商导出
    exoprtant_topisp() {
      let params = this.getParams();
      export_topisp_accesscnt_curve_file(params)
        .then(res => {
          if (res.status == 0) {
            window.open(res.msg, "_blank");
          }
        })
        .catch(err => {});
    },
    //访问用户地区导出
    exoprtant_topregion() {
      let params = this.getParams();
      export_topregion_accesscnt_curve_file(params)
        .then(res => {
          if (res.status == 0) {
            window.open(res.msg, "_blank");
          }
        })
        .catch(err => {});
    },
    //PV/UV导出
    exoprtant_pupv() {
      let params = this.getParams();
      export_pv_uv_curve_file(params)
        .then(res => {
          if (res.status == 0) {
            window.open(res.msg, "_blank");
          }
        })
        .catch(err => {});
    },
    //
    onChanges() { 
      this.changes();
    },
    //获取页码
    handleCurrentChange(pages) {
      this.pageNo = pages;
    },
    //获取每页数量
    handleSizeChange(pagetol) {
      this.pageSize = pagetol;
      // this.getuserlist();
    },
    //重置参数
    reset(){
      this.valueChannelId = "";
      this.valueUrlName = "";
      this.valueRoomId = "";
      this.valueStreamName = "";
      this.valueTerminalName = "";
      this.valueDomain = "";
      this.totalPV = 0,
      this.totalUV = 0,
      this.pageNo = 1;
      this.tableData = [];
      this.total_cnt = 0;
      this.uvArray = [];
      this.pvArray = [];
      this.timeArray = [];
      this.playTimesArray1 = [];
      this.timeArray1 = [];
    },
    //地区运营商选择
    select(){
      if (this.radios == 1) {
        this.exportTitle = "用户访问分布";
        this.exportTitleTable = "省市";
        this.liveTopregionCurve();
      }else{
        this.exportTitle = "用户运营商分布";
        this.exportTitleTable = "运营商";
        this.liveTopispCurve();
      }
    },
    //参数处理
    getParams(){
      let params = new Object();
      params.startTs = this.starttime;
      params.endTs = this.endtime;
      params.isp = "*";
      params.region = "*";
      params.roomId = this.valueRoomId ? this.valueRoomId : '*';
      params.streamName = this.valueStreamName ? this.valueStreamName : '*';
      params.chanId = this.valueChannelId ? this.valueChannelId : '*';
      params.terminalName = this.valueTerminalName ? parseInt(this.valueTerminalName) : -1;
      params.timeUnit = this.common.timeUnitActive2(
        this.starttime,
        this.endtime
      );
      return params;
    },
    //请求数据--曲线图
    livePuVuCurve(){
      let params = this.getParams();
        live_visit_statistic(params)
          .then(res => {
            this.totalPV = res.data.data.totalPV;
            this.totalUV = res.data.data.totalUV;
            this.maxConnect = res.data.data.maxConnect;
            if(res.data.data.uvArray.length == 0 && res.data.data.pvArray.length == 0){
              let arr = splitTimes(this.starttime, this.endtime, 60);
              arr.forEach((item, index) => {
                this.timeArray.push(getymdtime(item));
              });
              this.uvArray = _.fill(Array(arr.length), 0);
              this.pvArray = _.fill(Array(arr.length), 0);
            }else{
              if (res.data.data.uvArray) {
                res.data.data.uvArray.forEach((item, index) => {
                  this.uvArray.push(Math.floor(item));
                });
              }
              if (res.data.data.pvArray) {
                res.data.data.pvArray.forEach((item, index) => {
                  this.pvArray.push(Math.floor(item));
                });
              }
              res.data.data.timeArray.forEach((item, index) => {
                this.timeArray.push(getymdtime(item));
              });
            }
            this.drawLine();
          })
          .catch(err => {});
    },
    liveTopregionCurve(){
      let params = this.getParams();
      params.pageNo = this.pageNo - 1;
      params.pageSize = this.pageSize;
      params.top = 10;
      query_live_topregion_accesscnt_curve(params)
        .then(res => {
          this.playTimesArray1 = res.data.data.accessCntArray;
          this.timeArray1 = res.data.data.regionArray;
          this.drawLine1(this.playTimesArray1, this.timeArray1);
          this.tableData = res.data.data.accessCntTable;
          console.log(this.tableData)
          this.total_cnt = res.data.data.totalCnt;
        })
        .catch(err => {
          console.log(err);
        });
    },
    liveTopispCurve(){
      let params = this.getParams();
      params.pageNo = this.pageNo - 1;
      params.pageSize = this.pageSize;
      params.top = 10;
      query_live_topisp_accesscnt_curve(params)
        .then(res => {
          this.playTimesArray1 = res.data.data.accessCntArray;
          this.timeArray1 = res.data.data.ispArray;
          this.drawLine1(this.playTimesArray1, this.timeArray1);
          this.tableData = res.data.data.accessCntTable;
          this.total_cnt = res.data.data.totalCnt;
        })
        .catch(err => {
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
    //选项卡
    handleClick(tab, event) {
      this.reset();
      this.$refs.selectTime.resetTimes();
      this.starttime = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.endtime = Date.parse(new Date()) / 1000;
      if (tab.index == 0) {
        this.livePuVuCurve();
      } else if (tab.index == 1) {
        this.liveTopregionCurve();
      }
    },
    destroyed: function() {
      this.drawLine();
      this.drawLine1();
    },
    drawLine() {
      let _this = this;
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      window.onresize = myChart.resize;
      // 绘制图表
      let options = {
        title: {
          text: "PV/UV",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        toolbox: {
          feature: {
            // mark: { show: true },
            // dataView: { show: true, readOnly: false },
            // magicType: { show: true, type: ['line', 'bar'] },
            // restore: { show: true },
            // saveAsImage: { show: false },
            mydow: {
              show: true,
              title: "导出",
              icon:
                "path://M552 586.178l60.268-78.53c13.45-17.526 38.56-20.83 56.085-7.38s20.829 38.56 7.38 56.085l-132 172c-16.012 20.863-47.454 20.863-63.465 0l-132-172c-13.45-17.526-10.146-42.636 7.38-56.085 17.525-13.45 42.635-10.146 56.084 7.38L472 586.177V152c0-22.091 17.909-40 40-40s40 17.909 40 40v434.178zM832 512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 61.856-50.144 112-112 112H224c-61.856 0-112-50.144-112-112V512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 17.673 14.327 32 32 32h576c17.673 0 32-14.327 32-32V512z",
              onclick: function() {
                _this.exoprtant_pupv();
              },
            },
          },
        },
        legend: {
          left: "left",
          data: ["pv", "uv"],
        },
        color: ["#A7D5FF", "#BEA7FF"],
        xAxis: {
          type: "category",
          name: "日期",
          splitLine: {
            show: false,
          },
          data: this.timeArray,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        yAxis: {
          type: "value",
          name: "pv/uv",
          min: 0,
        },
        series: [
          {
            name: "pv",
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#A7D5FF",
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#A7D5FF",
                  },
                  {
                    offset: 0.5,
                    color: "#D0E8FF",
                  },
                  {
                    offset: 1,
                    color: "#ffffff",
                  },
                ]),
              },
            }, //填充区域样式
            data: this.pvArray,
          },
          {
            name: "uv",
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#BEA7FF",
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#BEA7FF",
                  },
                  {
                    offset: 0.5,
                    color: "#D2D0FF",
                  },
                  {
                    offset: 1,
                    color: "#ffffff",
                  },
                ]),
              },
            }, //填充区域样式
            data: this.uvArray,
          },
        ],
      };
      myChart.setOption(options);
    },
    drawLine1(a, b) {
      let _this = this;
      let myChart = this.$echarts.init(document.getElementById("myChart1"));
      window.onresize = myChart.resize;
      // 绘制图表
      let options = {
        title: {
          text: "访问用户数(TOP10)",
        },
        grid: {
          // 间距是 根据x、y轴计算的；假如都是0，x、y轴的label汉字就隐藏掉了。
          left: "3%", // 默认10%，给24就挺合适的。
          top: 60, // 默认60
          right: 35, // 默认10%
          bottom: 60, // 默认60
        },
        toolbox: {
          //show: true,
          itemSize: 20,
          itemGap: 30,
          right: 50,
          feature: {
            mydow: {
              show: true,
              title: "导出",
              icon:
                "path://M552 586.178l60.268-78.53c13.45-17.526 38.56-20.83 56.085-7.38s20.829 38.56 7.38 56.085l-132 172c-16.012 20.863-47.454 20.863-63.465 0l-132-172c-13.45-17.526-10.146-42.636 7.38-56.085 17.525-13.45 42.635-10.146 56.084 7.38L472 586.177V152c0-22.091 17.909-40 40-40s40 17.909 40 40v434.178zM832 512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 61.856-50.144 112-112 112H224c-61.856 0-112-50.144-112-112V512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 17.673 14.327 32 32 32h576c17.673 0 32-14.327 32-32V512z",
              onclick: function() {
                if (_this.radios == 1) {
                  _this.exoprtant_topregion();
                } else {
                  _this.exoprtant_topisp();
                }
              },
            },
          },
        },
        color: "#297AFF",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        xAxis: {
          data: b,
        },
        yAxis: {},
        series: [
          {
            name: "次数",
            type: "bar",
            barWidth: 30, //柱图宽度
            data: a,
          },
        ],
      };
      myChart.setOption(options);
    },
  },
};
</script>

<style lang="scss" scoped>
.user_item {
  width: auto;
  height: auto;
  background: #FDFBFB;
  border-radius: 32px;
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 36px 71px;
  .item_left {
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
