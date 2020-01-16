<template>
  <div class="lot_operating">
    <div class="top_title">
      <span @click="goback" style="font-size: 24px;color: #202020;"
        ><i
          class="el-icon-arrow-left"
          style="color:#297AFF;font-size: 18px;font-weight: 600;margin-right:23px;"
        ></i
        >批量管理标签</span
      >
    </div>
    <div class="labe_seach">
      <div class="seach_bottom">
        <!-- <span>已配置标签：</span> -->
        <el-select
          v-model="pivalue"
          placeholder="已配置标签"
          @change="selectChanged"
        >
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in pioptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          v-model="input"
          placeholder="请输入URL"
          maxlength="70"
          style="width:300px;margin-left:21px;"
          @keyup.enter.native="onSubmit"
        ></el-input>
        <!-- <span>日期：</span>
        <el-date-picker
          v-model="pivalue1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-button type="primary" plain size="mini" @click="piseachuser()"
          >确定</el-button
        >
        <el-button plain size="mini" @click="pireset()">重置</el-button> -->
      </div>
      <div class="labe_con">
        <el-table
          :data="pitableData"
          stripe
          height="468"
          style="width: 100%;margin-top:10px;"
          :cell-style="rowClass"
          :header-cell-style="headClass"
        >
          <el-table-column prop="dominds" label="URL"></el-table-column>
          <el-table-column prop="label" label="标签">
            <template slot-scope="scope">
              <el-input
                class="lot_maintag"
                v-model="scope.row.label"
                placeholder="标签"
                :disabled="!scope.row.statusa"
              ></el-input>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="label2" label="视频终端">
            <template slot-scope="scope">
              <el-select
                class="lot_subtag"
                v-model="scope.row.label2"
                placeholder="请选择"
                :disabled="!scope.row.statusa"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  class="tala_con"
                ></el-option>
              </el-select>
            </template>
          </el-table-column> -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                v-if="scope.row.statusa == false"
                @click="pihandleClick(scope.$index, scope.row)"
                style="width:82px;height:34px;background:rgba(41,122,255,1);border-radius:4px;"
                >修改</el-button
              >
              <el-button
                type="primary"
                size="small"
                v-else
                @click="pleClick(scope.$index, scope.row)"
                style="width:82px;height:34px;background:rgba(41,122,255,1);border-radius:4px;"
                >保存</el-button
              >
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
        <div slot="footer" class="lot_footer">
          <el-button
            type="primary"
            @click="pidiiblea"
            :disabled="alllabel"
            style="width:105px;height:40px;background:rgba(41,122,255,1);border-radius:2px;"
            >确 定</el-button
          >
          <el-button
            @click="pidiaibles"
            style="width:100px;height:40px;background:rgba(225,225,225,1);border-radius:2px;color:#000000;"
            >取 消</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fenye from "@/components/fenye";
