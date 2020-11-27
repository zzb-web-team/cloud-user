<template>
  <div>
    <section class="myself-container content">
      <div class="content-main" style="margin-top: 48px;">
        <div class="top_title">
          节点流量监控
          <div class="wrapperStyle">
            <div
              class="itemStyle"
              :class="{ isSelected: type == 0 }"
              @click="handleClick(0)"
            >
              节点流量
            </div>
            <div
              class="itemStyle"
              :class="{ isSelected: type == 1 }"
              @click="handleClick(1)"
            >
              TOP加速内容
            </div>
          </div>
        </div>
        <div class="seach">
          <el-input
            placeholder="请输入域名"
            v-model="valueDomain"
            class="input-with-select"
            maxlength="70"
            @keyup.enter.native="getdata"
            style="width:10%;margin-right:10px;"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" @click="getdata()"></i>
          </el-input>
          <el-input
            placeholder="请输入加速内容名称"
            v-model="valueContent"
            class="input-with-select"
            maxlength="70"
            @keyup.enter.native="getdata"
            style="width:10%;margin-right:10px;"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" @click="getdata()"></i>
          </el-input>
          <el-select
            v-show="activeName == 'first'"
            v-model="valueChanel"
            placeholder="节点渠道"
            style="width: 10%;margin-right: 10px;"
            @change="getdata()"
          >
            <el-option label="全部" value="*"></el-option>
            <el-option
              v-for="(item, index) in hashidSets"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <SelectTime v-show="type == 0" ref="selectTime" @selectTime="selectTime" :type="'datetimerange'" />
          <el-date-picker v-show="type == 1" style="margin-left:10px;" v-model="val3" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="left" @change="gettimes"></el-date-picker>
        </div>
        <div v-show="type==0">
          <div id="myChart1" :style="{ height: '600px' }"></div>
        </div>
        <div v-show="type==1" class="device_table">
          <div style="text-align: left;">
            <el-radio-group v-model="radio_top" @change="topClick">
              <el-radio-button label="1">TOP加速次数排行</el-radio-button>
              <el-radio-button label="2">TOP加速流量排行</el-radio-button>
            </el-radio-group>
          </div>
          <div class="operating">
            <el-button type="primary" style="margin-left: auto;" @click="toExportExcel">导出</el-button>
          </div>
          <el-row type="flex" class="row_active" v-show="radio_top == 1">
            <el-col :span="24">
              <el-table
                :data="tablecdn"
                border
                max-height="600"
                style="width: 100%;"
                :cell-style="rowClass"
                :header-cell-style="headClass"
              >
                <el-table-column label="加速内容名称" prop="urlname"></el-table-column>
                <el-table-column label="域名" prop="domain"></el-table-column>
                <el-table-column label="加速次数" prop="accelCnt"></el-table-column>
                <el-table-column label="加速次数占比">
                  <template slot-scope="scope">
                    <div>{{scope.row.accelCntpercent | percentss}}</div>
                  </template>
                </el-table-column>
              </el-table>
              <fenye
                style="float:right;margin:10px 0 20px 0;"
                @fatherMethod="getpage"
                @fathernum="gettol"
                :pagesa="total_cnt"
                :currentPage="currentPage"
              ></fenye>
            </el-col>
          </el-row>
          <el-row type="flex" class="row_active" v-show="radio_top != 1">
            <el-col :span="24">
              <el-table
                :data="tablecdn"
                border
                max-height="600"
                style="width: 98%;margin:10px;"
                :cell-style="rowClass"
                :header-cell-style="headClass"
              >
                <el-table-column label="加速内容名称" prop="urlname"></el-table-column>
                <el-table-column label="域名" prop="domain"></el-table-column>
                <el-table-column label="加速流量">
                  <template slot-scope="scope">
                    <div>{{scope.row.dataflow | setbytes}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="流量占比">
                  <template slot-scope="scope">
                    <div>{{scope.row.dataflowpercent | percentss}}</div>
                  </template>
                </el-table-column>
              </el-table>
              <fenye
                style="float:right;margin:10px 0 20px 0;"
                @fatherMethod="getpage"
                @fathernum="gettol"
                :pagesa="total_cnt"
                :currentPage="currentPage"
              ></fenye>
            </el-col>
          </el-row>
        </div>
      </div>
    </section>
    <div v-show="type==0" class="device_tables">
      <el-row type="flex" class="row_active">
        <el-col :span="24">
          <el-table
            :data="tablecdn"
            border
            max-height="600"
            style="width: 100%;"
            :cell-style="rowClass"
            :header-cell-style="headClass"
          >
            <el-table-column label="P2P播放流量">
              <template slot-scope="scope">
                <div>
                  {{
                  scope.row.p2pflow
                  | setbytes
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="下行节点回源流量">
              <template slot-scope="scope">
                <div>
                  {{
                  scope.row.downbackflow
                  | setbytes
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="下行CDN回源流量">
              <template slot-scope="scope">
                <div>
                  {{
                  scope.row.downcdnflow
                  | setbytes
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="时间">
              <template slot-scope="scope">
                <div>{{ scope.row.stime | settimes }}</div>
                <div>{{ scope.row.etime | settimes }}</div>
              </template>
            </el-table-column>
          </el-table>
          <fenye
            style="float:right;margin:10px 0 20px 0;"
            @fatherMethod="getpage"
            @fathernum="gettol"
            :pagesa="total_cnt"
            :currentPage="currentPage"
          ></fenye>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  dateToMs,
  getymdtime,
  getlocaltimes,
  formatBytes,
  formatBkb,
  formatBorb,
  getymdtime1,
  splitTimes
} from "../../servers/sevdate";
import {
  node_traffic_curve,
  node_traffic_table,
  node_traffic_download,
  top_accelcnt_ranking,
  top_dataflow_ranking,
  export_accelcnt_ranking_table_file,
  export_dataflow_ranking_table_file,
  get_nodetype_enum
} from "../../servers/api";
import fenye from "@/components/fenye";
import SelectTime from "@/components/SelectTime";
import echarts from "echarts";
import common from "../../comm/js/util";
import _ from "lodash";
export default {
  data() {
    return {
      type: 0,
      activeName: "first",
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.minDate = minDate;
          this.maxDate = maxDate;
        },
        disabledDate: (time) => {
          let curDate = new Date().getTime();
          let two = 365 * 2 * 24 * 3600 * 1000;
          let twoyear = curDate - two;
          let three = 30 * 3 * 24 * 3600 * 1000;
          if (this.minDate) {
            return (
              time.getTime() > Date.now() ||
              time.getTime() < twoyear ||
              time > new Date(this.minDate.getTime() + three) ||
              time < new Date(this.minDate.getTime() - three)
            );
          }
          return time.getTime() > Date.now() || time.getTime() < twoyear;
        },
      },
      shoudzyx: false,
      valueDomain: "",
      valueChannelId: "",
      valueContent: "",
      valueChanel: "",
      radio: 1,
      radio_top: 1,
      val2: "",
      val3: [],
      starttime: 0,
      endtime: 0,
      timeUnit: 120,
      tablecdn: [],
      total_cnt: 0,
      currentPage: 1,
      pagesize: 10,
      flowunit: "",
      timeArrayZb: "",
      dataAry: "",
      dataAry1: "",
      dataAry2: "",
      hashidSets: []
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
    percentss(data) {
      if (data == 0) {
        return 0 + "%";
      }
      return (data * 100).toFixed(2) + "%";
    },
  },
  components: { fenye, SelectTime },
  mounted() {
    if (this.$cookies.get("id")) {
      this.valueChannelId = String(this.$cookies.get("id") * 1);
    } else {
      this.$router.push({ path: "/" });
    };
    this.starttime = new Date(new Date().toLocaleDateString()).getTime() / 1000;
		this.endtime = Date.parse(new Date()) / 1000;
    this.getNodeType();
    this.get_node_flow();
  },
  methods: {
    selectTime(val) {
			this.starttime = val.starttime;
			this.endtime = val.endtime;
			this.pageNo = 1;
			this.tableData = [];
			this.total_cnt = 0;
			if(this.type==0){
        this.get_node_flow();
      }else{
        this.get_top_flow_num()
      }
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
    //节点流量
    get_node_flow() {
      let params = new Object();
      params.startTs = this.starttime;
      params.endTs = this.endtime;
      if (this.valueContent) {
        params.urlName = this.valueContent;
      } else {
        params.urlName = "*";
      }
      if (this.valueChannelId !== "") {
        params.channelId = this.valueChannelId;
      } else {
        params.channelId = "*";
      }
      if (this.valueChanel != "") {
        params.ipfsChannel = this.valueChanel;
      } else {
        params.ipfsChannel = "*";
      }

      if (this.valueDomain !== "") {
        params.domain = this.valueDomain;
      } else {
        params.domain = "*";
      }

      params.timeUnit = this.timeUnit;

      node_traffic_curve(params)
        .then((res) => {
          if (res.status == 0) {
            if([
              ...res.data.p2parray,
              ...res.data.downbackarray,
              ...res.data.downcdnarray,
            ].length == 0){
              this.flowunit = 'B'
            }else{
              var max = _.max([
                ...res.data.p2parray,
                ...res.data.downbackarray,
                ...res.data.downcdnarray,
              ]);
              this.flowunit = this.common.formatByteActiveunit(max);
            }
            
            this.timeArrayZb = [];

            if(res.data.p2parray.length == 0 && res.data.downbackarray.length ==0 && res.data.downcdnarray.length == 0){
              let arr = splitTimes(this.starttime, this.endtime, this.timeUnit);
              if (params.timeUnit == 120) {
                arr.forEach((item, index) => {
                  this.timeArrayZb.push(getymdtime1(item));
                });
              } else {
                arr.forEach((item, index) => {
                  this.timeArrayZb.push(getymdtime1(item, 11));
                });
              }

              this.dataAry = _.fill(Array(arr.length), 0);
              this.dataAry1 = _.fill(Array(arr.length), 0);
              this.dataAry2 = _.fill(Array(arr.length), 0);
            }else{
              if (params.timeUnit == 120) {
                res.data.timearray.forEach((item, index) => {
                  this.timeArrayZb.push(getymdtime1(item));
                });
              } else {
                res.data.timearray.forEach((item, index) => {
                  this.timeArrayZb.push(getymdtime1(item, 11));
                });
              }

              this.dataAry = res.data.downcdnarray.map((item) =>
                this.common.formatByteNum(item, this.flowunit)
              );
              this.dataAry1 = res.data.downbackarray.map((item) =>
                this.common.formatByteNum(item, this.flowunit)
              );
              this.dataAry2 = res.data.p2parray.map((item) =>
                this.common.formatByteNum(item, this.flowunit)
              );
            }
            


            this.drawLine2(
              this.timeArrayZb,
              this.dataAry,
              this.dataAry1,
              this.dataAry2
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });

      node_traffic_table(params)
        .then((res) => {
          if (res.status == 0) {
            this.tablecdn = [];
            this.tablecdn = res.data.list;
            this.total_cnt = res.data.totalCnt;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //TOP加速流量排行
    get_top_flow_table() {
      let params = new Object();
      params.startTs = this.starttime;
      params.endTs = this.endtime;
      params.pageNo = this.currentPage - 1;
      params.pageSize = this.pagesize;
      if (this.valueContent) {
        params.urlName = this.valueContent;
      } else {
        params.urlName = "*";
      }

      if (this.valueChannelId !== "") {
        params.channelId = this.valueChannelId;
      } else {
        params.channelId = "*";
      }

      if (this.valueDomain !== "") {
        params.domain = this.valueDomain;
      } else {
        params.domain = "*";
      }

      params.timeUnit = this.timeUnit;

      top_dataflow_ranking(params)
        .then((res) => {
          if (res.status == 0) {
            this.tablecdn = res.data.data;
            this.total_cnt = res.data.totalCnt;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //TOP加速次数排行
    get_top_flow_num() {
      let params = new Object();
      params.startTs = this.starttime;
      params.endTs = this.endtime;
      params.pageNo = this.currentPage - 1;
      params.pageSize = this.pagesize;
      // params.chanId = this.chanid + "";
      if (this.valueContent) {
        params.urlName = this.valueContent;
      } else {
        params.urlName = "*";
      }

      if (this.valueChannelId !== "") {
        params.channelId = this.valueChannelId;
      } else {
        params.channelId = "*";
      }

      if (this.valueDomain !== "") {
        params.domain = this.valueDomain;
      } else {
        params.domain = "*";
      }

      params.timeUnit = this.timeUnit;

      top_accelcnt_ranking(params)
        .then((res) => {
          if (res.status == 0) {
            this.tablecdn = res.data.data;
            this.total_cnt = res.data.totalCnt;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //下载节点流量图表
    exoprtNodeTraffic() {
      let params = new Object();
      params.startTs = this.starttime;
      params.endTs = this.endtime;
      // params.chanId = this.chanid + "";
      if (this.valueContent) {
        params.urlName = this.valueContent;
      } else {
        params.urlName = "*";
      }
      if (this.valueChannelId !== "") {
        params.channelId = this.valueChannelId;
      } else {
        params.channelId = "*";
      }
      if (this.valueChanel != "") {
        params.ipfsChanel = this.valueChanel;
      } else {
        params.ipfsChanel = "*";
      }

      if (this.valueDomain !== "") {
        params.domain = this.valueDomain;
      } else {
        params.domain = "*";
      }

      params.timeUnit = this.timeUnit;

      node_traffic_download(params)
        .then((res) => {
          if (res.status == 0) {
            window.open(res.msg, "_blank");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    toExportExcel() {
      if (this.radio_top == 1) {
        this.toExportAccelcntExcel();
      } else {
        this.toExportDataflowExcel();
      }
    },

    toExportAccelcntExcel() {
      let params = new Object();
      params.startTs = this.starttime;
      params.endTs = this.endtime;
      params.pageNo = this.currentPage - 1;
      params.pageSize = this.pagesize;
      if (this.valueContent1) {
        params.urlName = this.valueContent1;
      } else {
        params.urlName = "*";
      }

      if (this.valueChannelId !== "") {
        params.channelId = this.valueChannelId;
      } else {
        params.channelId = "*";
      }

      if (this.valueDomain !== "") {
        params.domain = this.valueDomain;
      } else {
        params.domain = "*";
      }

      params.timeUnit = this.timeUnit;
      export_accelcnt_ranking_table_file(params)
        .then((res) => {
          if (res.status == 0) {
            window.open(res.msg, "_blank");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    toExportDataflowExcel() {
      let params = new Object();
      params.startTs = this.starttime;
      params.endTs = this.endtime;
      params.pageNo = this.currentPage - 1;
      params.pageSize = this.pagesize;
      if (this.valueContent1) {
        params.urlName = this.valueContent1;
      } else {
        params.urlName = "*";
      }
      if (this.valueChannelId !== "") {
        params.channelId = this.valueChannelId;
      } else {
        params.channelId = "*";
      }
      if (this.valueDomain !== "") {
        params.domain = this.valueDomain;
      } else {
        params.domain = "*";
      }
      params.timeUnit = this.timeUnit;
      export_dataflow_ranking_table_file(params)
        .then((res) => {
          if (res.status == 0) {
            window.open(res.msg, "_blank");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //tab切换
    handleClick(val) {
      this.type = val;
      sessionStorage.setItem("tab_name", this.type); //添加到sessionStorage
      if (val == 0) {
        this.val2= [];
        let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
        this.starttime = times;
        this.endtime = Date.parse(new Date()) / 1000;
        this.settimeunit(this.starttime, this.endtime);
        this.get_node_flow();
      } else {
        this.val3 = [];
        let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
        this.starttime = times;
        this.endtime = Date.parse(new Date()) / 1000;
        this.val3[0] = this.common.getTimes(this.starttime * 1000);
        this.val3[1] = this.common.getTimes(this.endtime * 1000);
        this.settimeunit(this.starttime, this.endtime);
        if (this.radio_top == 1) {
          this.get_top_flow_num();
        } else {
          this.get_top_flow_table();
        }
      }
    },
    topClick() {
      let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.starttime = times;
      this.endtime = Date.parse(new Date()) / 1000;
      this.val3[0] = this.common.getTimes(this.starttime * 1000);
      this.val3[1] = this.common.getTimes(this.endtime * 1000);
      this.settimeunit(this.starttime, this.endtime);
      if (this.radio_top == 1) {
        this.get_top_flow_num();
      } else {
        this.get_top_flow_table();
      }
    },
    //搜索框事件
    getdata() {
      this.sele_time();
    },
    //获取页码
    getpage(pages) {
      this.currentPage = pages;
      if (this.activeName == "first") {
        this.get_node_flow();
      } else {
        if (this.radio_top == 1) {
          this.get_top_flow_num();
        } else {
          this.get_top_flow_table();
        }
      }
    },
    //获取每页数量
    gettol(pagetol) {
      this.pagesize = pagetol;
      // this.getuserlist();
    },
    //自定义按钮切换
    setshoudzyx() {
      this.shoudzyx = !this.shoudzyx;
    },
    //时间按钮点选
    sele_time() {
      if (this.radio == 1) {
        this.shoudzyx = false;
        this.today();
      } else if (this.radio == 2) {
        this.shoudzyx = false;
        this.yesterday();
      } else if (this.radio == 3) {
        this.shoudzyx = false;
        this.sevendat();
      } else if (this.radio == 4) {
        this.shoudzyx = false;
        this.thirtyday();
      } else if (this.radio == 5) {
        this.shoudzyx = true;
      }
    },
    //今天
    today() {
      let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.starttime = times;
      this.endtime = Date.parse(new Date()) / 1000;
      this.timeUnit = 120;
      if (this.activeName == "first") {
        this.get_node_flow();
      } else {
        if (this.radio_top == 1) {
          this.get_top_flow_num();
        } else {
          this.get_top_flow_table();
        }
      }
    },
    //昨天
    yesterday() {
      let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.starttime = times - 24 * 60 * 60 * 1;
      this.endtime = times - 1;
      this.timeUnit = 120;
      if (this.activeName == "first") {
        this.get_node_flow();
      } else {
        if (this.radio_top == 1) {
          this.get_top_flow_num();
        } else {
          this.get_top_flow_table();
        }
      }
    },
    //七天
    sevendat() {
      let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.starttime = times - 24 * 60 * 60 * 6;
      this.endtime = Date.parse(new Date()) / 1000;
      this.timeUnit = 1440;
      this.settimeunit(this.starttime, this.endtime);
      if (this.activeName == "first") {
        this.get_node_flow();
      } else {
        if (this.radio_top == 1) {
          this.get_top_flow_num();
        } else {
          this.get_top_flow_table();
        }
      }
    },
    //三十天
    thirtyday() {
      let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.starttime = times - 24 * 60 * 60 * 29;
      this.endtime = Date.parse(new Date()) / 1000;
      this.timeUnit = 1440;
      if (this.activeName == "first") {
        this.get_node_flow();
      } else {
        if (this.radio_top == 1) {
          this.get_top_flow_num();
        } else {
          this.get_top_flow_table();
        }
      }
    },
    //自定义时间
    gettimes(cal) {
      if(cal == 0){
        this.starttime = this.val2 ? dateToMs(this.val2[0]) : new Date(new Date().toLocaleDateString()).getTime() / 1000;
        this.endtime = this.val2 ? dateToMs(this.val2[1]) : Date.parse(new Date()) / 1000;
      }else{
        this.starttime = this.val3 ? dateToMs(this.val3[0]) : new Date(new Date().toLocaleDateString()).getTime() / 1000;
        this.endtime = this.val3 ? dateToMs(this.val3[1]) + (24*60*60-1) : Date.parse(new Date()) / 1000;
      }

      this.settimeunit(this.starttime, this.endtime);
      if (this.activeName == "first") {
        this.get_node_flow();
      } else {
        if (this.radio_top == 1) {
          this.get_top_flow_num();
        } else {
          this.get_top_flow_table();
        }
      }
    },
    //设置时间粒度
    settimeunit(sratime, endtime) {
      if (endtime - sratime <= 86400) {
        this.timeUnit = 120;
      } else {
        this.timeUnit = 1440;
      }
    },
    // 表头样式设置
    headClass() {
      return "text-align: center;background:#FDFBFB;";
    },
    // 表格样式设置
    rowClass() {
      return "text-align: center;";
    },
    drawLine2(x, y, z, a) {
      let _this = this;
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart1"));
      window.onresize = myChart.resize;
      // 绘制图表
      let options = {
        title: {
          text: "流量",
          left: "12px",
          textStyle: {
            color: "#333333",
            fontSize: 16,
          },
        },
        toolbox: {
          //show: true,
          itemSize: 20,
          itemGap: 30,
          right: 30,
          feature: {
            mydow: {
              show: true,
              title: "导出",
              icon: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAYAAADafVyIAAACVklEQVRIS9WVT0gUYRjGn+fT3NnVpFMQHSI6RFEnL3brD4Qys6mEEISi7mjQIRCCgiA6dAgCL4GH3F2XDtWlKNdcCYq9FVSnkOyvh4IIKsFyZnZrvjd2zDLd3F3bS99tmHee3/O9z/fNS1Rh2aY7HNbG4KUMc8vlWAV92JY3C5Eppb61X043flyqWT0AZAMEr7VPMzlpPF+EVAzoa5nbztpQGyHNgN4GcD2ALQBUICr4DOJwfDycLTyWDeiznD0KPA9gf6m2CpAX7R9LTjSkSgIGmmSdvyl3ESInyPINiSCVuGP00bbc98HONHsTE8bkUncDUYn44o0ROFDK9ZL3GlBn4uOhC0GLbMuVAEDdkUjX3/pdKCpmemMkzOXiIpgDOQOIAzBCyO6fGTiaqjuZDt34FfLfAP2mc0rIwMVCdngDqLj287dHMw3PAAbGCmvhmGqXStpG0vWP/jimxQDdlrO5DnwJIAzILESdfjX/IJnN7vterFW25Wb9vHSN3o28XXHRigH6TW9IKIMQPIaWjngm8m61DHr2zhip7FZvsabr4JeNobranUUz6OyUmkbX+0DBdN280TKc5dcKAg5KY6ZzhOS1ogC71WlGDa/nXaPpyj1+qlS8JCBmzh+nVtPxTPj+WsRLAnpaneZUJvJwreIlAf8ivPjtqhn8lwC/cM2F6mgiHbpajR3YltsLIAkwz5jlPiWwC4IXIhwSyIqxVxFU0VAiJ0EUZsUTxqK5dmh9s5JfcZlALaIPBfMgZnlRiD4LcgeBmjIFipaJwCcxRfLcSNrI/AC30TaaX55yXgAAAABJRU5ErkJggg==",
              onclick: function () {
                _this.exoprtNodeTraffic();
              },
              emphasis: {
                iconStyle: {
                  textFill: '#644CF7'
                }
              }
            },
          },
        },
        legend: {
          // orient: 'vertical',
          x: "center", //可设定图例在左、右、居中
          y: "bottom", //可设定图例在上、下、居中
          padding: [0, 0, 0, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
          data: ["P2P播放流量", "下行节点回源流量", "下行CDN回源流量"],
        },
        tooltip: {
          trigger: "axis",
          // backgroundColor: "#FFF",
          formatter: function (params) {
            return (
              params[0].axisValue +
              "</br>" +
              "P2P播放流量:" +
              _this.dataAry2[params[0].dataIndex] +
              _this.flowunit +
              "</br>" +
              "下行CDN回源流量:" +
              _this.dataAry[params[0].dataIndex] +
              _this.flowunit +
              "</br>" +
              "下行节点回源流量:" +
              _this.dataAry1[params[0].dataIndex] +
              _this.flowunit +
              "<br>"
            );
          },
        },
        grid: {
          left: "3%", // 默认10%，给24就挺合适的。
          top: 60, // 默认60
          right: 35, // 默认10%
          bottom: 80, // 默认60
        },
        xAxis: {
          data: x,
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          name: _this.flowunit,
          axisLable: {
            formatter: (value, index) => {
              return _this.common.formatByteNum(value, _this.flowunit);
            },
          },
        },
        series: [
          {
            name: "P2P播放流量",
            type: "bar",
            data: a,
            barMaxWidth: 30, //柱图宽度
            itemStyle: {
              normal: { color: "#8FC0FF" },
            },
          },
          {
            name: "下行节点回源流量",
            type: "bar",
            stack: "使用情况",
            data: z,
            barMaxWidth: 30, //柱图宽度
            itemStyle: {
              normal: {
                color: "#FFB430",
              },
            },
            label: {
              normal: {
                show: false,
                position: "inside",
                color: "#ffffff",
                fontSize: 10,
              },
            },
          },
          {
            name: "下行CDN回源流量",
            type: "bar",
            stack: "使用情况",
            data: y,
            barMaxWidth: 30, //柱图宽度
            itemStyle: {
              normal: {
                color: "#FFD800",
              },
            },
            label: {
              normal: {
                show: false,
                position: "inside",
                color: "#333333",
                fontSize: 10,
              },
            },
          },
        ],
      };
      myChart.setOption(options);
    },
  },
};
</script>

<style lang="scss" scoped>
.top_title{
  text-align: left;
  font-size: 18px;
  color: #333;
  margin-top: 0;
  .wrapperStyle{
      display: inline;
      margin-left: 54px;
      .itemStyle {
          font-weight: 500;
          display: inline;
          font-size: 16px;
          color: #666;
          margin-right: 48px;
          cursor: pointer;
          height: 20px;
      }
      .isSelected{
          color: #644CF7;
          border-bottom: 4px solid  #644CF7;
      }
  }
}
.device_tables {
  background: #fff;
  padding: 72px 64px;
  border-radius: 32px;
  width: 100%;
  height: auto;
  .operating{
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 20px;
  }
}
</style>
