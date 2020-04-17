<template>
  <div class="content domin_index">
    <!-- 面包屑 -->
    <div class="top_title">URL管理</div>
    <div style="margin: auto;margin-left: 45px;margin-right: 45px;">
      <!-- 搜索 -->
      <div class="seach">
        <div class="seach_top">
          <el-input
            placeholder="URL"
            v-model="input"
            class="input-with-select"
            maxlength="70"
            @keyup.enter.native="onSubmit"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" @click="seachuser()"></i>
          </el-input>
          <div
            class="seach_top_right"
            @click="option_display()"
            :class="[rotate ? 'sethui' : 'setwhile']"
          >
            筛选
            <i
              class="el-icon-caret-bottom"
              :class="[
								rotate
									? 'fa fa-arrow-down go'
									: 'fa fa-arrow-down aa'
							]"
            ></i>
          </div>
        </div>
        <div v-if="optiondisplay" class="seach_bottom">
          <span>状态：</span>
          <el-select v-model="value" placeholder="请选择" @change="getdata()">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="(item, index) in options"
              :key="index + 'reat'"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span style="margin-left: 10px;">日期：</span>
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="gettimes"
            :picker-options="pickerOptions0"
          ></el-date-picker>
          <el-button type="primary" size="mini" @click="seachuser()" style="margin-left: 10px;">确定</el-button>
          <el-button plain size="mini" @click="reset()">重置</el-button>
        </div>
      </div>
      <!-- 第二排按钮 -->
      <div class="con_lable">
        <div style="padding:10px 0 18px;display: flex;justify-content: space-between;">
          <div>
            <el-button type="primary" @click="new_btn">
              <span class="el-icon-plus"></span>
              添加URL
            </el-button>
            <el-button type="primary" plain @click="upload_btn">批量导入URL</el-button>
            <!-- <el-button type="primary" plain @click="setdomainlist">批量管理标签</el-button> -->
          </div>
        </div>
        <!-- 主体数据表格 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          stripe
          tooltip-effect="dark"
          style="width: 100%"
          :cell-style="rowClass"
          :header-cell-style="headClass"
          :default-sort="{ prop: 'date', order: 'descending' }"
          @selection-change="handleSelectionChange"
          @sort-change="tableSortChange"
        >
          >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            prop="dominds"
            label="URL"
            class-name="firsturl"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="url_name" label="视频名称"></el-table-column>
          <!-- <el-table-column prop="idstatus" label="加速">
            <template slot-scope="scope">
              <span v-if="scope.row.idstatus==0">
                <i class="el-icon-circle-check" style="color:#0abf5b;"></i>已启用
              </span>
              <span v-else>未启用</span>
            </template>
          </el-table-column>-->
          <el-table-column prop="status" label="状态" width="120">
            <template slot-scope="scope">
              <span style="color:#0ABF5B;" v-if="scope.row.status == 1">正常运行</span>
              <span style="color:#E54545;" v-else>已停止</span>
            </template>
          </el-table-column>

          <!-- <el-table-column label="标签" width="50">
            <template slot-scope="scope">
              <i class="iconfont icon-biaoqian" @click="handleClick(scope.row)"></i>
            </template>
          </el-table-column> -->
          <el-table-column prop="time_create" sortable="custom" label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.time_create | settimes }}</span>
            </template>
            >
          </el-table-column>

          <el-table-column label="操作" width="550">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">配置</el-button>
              <el-button type="text" size="small" @click="updatauser(scope.row)">复制配置</el-button>
              <el-button type="text" size="small" @click="pwdwetout(scope.row)">监控</el-button>
              <el-button
                type="text"
                size="small"
                @click="disableuser(scope.row)"
                v-if="scope.row.status == 1"
              >停用</el-button>
              <el-button type="text" size="small" @click="enableuser(scope.row)" v-else>启用</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleateuser(scope.row)"
                v-if="scope.row.status !== 1"
                style="color:#666666;"
              >删除</el-button>
              <el-button type="text" size="small" disabled v-else style="color:#c5c5c5;">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 配置弹窗 -->
        <el-dialog title="添加用户" :visible.sync="dialog" custom-class="customWidth">
          <el-form :model="details">
            <el-form-item label="使用状态" :label-width="formLabelWidth">
              <el-radio v-model="radioes" label="1" :disabled="true">启用</el-radio>
              <el-radio v-model="radioes" label="2" :disabled="true">停用</el-radio>
            </el-form-item>
            <el-form-item label="账号" :label-width="formLabelWidth">
              <el-input
                v-model="details.nickname"
                :disabled="true"
                placeholder="请输入账号"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" :label-width="formLabelWidth">
              <el-input
                v-model="details.username"
                :disabled="true"
                placeholder="请输入真实姓名"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系方式" :label-width="formLabelWidth">
              <el-input
                v-model="details.phone"
                maxlength="11"
                :disabled="true"
                placeholder="请输入有效手机号"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialog = false">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 底部按钮 -->
        <div
          style="margin-top: 20px;display: flex;justify-content: space-between;align-items: center;"
        >
          <div>
            <el-button type="text" size="small" @click="enableuser()">启用</el-button>
            <el-button type="text" style="color:#E54545;" size="small" @click="disableuser()">停用</el-button>
            <el-button type="text" size="small" @click="deleateuser()">删除</el-button>
            <!-- <el-button @click="enableuser()" type="success">启用</el-button>
            <el-button @click="disableuser()" type="warning">禁用</el-button>
            <el-button @click="deleateuser()" type="danger">删除</el-button>-->
          </div>
          <fenye
            style="float:right;margin:10px 0 20px 0;"
            @fatherMethod="getpage"
            @fathernum="gettol"
            :pagesa="total_cnt"
            :currentPage="currentPage"
          ></fenye>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fenye from "@/components/fenye";