import {
  modify_label,
  query_url,
  query_urllabel,
  getterminal,
  check_label
} from "../../servers/api";
export default {
  data() {
    return {
      currentPage: 1,
      pivalue: "",
      pivalue1: "",
      input: "",
      alllabel: true,
      total_cnt: 1,
      pagesize: 10,
      tolpage: 1,
      chanid: "",
      page: 0,
      label2: [],
      label: "",
      labellist: [],
      errarr: "",
      errarrs: "",
      pioptions: [
        {
          value: 0,
          label: "未配置标签"
        },
        {
          value: 1,
          label: "已配置标签"
        }
      ],
      options: [],
      pitableData: [],
      zlabeldata: [],
      datanum: 0
    };
  },
  components: {
    fenye
  },
  mounted() {
    if (this.$cookies.get("id")) {
      this.chanid = this.$cookies.get("id") * 1;
    } else {
      this.$router.push({ path: "/" });
    }
    this.getlabrl2();
    this.getuserlist();
  },
  methods: {
    //获取数据列表
    getuserlist() {
      let params = new Object();
      params.page = this.tolpage - 1;
      params.buser_id = this.chanid + "";
      params.url = this.input;
      if (this.pivalue === "") {
        params.state = -1;
      } else {
        params.state = this.pivalue;
      }

      query_urllabel(params)
        .then(res => {
          if (res.status == 0) {
            // this.pager.count = res.data.total;
            this.total_cnt = res.data.total;
            this.pitableData = [];
            res.data.result.forEach((item, index) => {
              let obj = {};
              obj.dominds = item.url;
              obj.label = item.label;
              obj.label2 = item.label2;
              obj.status = item.state;
              obj.time_create = item.create_time;
              obj.camesd = item.label;
              obj.statusa = false;
              this.pitableData.push(obj);
            });
          } else {
            this.$message.error(res.err_msg);
          }
        })
        .catch(err => {});
    },
    //获取视频终端
    getlabrl2() {
      let parmas = new Object();
      parmas.chanid = this.chanid;
      parmas.page = this.page;
      getterminal(parmas)
        .then(res => {
          res.result.cols.forEach((item, index) => {
            let obj = {};
            obj.value = item.id;
            obj.label =
              item.id + "--" + item.name + "--" + "(" + item.type + ")";
            this.label2.push(obj);
          });
          if (res.result.les_count == 0) {
            var obj = {};
            for (var i = 0; i < this.label2.length; i++) {
              if (!obj[this.label2[i].value]) {
                this.options.push(this.label2[i]);
                obj[this.label2[i].value] = true;
              }
            }
            return false;
          } else {
            this.page++;
            this.getlabrl2();
          }
        })
        .catch(error => {});
    },

    //下拉框事件
    selectChanged(value) {
      this.getuserlist();
    },
    //获取页码
    getpage(pages) {
      this.tolpage = pages;
      this.getuserlist();
    },
    //获取每页数量
    gettol(pagetol) {
      this.pagesize = pagetol;
      // this.getuserlist();
    },
    //批量操作重置
    pireset() {
      this.pivalue = "";
      this.pivalue1 = "";
    },
    //批量操作搜索
    piseachuser() {},
    //修改
    pihandleClick(inds, row) {
      if (row.statusa == false) {
        this.pitableData[inds].statusa = true;
      } else {
        this.pitableData[inds].statusa = false;
      }
      this.label = row.label;
      this.labellist.push(row);
      if (this.labellist.length <= 0) {
        this.alllabel = true;
      } else {
        this.alllabel = false;
      }
    },
    //单个操作保存
    pleClick(inds, row) {
      console.log(inds, row);
      this.datanum = inds;
      // this.alllabel = [];
      // this.labellist = [];
      this.jiaotabel(1, row);
    },
    //批量操作保存
    pidiiblea() {
      let obj = {};
      let peon = this.labellist.reduce((cur, next) => {
        obj[next.label] ? "" : (obj[next.label] = true && cur.push(next));
        return cur;
      }, []);
      if (peon.length != this.labellist.length) {
        this.$message.error("存在重复标签,请确认无误后再提交");
        return false;
      }
      this.labellist.forEach((item, index) => {
        if (item.camesd != item.label && item.statusa == true) {
          this.zlabeldata.push(item);
        }
      });
      console.log(this.labellist);
      this.jiaotabel(2, this.zlabeldata);
    },

    //批量操作取消
    pidiaibles() {
      this.goback();
    },
    //验证主标签
    jiaotabel(num, arrlist) {
      if (num == 1) {
        if (arrlist.label != "") {
          if (arrlist.label == this.label) {
            this.$message.error("您未修改信息");
            return false;
          } else {
            let parmas = new Object();
            let labelarr = [];
            labelarr.push(arrlist.label);
            parmas.data_count = 1;
            parmas.data_array = labelarr;
            check_label(parmas)
              .then(res => {
                if (res.status == 0) {
                  if (res.data.failed_count != 0) {
                    this.$message.error("主标签已存在");
                    return false;
                  } else {
                    this.setlabel(num, arrlist);
                  }
                } else {
                  this.$message.error(res.err_msg);
                  return false;
                }
              })
              .catch(error => {});
          }
        } else {
          this.setlabel(num, arrlist);
        }
      } else {
        let parmas = new Object();
        if (arrlist.length <= 0) {
          this.$message.error("您未修改信息");
          return false;
        }
        let labelarr = [];
        arrlist.forEach((item, index) => {
          labelarr.push(item.label);
        });
        parmas.data_count = arrlist.length;
        parmas.data_array = labelarr;
        check_label(parmas)
          .then(res => {
            if (res.status == 0) {
              if (res.data.failed_count != 0) {
                this.errarrs = "";
                res.data.res_data.forEach((item, index) => {
                  this.errarrs = this.errarrs.concat(item[0] + "</br>");
                });
                this.$alert(`${this.errarrs}标签已存在`, "提交信息有误", {
                  dangerouslyUseHTMLString: true
                });
                this.zlabeldata = [];
                return false;
              } else {
                this.setlabel(num, arrlist);
              }
            } else {
              this.$message.error(res.err_msg);
              return false;
            }
          })
          .catch(error => {});
      }
    },
    //后台数据操作---修改
    setlabel(num, arrlist) {
      let parmise = new Object();
      if (num == 1) {
        parmise.data_count = 1;
        let dataarr = [];
        let arr = [];
        arr.push(arrlist.dominds);
        arr.push(arrlist.label);
        arr.push(arrlist.label2 * 1);
        dataarr.push(arr);
        parmise.data_array = dataarr;
      } else {
        let dataarr = [];
        arrlist.forEach((item, index) => {
          if (item.statusa == true) {
            let arr = [];
            arr.push(item.dominds);
            arr.push(item.label);
            arr.push(item.label2 * 1);
            dataarr.push(arr);
          }
        });
        if (dataarr.length > 0) {
          parmise.data_array = dataarr;
          parmise.data_count = dataarr.length;
        } else {
          this.$message({
            message: "您暂未修改数据",
            type: "warning"
          });
          return false;
        }
      }
      modify_label(parmise)
        .then(res => {
          if (res.status == 0) {
            if (res.data.failed_count == 0) {
              this.$message.success("修改成功");
              if (parmise.data_count == 1) {
                this.pitableData[this.datanum].statusa = false;
              } else {
                this.zlabeldata = [];
                this.labellist = [];
                this.pitableData.forEach((item, index) => {
                  item.statusa = false;
                });
              }
            } else {
              this.errarr = "";
              res.data.res_data.forEach((item, index) => {
                this.errarr = this.errarr.concat(item[0] + "</br>");
              });
              this.$alert(
                `${this.errarr}修改失败`,
                res.data.failed_count + "条修改失败",
                {
                  dangerouslyUseHTMLString: true
                }
              );
            }
          }
        })
        .catch(Error => {});
    },
    // 表头样式设置
    headClass() {
      return "text-align: center;background:#F3F6FB;color:#333333;font-size:16px;";
    },
    // 表格样式设置
    rowClass() {
      return "text-align: center;";
    },
    //返回
    goback() {
      this.$router.go(-1);
    },
    //回车
    onSubmit() {
      this.getuserlist();
    }
  },
  beforeRouteLeave(to, form, next) {
    //删除缓存的数据
    sessionStorage.removeItem("tabdata");
    next();
  }
};
</script>

<style lang="scss" scoped>
.lot_operating {
  .labe_seach {
    width: auto;
    margin: auto;
    margin-left: 45px;
    margin-right: 45px;
    .seach_bottom {
      text-align: left;
      height: 100px;
      margin-top: 20px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
      border-radius: 2px;
      padding: 10px 37px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .el-select {
        width: 150px;
      }
      .seach_bottom_btn {
        margin: 10px 10px;
      }
    }
  }
  .labe_con {
    width: auto;
    height: 601px;
    margin-top: 20px;
    padding: 31px 37px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
    border-radius: 2px;
  }
  .lot_footer {
    margin-top: 32px;
    text-align: center;
  }
}
</style>
