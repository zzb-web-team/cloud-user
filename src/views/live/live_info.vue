<template>
  <section class="myself-container content">
    <div class="top_title">直播流信息</div>
    <div class="content-main">
      <el-tabs v-model="activeName" @tab-click="handleClick" style="margin">
        <div class="seach" style="margin-top: 40px;">
          <el-input v-model="values" placeholder="请输入直播流名称、直播流地址、直播间ID、渠道ID" style="width:24%;margin-right: 10px;" @keyup.enter.native="onChanges">
            <i slot="prefix" class="el-input__icon el-icon-search" @click="onChanges()"></i>
          </el-input>
          <el-date-picker style="margin-left:10px;" v-model="times" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="left" @change="gettimes"></el-date-picker>
          <el-button style="margin-left: 10px;" type="primary" @click="reset">重置</el-button>
        </div>
        <el-tab-pane label="在线流" name="first" :lazy="true">
          <div class="device_table">
            <el-row type="flex" class="row_active">
              <el-col :span="24">
                <el-table :data="onlineDatas" border max-height="560px" style="width: 100%;margin: 10px 0;" :cell-style="rowClass" :header-cell-style="headClass">
                  <el-table-column label="直播流名称">
                    <template slot-scope="scope">
                      <div>{{ scope.row.streamName }}</div>
                    </template>
                  </el-table-column>

                  <el-table-column label="直播流地址">
                    <template slot-scope="scope">
                      <div>{{ scope.row.liveAddr }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="直播间ID">
                    <template slot-scope="scope">
                      <div style="display: flex;justify-content: center;">
                        <div>{{ scope.row.roomId }}</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="终端名称" >
                    <template slot-scope="scope">
                      <div style="display: flex;justify-content: center;">
                        <div>{{ scope.row.terminalName }}</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="渠道ID" >
                    <template slot-scope="scope">
                      <div style="display: flex;justify-content: center;">
                        <div>{{ scope.row.ChanId }}</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="拉流开始时间" sortable="true" sort-by="settimes">
                    <template slot-scope="scope">
                      <div>{{ scope.row.startTime | settimes }}</div>
                    </template>
                  </el-table-column>
                </el-table>
                <fenye style="float:right;margin:10px 0 0 0;" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" :currentPage = "pageNo" :pagesa="total_cnt"></fenye>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="历史流" name="second" :lazy="true">
          <div class="device_table">
            <div class="operating">
              <el-button style="margin-left: auto;" type="primary">导出</el-button>
            </div>
            <el-row type="flex" class="row_active">
              <el-col :span="24">
                <el-table :data="historyDatas" border max-height = "530px" style="width: 100%; margin: 10px 0;" :cell-style="rowClass" :header-cell-style="headClass">
                  <el-table-column label="直播流名称">
                    <template slot-scope="scope">
                        <div>{{ scope.row.urlname }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="直播流地址">
                  <template slot-scope="scope">
                      <div>{{ scope.row.domain }}</div>
                  </template>
                  </el-table-column>
                  <el-table-column label="直播间ID">
                  <template slot-scope="scope">
                      <div style="display: flex;justify-content: center;">
                        <div>{{ scope.row.RoomId }}</div>
                      </div>
                  </template>
                  </el-table-column>
                  <el-table-column label="终端名称">
                  <template slot-scope="scope">
                      <div style="display: flex;justify-content: center;">
                        <div>{{ scope.row.accelCnt }}</div>
                      </div>
                  </template>
                  </el-table-column>
                  <el-table-column label="渠道ID" >
                    <template slot-scope="scope">
                        <div style="display: flex;justify-content: center;">
                          <div>{{ scope.row.accelCntpercent  }}</div>
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="拉流开始时间">
                    <template slot-scope="scope">
                      <div>{{ scope.row.stime | settimes }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="拉流结束时间">
                    <template slot-scope="scope">
                      <div>{{ scope.row.etime | settimes }}</div>
                    </template>
                  </el-table-column>
                </el-table>
                <fenye style="float:right;margin:10px 0 20px 0;" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" :currentPage = "pageNo" :pagesa="total_cnt"></fenye>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>

<script>
import { dateToMs, getymdtime, getymdtime1, splitTimes } from "../../servers/sevdate";
import fenye from "@/components/fenye";
import {
  query_streaminfo, query_live_history
} from "../../servers/api";
import echarts from "echarts";
import common from "../../comm/js/util";
import _ from "lodash";

export default {
  data() {
    return {
      activeName: "first",
      values: "",
      radio: 1,
      showzdy: false,
      times: [],
      pageNo: 1,
      pageSize: 10,
      total_cnt: 0,
      onlineDatas: [],
      historyDatas: [],
      chanid: '',
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
  components: {
    fenye,
  },
  created() {
    if (this.$cookies.get('id')) {
			this.chanid = this.$cookies.get('id') ;
		} else {
			this.$router.push({ path: '/' });
		}
    this.starttime = new Date(new Date().toLocaleDateString()).getTime() / 1000;
    this.endtime = Date.parse(new Date()) / 1000;
    this.getStreamInfo();
  },
  methods: {
    //获取加速次数每页数量
    handleSizeChange(pagetol) {
      this.pageSize = pagetol;
      if(this.activeName == 'first'){
        this.getStreamInfo();
      }else{
        this.getHistoryInfo();
      }
    },
    //获取页码
    handleCurrentChange(pages) {
      this.pageNo = pages;
      this.getStreamInfo();
    },
    onChanges() {
      this.pageNo = 1;
      this.getStreamInfo();
    },

    reset() {
      this.pageNo = 1;
      this.values = '';
      this.starttime = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.endtime = Date.parse(new Date()) / 1000;
      this.times = [];
      if(this.activeName == 'first'){
        this.getStreamInfo();
      }else{
        this.getHistoryInfo();
      }
    },

    getParams() {
      let params = new Object();
      this.activeName == 'first' ? params.startTime = this.starttime : params.startTs = this.starttime;
      this.activeName == 'first' ? params.endTime = this.endtime : params.endTs = this.endtime;
      this.activeName == 'first' ? params.page = this.pageNo - 1 : (params.pageNo = this.pageNo - 1,params.pageSize = 10);
      this.activeName == 'first' ? params.chanId = this.chanid : params.channelId = this.chanid;
      if(this.values !== ""){
        var roomId = /^\d{8}$/;
        var liveAddr = /^http?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
        if(roomId.test(this.values)){
          params.roomId = this.values;
          params.liveAddr = '';
          params.streamName = '';
        }else if(liveAddr.test(this.values)){
          params.roomId = '';
          params.liveAddr = this.values;
          params.streamName = '';
        }else{
          params.roomId = '';
          params.liveAddr = '';
          params.streamName = this.values;
        }
      } else {
        params.roomId = '';
        params.liveAddr = '';
        params.streamName = '';
      }
      return params;
    },

    getStreamInfo() {
      let params = this.getParams();
      query_streaminfo(params)
        .then(res => {
          console.log(res)
          // if (res.status == 0) {
            this.onlineDatas = res.result;
            this.total_cnt = res.total;
          // }
        })
        .catch(error => {
          console.log(error);
        });
    },

    getHistoryInfo() {
      let params = this.getParams();
      query_live_history(params)
        .then(res => {
          console.log(res)
          if (res.status == 0) {
            this.historyDatas = res.result;
            this.total_cnt = res.total;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //今天
    today(data) {
      let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.starttime = times;
      this.endtime = Date.parse(new Date()) / 1000;
      this.pageNo = 1;
      if(this.activeName == 'first'){
        this.getStreamInfo();
      }else{
        this.getHistoryInfo();
      }
    },
    //昨天
    yesterday(data) {
      let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.starttime = times - 24 * 60 * 60 * 1;
      this.endtime = times - 1;
      this.pageNo = 1;
      if(this.activeName == 'first'){
        this.getStreamInfo();
      }else{
        this.getHistoryInfo();
      }
    },
    //七天
    sevendat(data) {
      let times = parseInt(new Date(new Date()).getTime() / 1000);
      this.starttime = times - 24 * 60 * 60 * 6;
      this.endtime = times;
      this.pageNo = 1;
      if(this.activeName == 'first'){
        this.getStreamInfo();
      }else{
        this.getHistoryInfo();
      }
    },
    //三十天
    thirtyday(data) {
      let times = parseInt(new Date(new Date()).getTime() / 1000);
      this.starttime = times - 24 * 60 * 60 * 29;
      this.endtime = times;
      this.pageNo = 1;
      if(this.activeName == 'first'){
        this.getStreamInfo();
      }else{
        this.getHistoryInfo();
      }
    },
    //自定义时间
    gettimes(cal) {
      this.starttime = this.times ? dateToMs(this.times[0]) : new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.endtime = this.times ? dateToMs(this.times[1]) + (24*60*60-1) : Date.parse(new Date()) / 1000;
      this.pageNo = 1;
      if(this.activeName == 'first'){
        this.getStreamInfo();
      }else{
        this.getHistoryInfo();
      }
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
      if (tab.index == 0) {
        this.times= [];
        let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
        this.starttime = times;
        this.endtime = Date.parse(new Date()) / 1000;
        this.getStreamInfo();
      } else if (tab.index == 1) {
        this.times = [];
        let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
        this.starttime = times;
        this.endtime = Date.parse(new Date()) / 1000;
        // this.times[0] = this.common.getTimes(this.starttime * 1000);
        // this.times[1] = this.common.getTimes(this.endtime * 1000);
        this.getHistoryInfo();
      }
    },
    toExportExcel(){

    }
  },
};
</script>

<style lang="scss" scoped>
.myself-container {
  width: 100%;
  //min-width: 1600px;

  .device_form {
    width: auto;
    height: auto;
    margin-top: 20px;
    background: #ffffff;
    padding: 15px 30px;
    box-sizing: border-box;
    box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
    border-radius: 2px;

    .bottom {
      margin-top: 20px;
    }

    .el-form-item__label {
      white-space: nowrap;
    }

    .el-form-item {
      margin-bottom: 0px;
      margin-left: 10px;
    }

    .div_show {
      width: auto;
      display: flex;
      height: 40px;
      justify-content: center;
      align-items: center;
      color: #409eff;
      cursor: pointer;
      margin-left: 20px;
    }
  }

  .devide_table {
    padding: 0px 35px 35px 35px;
    height: auto;
    background: #ffffff;
    border-radius: 2px;
    box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
    border-radius: 2px;
    // .el-table::before {
    //   z-index: inherit;
    // }
    .el-table td,
    .el-table th {
      padding: 6px 0px;
    }
    .tab_top_btn {
			text-align: left;
			margin-left: 10px;
		}
  }

  .devide_pageNation {
    width: 100%;
    height: auto;
    // overflow: hidden;
    margin-top: 20px;
    .devide_pageNation_active {
      float: right;
    }
  }
}

</style>