import { dateToMs, getymdtime } from "../../servers/sevdate";
import {
  query_url,
  change_state,
  delete_url,
  getterminal
} from "../../servers/api";
export default {
  data() {
    //重置密码
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      currentPage: 1,
      multipleSelection: [],
      currentSelection: [],
      ruleForm: {
        pass: "",
        checkPass: "",
        account: ""
      },
      input: "", //搜索输入框
      value1: "",
      dialogFormVisible: false,
      zhongdisable: false,
      pimanagement: false,
      dialog: false,
      radio: "1",
      radioes: "1",
      isIndeterminate: "",
      sadioes: 1,
      pagesize: 10,
      total_cnt: 1,
      dynamicValidateForm: {
        account: "",
        nickname: "",
        pwd: "",
        conpwd: "",
        actualname: "",
        tel: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        domains: [
          {
            value: ""
          }
        ]
      },
      details: {},
      formLabelWidth: "60px",
      optiondisplay: false,
      rotate: false,
      gridData: [],
      tolpage: 1,
      chanid: "",
      options: [
        {
          value: 0,
          label: "已停止"
        },
        {
          value: 1,
          label: "正常运行"
        }
      ],

      value: "",
      pager: {
        count: 0,
        page: 1,
        rows: 100
      },
      tableData: [
        // {
        //   dominds: "http://www.baidu.com",
        //   url_name: "你好呀",
        //   label: "1",
        //   label2: "1",
        //   status: "1",
        //   time_create: "1583906243",
        //   camesd: "417860",
        //   buser_id: "518365830"
        // }
      ],
      order: 0,
      pickerOptions0: {
        shortcuts: [
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              const start =
                new Date(new Date(new Date().toLocaleDateString()).getTime()) -
                3600 * 1000 * 24 * 1;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              picker.$emit("pick", [start, end]);
            }
          }
        ],
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  filters: {
    settimes(data) {
      if (data) {
        var stat = getymdtime(data);
        return stat;
      } else {
        return data;
      }
    }
  },
  components: {
    fenye
  },
  created() {},
  mounted() {
    if (this.$cookies.get("id")) {
      this.chanid = this.$cookies.get("id") * 1;
    } else {
      this.$router.push({ path: "/" });
    }
    // this.gettoken();
    this.getuserlist();
  },
  methods: {
    //获去token列表
    gettoken() {
      this.tableData = [];
      let parmas = new Object();
      parmas.chanid = this.chanid;
      parmas.pagesize = 10;
      parmas.page = 0;
      getterminal(parmas)
        .then(res => {
          if (res.status == 0) {
            if (res.result.cols.length <= 0) {
              this.$alert("您还未添加终端，还不能操作url！", "温馨提示", {
                confirmButtonText: "去添加",
                showClose: false,
                center: true,
                callback: action => {
                  this.$router.push({
                    path: "/terminal_management"
                  });
                }
              });
            }
          }
        })
        .catch(err => {});
    },
    //排序
    tableSortChange(column) {
      this.currentPage = 1;
      if (column.order == "descending") {
        this.order = 1;
      } else {
        this.order = 0;
      }
      this.getuserlist();
    },
    //添加URL
    new_btn() {
      this.$router.push({ path: "/add_url" });
    },

    //新建用户-删除URL
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    //新建用户-添加URL
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now()
      });
    },
    //上传
    upload_btn() {
      // this.$router.push({ path: "/upload" });
      this.$router.push({ path: "/simple" });
    },
    //批量管理
    setdomainlist() {
      sessionStorage.setItem("tabdata", JSON.stringify(this.tableData));
      this.$router.push({ path: "/lot_operating" });
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.url;
    },
    getdata() {
      this.getuserlist();
    },
    //获取数据列表
    getuserlist() {
      // 已选择项
      this.updateSelection();

      let params = new Object();
      params.page = this.tolpage - 1;
      params.buser_id = this.chanid + "";
      params.url = this.input;
      params.state = this.value;
      params.order = this.order;
      if (!this.value1) {
        params.start_time = "";
        params.end_time = "";
      } else {
        params.start_time = dateToMs(this.value1[0]);
        params.end_time = dateToMs(this.value1[1]);
      }
      query_url(params)
        .then(res => {
          if (res.status == 0) {
            // this.pager.count = res.data.total;
            this.total_cnt = res.data.total;
            this.tableData = [];
            res.data.result.forEach((item, index) => {
              let obj = {};
              obj.dominds = item.url;
              obj.label = item.label;
              obj.label2 = item.label2;
              obj.status = item.state;
              obj.time_create = item.create_time;
              obj.camesd = "";
              obj.url_name = item.url_name;
              obj.buser_id = item.buser_id + "";
              this.tableData.push(obj);
            });
            if (res.total != 0) {
              res.data.result.forEach((item, index) => {
                let obj = {};
                obj.url = item.url;
              });
            }

            // 整理列表选中项
            this.formatChoosen(this.tableData);
          } else {
          }
        })
        .catch(err => {});
    },

    // 刷新已选择数组
    updateSelection() {
      if (this.currentSelection.length) {
        this.multipleSelection = this.multipleSelection.concat(
          this.currentSelection
        );
        this.currentSelection = [];
        console.log("updateSelection:", this.multipleSelection);
      }
    },
    // 整理列表选中项
    formatChoosen(arr) {
      const urlArr = this.tableData.map(item => item.dominds);
      urlArr.forEach((item, index) => {
        if (this.multipleSelection.includes(item)) {
          // 如果存在item，就在selection中删掉，再添加到currentSelection内
          const idx = this.multipleSelection.indexOf(item);
          this.multipleSelection.splice(idx, 1);
          setTimeout(() => {
            this.$refs.multipleTable.toggleRowSelection(this.tableData[index]);
          }, 200);
        }
      });
      console.log("formatChoosen--multipleSelection:", this.multipleSelection);
    },
    //多选
    handleSelectionChange(val) {
      if (val.length) {
        this.currentSelection = val.map(item => item.dominds);
      }
      console.log(this.currentSelection);
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
    //回车事件
    onSubmit() {
      this.getuserlist();
    },
    //筛选按钮
    option_display() {
      this.optiondisplay = !this.optiondisplay;
      this.rotate = !this.rotate;
    },
    //确定搜索
    seachuser() {
      this.getuserlist();
      // this.optiondisplay = false;
      // this.rotate = !this.rotate;
      // this.value = "";
      // this.input = "";
      // this.value1 = "";
    },
    //自定义事时间
    gettimes() {
      this.getuserlist();
    },
    //搜索重置
    reset() {
      this.value = "";
      this.value1 = "";
      this.input = "";
      this.getuserlist();
    },

    //配置
    handleClick(row) {
      this.$router.push({
        path: "/batch_management",
        query: { urlress: row.dominds }
      });
    },
    //复制配置
    updatauser(row) {
      this.$router.push({
        path: "/copy_configuration",
        query: { urlress: row.dominds }
      });
    },
    //监控
    pwdwetout(row) {
      console.log(row);
      this.$router.push({ path: "/resources", query: { urldata: row } });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({
            message: "密码重置成功",
            type: "success"
          });
          this.dialpwdset = false;
        } else {
          return false;
        }
      });
    },
    // 禁用
    disableuser(datalist) {
      this.$confirm("禁用后该URL将无法使用, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = new Object();
          let urllist = [];
          if (datalist) {
            urllist.push(datalist.dominds);
            urllist.push(0);
            params.data_array = [];
            params.data_array.push(urllist);
            params.data_count = 0;
          } else {
            let urllist = [];
            const arr = this.multipleSelection.concat(this.currentSelection);
            arr.forEach((item, index) => {
              let selelist = [];
              selelist.push(item);
              selelist.push(0);
              urllist.push(selelist);
            });
            params.data_array = urllist;
            params.data_count = urllist.length;
          }
          change_state(params)
            .then(res => {
              if (res.status == 0) {
                this.getuserlist();
                this.$message({
                  type: "success",
                  message: "操作成功!"
                });
              }
            })
            .catch(error => {});
        })
        .catch(eerr => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    //启用
    enableuser(datalist) {
      let params = new Object();

      let urllist = [];
      if (datalist) {
        let selelist = [];
        selelist.push(datalist.dominds);
        selelist.push(1);
        urllist.push(selelist);
        params.data_count = 0;
        params.data_array = [];
        params.data_array = urllist;
      } else {
        let urllist = [];
        const arr = this.multipleSelection.concat(this.currentSelection);
        arr.forEach((item, index) => {
          let selelist = [];
          selelist.push(item);
          selelist.push(1);
          urllist.push(selelist);
        });
        params.data_count = urllist.length;
        params.data_array = urllist;
      }

      change_state(params)
        .then(res => {
          if (res.status == 0) {
            this.getuserlist();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          }
        })
        .catch(error => {});
    },
    // 删除
    deleateuser(datalist) {
      this.$confirm("此操作将永久删除该URL, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = new Object();
          if (datalist) {
            params.data_count = 1;
            let arr = [];
            arr.push(datalist.dominds);
            params.data_array = arr;
          } else {
            const arr = this.multipleSelection.concat(this.currentSelection);
            params.data_array = arr;
            params.data_count = arr.length;
          }
          delete_url(params)
            .then(res => {
              if (res.status == 0) {
                if (res.data.failed_count == 0) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                } else {
                  this.$message({
                    type: "warning",
                    message:
                      "操作成功，共" +
                      res.data.failed_count +
                      "条数据删除失败!请检查是操作项是否处于启用状态。"
                  });
                }
                this.getuserlist();
              }
            })
            .catch(error => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 表头样式设置
    headClass() {
      return "text-align: center;background:#F3F6FB;color:#333333;font-size:16px;";
    },
    // 表格样式设置
    rowClass() {
      return "text-align: center;";
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  text-align: left;
  .seach {
    width: 100%;
    margin: 30px 0 30px 0;
    background: #ffffff;
    border-radius: 2px;
    padding: 21px 37px;
    box-shadow: 0px 0px 7px 0px rgba(41, 108, 171, 0.1);
    .seach_top {
      width: 100%;
      height: 60px;
      line-height: 60px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .input-with-select {
        width: 15%;
      }
      .seach_top_right {
        width: 80px;
        text-align: center;
        height: 36px;
        line-height: 36px;
        margin-left: 10px;
      }
    }
    .seach_bottom {
      height: 72px;
      background: rgba(242, 246, 250, 1);
      border-radius: 2px;
      display: flex;
      align-items: center;
      padding-left: 27px;
    }
  }
  .con_lable {
    width: 100%;
    background: #ffffff;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
    border-radius: 2px;
    padding: 8px 37px 0;
  }
}
</style>
