<template>
  <section class="myself-container content">
    <div class="top_title">直播加速内容</div>
    <div class="content-main">
      <div class="seach" >
        <el-input v-model="values" placeholder="请输入渠道ID、直播间ID、源站域名" style="width:18%;margin-right: 10px;" @keyup.enter.native="onChanges">
          <i slot="prefix" class="el-input__icon el-icon-search" @click="onChanges()"></i>
        </el-input>
        <el-select v-model="liveProto" placeholder="请选择回源协议" style="width: 12%;margin-right: 10px;" @change="onChanges">
          <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="state" placeholder="请选择状态" style="width: 12%;margin-right: 10px;" @change="onChanges">
          <el-option v-for="(item, index) in options1" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-date-picker style="margin-left:10px;" v-model="times" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="left" @change="gettimes"></el-date-picker>
        <el-button style="margin-left: 10px;" type="primary" @click="reset">重置</el-button>
      </div>
      <div class="device_table">
        <div class="operating">
          <el-button style="margin-left: auto;" type="primary" @click="toExportExcel">导出</el-button>
        </div>
        <el-row type="flex" class="row_active">
          <el-col :span="24">
            <el-table :data="datas" border max-height="560px" style="width: 100%;" :cell-style="rowClass" :header-cell-style="headClass" @sort-change="changeSort">
              <el-table-column label="渠道ID">
                <template slot-scope="scope">
                  <div>{{ scope.row.ChanId }}</div>
                </template>
              </el-table-column>

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
                  <div v-if="scope.row.state == 1">正常运行
                    <span style="display:inline-block;line-height: 20px;width: 50px;height: 20px;background:#999;color:#fff;border-radius: 20px;font-size: 13px;">未加速</span>
                  </div>
                  <div v-else-if="scope.row.state == 2">正常运行
                    <span style="display:inline-block;line-height: 20px;width: 50px;height: 20px;background:#644CF7;color:#fff;border-radius: 20px;font-size: 13px;">已加速</span>
                  </div>
                  <div style="color:#E54545;" v-else>回源失败</div>
                </template>
              </el-table-column>
              <el-table-column label="创建日期" sortable="custom">
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
  </section>
</template>

<script>
import { dateToMs, getymdtime, getymdtime1, splitTimes } from "../../servers/sevdate";
import fenye from "@/components/fenye";
import {
  query_liveinfo,
} from "../../servers/api";
import echarts from "echarts";
import common from "../../comm/js/util";
import _ from "lodash";

export default {
  data() {
    return {
      pageNo: 0,
      total_cnt: 0,
      order: 0,
      datas: [],
      values: "",
      liveProto: "",
      state: "",
      radio: 1,
      showzdy: false,
      times: [],
      chanid: '',
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
          label: "未加速",
        },
        {
          value: 2,
          label: "已加速",
        },
        {
          value: 3,
          label: "回源失败",
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
    this.times[0] = this.common.getTimes(this.starttime * 1000);
    this.times[1] = this.common.getTimes(this.endtime * 1000);
    this.getContentInfo()
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
    onChanges() {
      this.getContentInfo();
    },
    reset() {
      this.liveProto = '';
      this.state = '';
      this.values = '';
      this.starttime = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.endtime = Date.parse(new Date()) / 1000;
      this.times = [];
      this.getContentInfo();
    },
    changeSort(val){
      console.log(val)
      if(this.order==0){
        this.order = 1;
      }else{
        this.order = 0;
      }
      this.getContentInfo();
    },
    getContentInfo() {
      let params = new Object();
      params.startTime = this.starttime;
      params.endTime = this.endtime;
      params.page = this.pageNo;
      params.chanId = this.chanid;
      params.order = this.order;
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

    toExportExcel() {
      let params = new Object();
      params.startTime = this.starttime;
      params.endTime = this.endtime;
      params.page = this.pageNo;
      params.order = 0;
      if (this.liveProto !== "") {
        params.liveProto = this.liveProto;
      } else {
        params.liveProto = 0;
      }
      if (this.state !== "") {
        if(this.state == 3){
          params.state = 1
        }else{
          params.state = this.state;
        }
      } else {
        params.state = 0;
      }
      if(this.values !== ""){
        var channelIdReg = /^\d{12}$/;
        var roomId = /^\d{8}$/;
        if(channelIdReg.test(this.values)){
          params.chanId = this.values;
          params.roomId = '';
          params.domain = '';
        }else if(roomId.test(this.values)){
          params.chanId = '';
          params.roomId = this.values;
          params.domain = '';
        }else{
          params.chanId = '';
          params.roomId = '';
          params.domain = this.values;
        }
      } else {
        params.chanId = '';
        params.roomId = '';
        params.domain = '';
      }
      export_liveinfo_for_admin(params)
        .then((res) => {
          if (res) {
            window.open(res.downloadAddr, "_blank");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //今天
    today(data) {
      let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.starttime = times;
      this.endtime = Date.parse(new Date()) / 1000;
      this.pageNo = 0;
      this.getContentInfo();
    },
    //昨天
    yesterday(data) {
      let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.starttime = times - 24 * 60 * 60 * 1;
      this.endtime = times - 1;
      this.pageNo = 0;
      this.getContentInfo();
    },
    //七天
    sevendat(data) {
      let times = parseInt(new Date(new Date()).getTime() / 1000);
      this.starttime = times - 24 * 60 * 60 * 6;
      this.endtime = times;
      this.pageNo = 0;
      this.getContentInfo();
    },
    //三十天
    thirtyday(data) {
      let times = parseInt(new Date(new Date()).getTime() / 1000);
      this.starttime = times - 24 * 60 * 60 * 29;
      this.endtime = times;
      this.pageNo = 0;
      this.getContentInfo();
    },
    //自定义时间
    gettimes(cal) {
      this.starttime = this.times ? dateToMs(this.times[0]) : new Date(new Date().toLocaleDateString()).getTime() / 1000;
      this.endtime = this.times ? dateToMs(this.times[1]) + (24*60*60-1) : Date.parse(new Date()) / 1000;
      this.pageNo = 0;
      this.getContentInfo();
    },
    // 表头样式设置
    headClass() {
      return "text-align: center; background: #FDFBFB; font-weight: 500; color: #333";
    },
    // 表格样式设置
    rowClass() {
      return "text-align: center;";
    },
  },
};
</script>

<style lang="scss">
</style>
