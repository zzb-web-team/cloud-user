<template>
  <section class="myself-container content">
    <div class="top_title">直播加速管理</div>
    <div class="user-title" style="display: flex;flex-flow: column;">
      <div class="resources_con">
        <div style="display: flex;align-items: center;flex-flow: row;margin-top: 20px;padding:20px 37px;background:rgba(255,255,255,1);box-shadow:0px 2px 3px 0px rgba(6,17,36,0.14);border-radius:2px;">
          <el-input v-model="values" placeholder="请输入直播间ID、源站域名" style="width:10%;margin-right: 10px;" @keyup.enter.native="onChanges">
            <i slot="prefix" class="el-input__icon el-icon-search" @click="onChanges()"></i>
          </el-input>
          <el-select v-model="protocol" placeholder="请选择回源协议" style="width: 10%;margin-right: 10px;" @change="onChanges">
            <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-model="state" placeholder="请选择状态" style="width: 10%;margin-right: 10px;" @change="onChanges">
            <el-option v-for="(item, index) in options1" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
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
          <el-date-picker style="margin-left:10px;" v-model="times" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="left" @change="gettimes"></el-date-picker>
          <!-- <el-button style="margin-left:10px;" type="primary" @click="seachtu()">确定</el-button> -->
        </div>
        <div class="devide_table">
          <el-row type="flex" class="row_active">
            <el-col :span="24">
              <el-table :data="datas" border max-height="560px" style="width: 98%;margin:10px;" :cell-style="rowClass" :header-cell-style="headClass">
                <el-table-column label="直播间ID">
                  <template slot-scope="scope">
                    <div>{{ scope.row.RoomId }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="源站域名">
                  <template slot-scope="scope">
                    <div style="display: flex;justify-content: center;">
                      <div>{{ scope.row.Domain }}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="回源协议" >
                  <template slot-scope="scope">
                    <div style="display: flex;justify-content: center;">
                      <div>{{ scope.row.liveProto == 1 ? 'rtmp' : 'http' }}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="状态" >
                  <template slot-scope="scope">
                    <div style="display: flex;justify-content: center;">
                      <div>{{ scope.row.state == 1 ? '运行正常' : '异常' }}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="统计时间">
                  <template slot-scope="scope">
                    <div>{{ scope.row.createTime | settimes }}</div>
                  </template>
                </el-table-column>
              </el-table>
              <fenye style="float:right;margin:10px 0 0 0;" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" :currentPage = "pageNo" :pagesa="total_cnt"></fenye>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { dateToMs, getymdtime, getymdtime1, splitTimes } from "../../servers/sevdate";
import fenye from "@/components/fenye";
import {
  query_liveinfo
} from "../../servers/api";
import echarts from "echarts";
import common from "../../comm/js/util";
import _ from "lodash";

export default {
  data() {
    return {
      pageNo: 0,
      total_cnt: 0,
      datas: [],
      values: "",
      protocol: "",
      state: "",
      radio: 1,
      chanid: '',
      showzdy: false,
      times: [],
      options: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "rmtp",
        },

        {
          value: 2,
          label: "http",
        },
      ],
      options1: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "正常运行",
        },

        {
          value: 2,
          label: "异常",
        },
      ],
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
    console.log(this.times)
    this.getContentInfo();
  },
  methods: {
    //获取加速次数每页数量
    handleSizeChange(pagetol) {
      this.pageSize = pagetol;
      this.getContentInfo();
    },
    //获取页码
    handleCurrentChange(pages) {
      this.pageNo = pages;
      this.getContentInfo();
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
      this.getContentInfo();
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
    },

    getContentInfo() {
       let params = new Object();
      params.startTime = this.starttime;
      params.endTime = this.endtime;
      params.page = this.pageNo;
      params.order = 0;
      params.chanId = this.chanid;
      if (this.liveProto !== "") {
        params.liveProto = this.liveProto;
      } else {
        params.liveProto = 0;
      }
      if (this.state !== "") {
        params.state = this.state;
      } else {
        params.state = 0;
      }
      if(this.values !== ""){
        var roomId = /^\d{8}$/;
        if(roomId.test(this.values)){
          params.roomId = this.values;
          params.domain = '';
        }else{
          params.roomId = '';
          params.domain = this.values;
        }
      } else {
        params.roomId = '';
        params.domain = '';
      }

      query_liveinfo(params)
        .then(res => {
          console.log(res)
          // if (res.status == 0) {
            this.datas = res.result;
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
      this.timeUnit = 60;
      this.pageNo = 0;
      this.getContentInfo();
    },
    //昨天
    yesterday(data) {
      let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.starttime = times - 24 * 60 * 60 * 1;
      this.endtime = times - 1;
      this.timeUnit = 60;
      this.pageNo = 0;
      this.getContentInfo();
    },
    //七天
    sevendat(data) {
      let times = parseInt(new Date(new Date()).getTime() / 1000);
      this.starttime = times - 24 * 60 * 60 * 6;
      this.endtime = times;
      this.timeUnit = 60 * 24;
      this.pageNo = 0;
      this.getContentInfo();
    },
    //三十天
    thirtyday(data) {
      let times = parseInt(new Date(new Date()).getTime() / 1000);
      this.starttime = times - 24 * 60 * 60 * 29;
      this.endtime = times;
      this.timeUnit = 60 * 24;
      this.pageNo = 0;
      this.getContentInfo();
    },
    //自定义时间
    gettimes() {
      this.starttime = this.times ? dateToMs(this.times[0]) : new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.endtime = this.times ? dateToMs(this.times[1]) + (24*60*60-1) : Date.parse(new Date()) / 1000;
      this.pageNo = 0;
      this.getContentInfo();
    },
    // 表头样式设置
    headClass() {
      return "text-align: center;background:#F3F6FB;";
    },
    // 表格样式设置
    rowClass() {
      return "text-align: center;";
    },
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
