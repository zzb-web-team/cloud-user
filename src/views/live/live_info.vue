<template>
  <section class="myself-container content">
    <div class="top_title">直播流信息</div>
    <div class="user-title" style="display: flex;flex-flow: column;">
      <div class="resources_con">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <div style="display: flex;align-items: center;flex-flow: row;margin-top: 20px;padding:20px 37px;background:rgba(255,255,255,1);box-shadow:0px 2px 3px 0px rgba(6,17,36,0.14);border-radius:2px;">
              <el-input v-model="values" placeholder="请输入直播流名称、直播流地址、直播间ID" style="width:20%;margin-right: 10px;" @keyup.enter.native="onChanges">
                <i slot="prefix" class="el-input__icon el-icon-search" @click="onChanges()"></i>
              </el-input>
              <!-- <el-radio-group
                v-model="radio"
                size="medium"
                @change="select_time()"
                v-show="!showzdy"
              >
                <el-radio-button size = "small" label="1">今天</el-radio-button >
                <el-radio-button size = "small" label="2">昨天</el-radio-button >
                <el-radio-button size = "small" label="3">近7天</el-radio-button >
                <el-radio-button size = "small" label="4">近30天</el-radio-button >
                <el-radio-button size = "small" label="5">自定义</el-radio-button >
              </el-radio-group>
              <el-button
                type="primary"
                v-show="showzdy"
                 size = "small"
                style="background:#409EFF;border:#409EFF"
                @click="setZdy"
                >自定义</el-button
						  > -->
              <el-date-picker style="margin-left:10px;" v-model="times" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="left" @change="gettimes(0)"></el-date-picker>
              <!-- <el-button style="margin-left:10px;" type="primary" @click="seachtu()">确定</el-button> -->
            </div>
          <el-tab-pane label="在线流" name="first" :lazy="true">
            <div class="devide_table">
              <el-row type="flex" class="row_active">
                <el-col :span="24">
                  <div style="display: flex;justify-content: flex-end;">
                    <el-button type="primary" @click="toExportExcel">导出</el-button>
                  </div>
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
                    <el-table-column label="拉流开始时间">
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
            <div class="devide_table">
              <div style="display: flex;justify-content: flex-end;">
                <el-button type="primary" @click="toExportExcel">导出</el-button>
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
                        <div>{{ scope.row.channelid }}</div>
                    </template>
                    </el-table-column>
                    <el-table-column label="直播间ID">
                    <template slot-scope="scope">
                        <div style="display: flex;justify-content: center;">
                          <div>{{ scope.row.domain }}</div>
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
                            <div>{{ scope.row.accelCntpercent | percentss }}</div>
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
    </div>
  </section>
</template>

<script>
import { dateToMs, getymdtime, getymdtime1, splitTimes } from "../../servers/sevdate";
import fenye from "@/components/fenye";
import {
  query_streaminfo
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
      chanid: '',
      times: [],
      pageNo: 0,
      pageSize: 10,
      total_cnt: 0,
      onlineDatas: [],
      historyDatas: []
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
			this.chanid = this.$cookies.get('id');
		} else {
			this.$router.push({ path: '/' });
		}
    this.starttime = new Date(new Date().toLocaleDateString()).getTime() / 1000;
    this.endtime = Date.parse(new Date()) / 1000;
    this.times[0] = common.getTimess(this.starttime * 1000);
    this.times[1] = common.getTimess(this.endtime * 1000);
    this.getStreamInfo();
  },
  methods: {
    search(){
      this.pageNo = 0;
      this.getStreamInfo();
      // this.pageSize = 10;
    },
    //获取加速次数每页数量
    handleSizeChange(pagetol) {
      this.pageSize = pagetol;
      this.getStreamInfo();
    },
    //获取页码
    handleCurrentChange(pages) {
      this.pageNo = pages;
      this.getStreamInfo();
    },
    //自定义事件组件
    select_time() {
			if (this.radio == 1) {
				this.showzdy = false;
				this.today();
			} else if (this.radio == 2) {
				this.showzdy = false;
				this.yesterday();
			} else if (this.radio == 3) {
				this.showzdy = false;
				this.sevendat();
			} else if (this.radio == 4) {
				this.showzdy = false;
				this.thirtyday();
			} else if (this.radio == 5) {
				this.showzdy = true;
			}
    },
    onChanges() {
      this.pageNo = 0;
      this.getStreamInfo();
    },

    setZdy() {
      this.showzdy = !this.showzdy;
      this.radio = 1;
    },

    seachtu(data) {
      if (this.endtime - this.starttime > 7776000) {
        this.$message({
          message: "起始时间和结束时间最大跨度不能超过三个月",
          type: "error",
        });
        return false;
      }
      this.pageNo = 0;
      this.getStreamInfo();
    },

    getStreamInfo() {
       let params = new Object();
      params.startTime = this.starttime;
      params.endTime = this.endtime;
      params.page = this.pageNo;
      params.chanId = this.chanid;
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

    //今天
    today(data) {
      let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.starttime = times;
      this.endtime = Date.parse(new Date()) / 1000;
      this.pageNo = 0;
      this.getStreamInfo();
    },
    //昨天
    yesterday(data) {
      let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.starttime = times - 24 * 60 * 60 * 1;
      this.endtime = times - 1;
      this.pageNo = 0;
      this.getStreamInfo();
    },
    //七天
    sevendat(data) {
      let times = parseInt(new Date(new Date()).getTime() / 1000);
      this.starttime = times - 24 * 60 * 60 * 6;
      this.endtime = times;
      this.pageNo = 0;
      this.getStreamInfo();
    },
    //三十天
    thirtyday(data) {
      let times = parseInt(new Date(new Date()).getTime() / 1000);
      this.starttime = times - 24 * 60 * 60 * 29;
      this.endtime = times;
      this.pageNo = 0;
      this.getStreamInfo();
    },
    //自定义时间
    gettimes(cal) {
      
      this.starttime = this.times ? dateToMs(this.times[0]) : new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.endtime = this.times ? dateToMs(this.times[1]) + (24*60*60-1) : Date.parse(new Date()) / 1000;
      
      this.pageNo = 0;
      this.getStreamInfo();
    },
    
    // 表头样式设置
    headClass() {
      return "text-align: center;background:#F3F6FB;";
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
      } else if (tab.index == 1) {
        this.times = [];
        let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
        this.starttime = times;
        this.endtime = Date.parse(new Date()) / 1000;
        this.times[0] = this.common.getTimes(this.starttime * 1000);
        this.times[1] = this.common.getTimes(this.endtime * 1000);
      }
    },

    toExportExcel(){

    }
  },
};
</script>

<style lang="scss">
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
    padding: 35px;
    height: auto;
    margin-top: 20px;
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
