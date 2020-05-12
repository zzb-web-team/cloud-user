<template>
  <div>
    <div class="top_title">终端管理</div>
    <div class="termail_con">
      <div>
        <!-- 修改弹窗 -->
        <el-dialog
          title="设置终端名称"
          :visible.sync="dialogFormVisible"
          class="terminal_t"
          @close="handleClose1"
        >
          <el-form :model="form" ref="form">
            <el-form-item
              label="终端:"
              prop="name"
              :label-width="formLabelWidth"
              :rules="[{ validator: jiotoken, trigger: 'blur' }]"
            >
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <p>请输入您的终端名称，如爱奇艺、腾讯、土豆等</p>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="srttokensneno">取 消</el-button>
            <el-button type="primary" @click="srttokensne">确 定</el-button>
          </div>
        </el-dialog>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="终端token" name="first">
          <div
            style="background: #ffffff;padding:15px 37px 31px 37px;text-align: left;border-radius:6px;margin-left: 45px;margin-right: 45px;box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);border-radius: 2px;"
          >
            <el-button type="primary" @click="new_btn">
              <span class="el-icon-plus"></span>
              添加终端
            </el-button>
            <!-- 添加弹窗 -->

            <el-dialog title="添加终端" :visible.sync="xzteao" @close="handleClose2">
              <el-form :model="tokene" ref="tokene">
                <el-form-item
                  label="终端："
                  prop="name"
                  :label-width="formLabelWidth"
                  :rules="[
										{ validator: jiotoken, trigger: 'blur' }
									]"
                >
                  <el-input v-model="tokene.name" placeholder="英文或汉字，30 字符内" autocomplete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="类型：" :label-width="formLabelWidth">
                  <el-select v-model="tokene.region" placeholder="请选择终端类型" disabled>
                    <el-option label="ios/android" value="0"></el-option>
                    <el-option label="ios" value="1"></el-option>
                    <el-option label="android" value="2"></el-option>
                  </el-select>
                </el-form-item> -->
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="quxzteaone">取 消</el-button>
                <el-button type="primary" @click="quxzteao">确 定</el-button>
              </div>
            </el-dialog>
            <!--  -->
            <el-table
              :data="tableData"
              border
              style="width: 100%;margin-top:17px;"
              :cell-style="rowClass"
              :header-cell-style="headClass"
            >
              <el-table-column prop="id" label="终端ID" width="160"></el-table-column>
              <el-table-column prop="term" label="终端"></el-table-column>
              <!-- <el-table-column prop="type" label="终端类型"></el-table-column> -->
              <el-table-column label="token">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click.native.prevent="
											deleteRow(scope.$index, tableData)
										"
                  >
                    {{
                    scope.row.sea !== false
                    ? '收起'
                    : '查看'
                    }}
                  </el-button>
                  <div v-if="scope.row.sea !== false">
                    <p
                      @click="
												deleteRow(
													scope.$index,
													tableData
												)
											"
                    >
                      <i class="el-icon-arrow-up"></i>
                    </p>
                    <p>{{ scope.row.token }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="240">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="
											showtab(scope.$index, scope.row)
										"
                  >设置</el-button>
                  <el-button type="text" size="small" @click="dettab(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div>
              <fenye
                style="text-align:right;margin:20px 0 10px 0;"
                @fatherMethod="getpage"
                @fathernum="gettol"
                :pagesa="total_cnt"
                :currentPage="currentPage"
              ></fenye>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="SDK下载" name="second">
          <div
            class="sdk_tab"
            style="background: #ffffff;padding:31px 37px 31px 37px;text-align: left;border-radius:6px;margin-left: 45px;margin-right: 45px;box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);border-radius: 2px;"
          >
            <el-table
              :data="datadown"
              border
              style="width: 100%;"
              :default-sort="{
								prop: 'date',
								order: 'descending'
							}"
              :cell-style="rowClass"
              :header-cell-style="headClass"
              @sort-change="tableSortChange"
            >
              <el-table-column prop="type" label="终端类型"></el-table-column>
              <el-table-column label="点播">
                <el-table-column prop="mp4" label="mp4" width="80">
                  <template slot-scope="scope">
                    <i
                      v-if="scope.row.mp4 == 1"
                      class="iconfont icon-duigou"
                      style="color:#67c23a;"
                    ></i>
                  </template>
                </el-table-column>
                <el-table-column label="hls" width="80">
                  <template slot-scope="scope">
                    <i
                      v-if="scope.row.hls == 1"
                      class="iconfont icon-duigou"
                      style="color:#67c23a;"
                    ></i>
                  </template>
                </el-table-column>
                <el-table-column label="flv" width="80">
                  <template slot-scope="scope">
                    <i
                      v-if="scope.row.flv == 1"
                      class="iconfont icon-duigou"
                      style="color:#67c23a;"
                    ></i>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="version" label="版本"></el-table-column>
              <el-table-column prop="description" label="使用说明">
                <template slot-scope="scope">
                  <a :href="scope.row.description" target="_blank" v-if="scope.row.description">点击查看</a>
                </template>
              </el-table-column>
              <el-table-column prop="time_create" sortable="custom" label="更新时间" width="200">
                <template slot-scope="scope">
                  <span>
                    {{
                    scope.row.time_create | settimes
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label>
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="down(scope.row)">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div>
              <fenye
                style="text-align:right;margin:20px 0 10px 0;"
                @fatherMethod="getpage2"
                @fathernum="gettol2"
                :pagesa="total_cnt2"
                :currentPage="currentPage"
              ></fenye>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  sdklist,
  editsdk,
  addterminal,
  getterminal,
  editterminal,
  deleteterminal
} from "../../servers/api";
import { dateToMs, getymdtime } from "../../servers/sevdate";
import fenye from "@/components/fenye";
export default {
  data() {
    return {
      currentPage: 1,
      activeName: "first",
      dialogFormVisible: false,
      xzteao: false,
      formLabelWidth: "80px",
      les_count: "", //剩余sdk数量
      page: 0, //页码
      tolpage: 1,
      pagesize: 10,
      total_cnt: 1,
      page2: 0, //页码
      tolpage2: 1,
      pagesize2: 10,
      total_cnt2: 1,
      chanid: "",
      order: "id desc",
      form: {
        name: "",
        id: ""
      },
      tokene: {
        name: "",
        region: "0"
      },
      tableData: [],
      datadown: [],
      spanArr: []
    };
  },
  components: {
    fenye
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
  mounted() {
    if (this.$cookies.get("id")) {
      this.chanid = this.$cookies.get("id") * 1;
    } else {
      this.$router.push({ path: "/" });
    }
    this.getsdklist();
    this.gettoken();
  },
  methods: {
    //获取页码
    getpage(pages) {
      this.tolpage = pages;
      this.gettoken();
    },
    //获取每页数量
    gettol(pagetol) {
      if (this.tolpage < 1) {
        this.tolpage = 1;
      }
      this.pagesize = pagetol;
      this.gettoken();
    },
    //获取页码
    getpage2(pages) {
      this.tolpage2 = pages;
      this.getsdklist();
    },
    //获取每页数量
    gettol2(pagetol) {
      if (this.tolpage2 < 1) {
        this.tolpage2 = 1;
      }
      this.pagesize2 = pagetol;
      this.getsdklist();
    },
    //获取数据--sdk列表
    getsdklist() {
      let parmas = new Object();
      parmas.page = this.tolpage2 - 1;
      parmas.search = "";
      parmas.type = "";
      parmas.start_ts = "";
      parmas.end_ts = "";
      parmas.order = this.order;
      sdklist(parmas)
        .then(res => {
          if (res.status == 0) {
            this.datadown = [];
            this.tolpage2 = res.result.page;
            if (res.result.cols.length > 0) {
              this.total_cnt2 =
                res.result.les_count +
                res.result.cols.length +
                res.result.page * this.pagesize2;
              res.result.cols.forEach((item, index) => {
                let sdkobj = new Object();
                if (item.content.indexOf("mp4") != -1) {
                  sdkobj.mp4 = 1;
                } else {
                  sdkobj.mp4 = 0;
                }
                if (item.content.indexOf("flv") != -1) {
                  sdkobj.flv = 1;
                } else {
                  sdkobj.flv = 0;
                }
                if (item.content.indexOf("hls") != -1) {
                  sdkobj.hls = 1;
                } else {
                  sdkobj.hls = 0;
                }
                sdkobj.url = item.url;
                sdkobj.type = item.type;
                sdkobj.version = item.version;
                sdkobj.time_create = item.time_create;
                sdkobj.description = item.description;
                this.datadown.push(sdkobj);
              });
              this.page = res.result.page;
              this.les_count = res.result.les_count;
            }
          }
        })
        .catch(err => {});
    },
    //获去token列表
    gettoken() {
      this.tableData = [];
      let parmas = new Object();
      parmas.chanid = this.chanid;
      parmas.pagesize = this.pagesize;
      parmas.page = this.tolpage - 1;
      getterminal(parmas)
        .then(res => {
          if (res.status == 0) {
            // this.tolpage = res.result.page;
            if (res.result.cols.length > 0) {
              this.total_cnt =
                res.result.les_count +
                res.result.cols.length +
                res.result.page * this.pagesize;
              res.result.cols.forEach((item, index) => {
                let obj = {};
                obj.term = item.name;
                obj.type = item.type;
                obj.token = item.token;
                obj.sea = false;
                obj.id = item.id;
                this.tableData.push(obj);
              });
            }
          }
        })
        .catch(err => {});
    },
    //下载
    down(data) {
      window.location.href = data.url;
    },
    //处理数据（数据中处理完成之后才能合并）
    cdata() {
      let contactDot = 0;
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
        } else {
          if (item.term === this.tableData[index - 1].term) {
            this.spanArr[contactDot] += 1;
            this.spanArr.push(0);
          } else {
            contactDot = index;
            this.spanArr.push(1);
          }
        }
      });
    },
    //排序
    tableSortChange(column) {
      this.tolpage2 = 1;
      if (column.order == "descending") {
        this.order = "id desc";
      } else {
        this.order = "id asc";
      }
      this.getsdklist();
    },
    //合并表格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      } else if (columnIndex === 3) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    //添加token
    new_btn() {
      this.tokene.name = "";
      this.xzteao = true;
    },
    //添加终端--确定
    quxzteao() {
      this.$refs.tokene.validate(valid => {
        if (valid) {
          this.xzteao = false;
          let parmas = new Object();
          parmas.chanid = this.chanid;
          parmas.name = this.tokene.name;
          if (this.tokene.region == 0) {
            parmas.type = "android/ios";
          } else if (this.tokene.region == 1) {
            parmas.type = "ios";
          } else {
            parmas.type = "android";
          }
          addterminal(parmas)
            .then(res => {
              if (res.status == 0) {
                this.$message.success("添加成功");
                this.gettoken();
              } else {
                try {
                  this.$message.error(res.err_msg);
                } catch (error) {
                  this.$message.error(res.msg);
                }
                this.gettoken();
              }
            })
            .catch(err => {});
        }
      });
    },
    //修改--关闭按钮
    handleClose1() {
      this.srttokensneno();
    },

    //添加--关闭按钮
    handleClose2() {
      this.quxzteaone();
    },
    //终端--取消
    quxzteaone() {
      this.xzteao = false;
      this.$refs.tokene.resetFields();
    },
    handleClick(tab, event) {},
    // 表头样式设置
    headClass() {
      return "text-align: center;background:#F3F6FB;color:#666666;";
    },
    // 表格样式设置
    rowClass() {
      return "text-align: center;color:#666666;";
    },
    //详情
    deleteRow(index, rows) {
      if (this.tableData[index].sea === false) {
        this.tableData[index].sea = true;
      } else {
        this.tableData[index].sea = false;
      }
    },
    deletesdk(index, rows) {
      if (this.datadown[index].sea === false) {
        this.datadown[index].sea = true;
      } else {
        this.datadown[index].sea = false;
      }
    },
    //设置
    showtab(index, row) {
      this.form.name = "";
      this.form.id = "";
      this.dialogFormVisible = true;
      this.form.name = this.tableData[index].term;
      this.form.id = this.tableData[index].id;
      // this.tableData[index].term = this.form.name;
    },
    //设置确定
    srttokensne() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          let parmas = new Object();
          parmas.id = this.form.id;
          parmas.name = this.form.name;
          editterminal(parmas)
            .then(res => {
              this.gettoken();
            })
            .catch(err => {});
        }
      });
    },
    //设置取消
    srttokensneno() {
      this.dialogFormVisible = false;
      this.$refs.form.resetFields();
    },
    //删除
    dettab(index, row) {
        console.log(row);
      let parmas = new Object();
      parmas.id = row.id;
      parmas.chanid = this.chanid;
      parmas.token = row.token;
      deleteterminal(parmas)
        .then(res => {
          if (res.status == 0) {
            this.$message.success("删除成功");
          }
          this.gettoken();
        })
        .catch(err => {});
    },
    getBLen(str) {
      if (str == null) return 0;
      if (typeof str != "string") {
        str += "";
      }
      return str.replace(/[^\x00-\xff]/g, "01").length;
    },
    jiotoken(rule, value, callback) {
      if (value === "") {
        callback(new Error("终端名称不能为空"));
      } else {
        let tokendata = /^[\u4e00-\u9fa5A-Za-z0-9]{1,30}$/;
        if (tokendata.test(value) === false) {
          callback(new Error("终端名称格式错误"));
        } else if (this.getBLen(value) > 30) {
          callback(new Error("终端名称长度不能超过30字符"));
        } else {
          callback();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
