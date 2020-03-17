<template>
  <div class="content bath_m">
    <div class="top_title">
      <span @click="goback" style="font-size: 24px;color: #202020;">
        <i
          class="el-icon-arrow-left"
          style="color:#297AFF;font-size: 18px;margin-right:23px;font-weight: 600;"
        ></i>
        配置
      </span>
    </div>
    <div
      class="bath"
      style="width:auto;margin: auto;background: #ffffff;margin-top: 25px;border-radius: 2px;padding: 37px;box-shadow:0px 2px 3px 0px rgba(6,17,36,0.14);margin-right:45px;margin-left:45px;"
    >
      <el-tabs
        :tab-position="tabPosition"
        v-model="oneName"
        @tab-click="handleClick"
        v-loading="loading"
      >
        <div class="tala_title">
          <span
            style="max-width: 230px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
          >{{ datalist.url }}</span>
          <div>
            <el-button
              class="pei_ting"
              v-if="datalist.state == 1"
              @click="disableuser(0)"
              style="background:#E05050;color:#ffffff;height:34px;line-height: 10px;"
            >停用</el-button>
            <el-button
              class="pei_ting"
              v-else
              @click="disableuser(1)"
              style="background:#0ABF5B;color:#ffffff;height:34px;line-height: 10px;"
            >启用</el-button>
            <!-- <el-button
              @click="setquery_url()"
              style="background:#0ABF5B;color:#ffffff;width:76px;height:34px;line-height: 10px;"
              >保存</el-button
            >-->
          </div>
        </div>
        <el-tab-pane name="zero">
          <p class="bath_title_btn" slot="label">
            <i class="el-icon-arrow-left"></i>返回URL列表
          </p>
        </el-tab-pane>
        <el-tab-pane label="基础配置" name="one">
          <div style="font-weight: 600;font-size: 18px;text-align: left;margin: 10px 0;">基础信息</div>
          <ol class="tala">
            <li>
              <span>创建时间</span>
              <span class="tala_con">{{ datalist.create_time | settimes }}</span>
            </li>
            <li>
              <span>URL地址</span>
              <span
                class="tala_con"
                style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
              >{{ datalist.url }}</span>
              <span style="color: rgb(64, 158, 255);" @click="cleckurl">查看</span>
            </li>
            <!--  -->

            <el-dialog title="url" :visible.sync="zurl" width="30%">
              <span>{{ sleckurl }}</span>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="zurl = false">确 定</el-button>
              </span>
            </el-dialog>

            <li>
              <span>视频终端</span>
              <el-select v-model="datalist.label2" placeholder="请选择" :disabled="!fas">
                <!-- <el-option label="未配置" value="0"></el-option> -->
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  class="tala_con"
                ></el-option>
              </el-select>
              <span class="tala_x" @click="fsho">
                {{
                fas == false
                ? datalist.label2 != ''
                ? '修改'
                : '设置'
                : '确定'
                }}
              </span>
            </li>
            <!--  -->
            <li>
              <span>标签</span>
              <span class="tala_con" v-if="!xas">
                {{
                datalist.label
                }}
              </span>
              <el-input v-model="datalist.label" placeholder="请输入主标签" v-else style="width:23%;"></el-input>
              <span class="tala_x" @click="xsho">
                {{
                xas == false
                ? datalist.label != ''
                ? '修改'
                : '设置'
                : '确定'
                }}
              </span>
            </li>
          </ol>
        </el-tab-pane>
        <el-tab-pane label="回源配置" name="two">
          <div class="talb">
            <div style="font-weight: 600;font-size: 18px;text-align: left;margin: 10px 0;">回源HOST</div>
            <div class="talb_title_tio">
              <span>回源HOST</span>
              <div>
                <el-switch
                  v-model="datalist.host_url.valid"
                  active-color="#13ce66"
                  inactive-color="#EEEEEE"
                  @change="changeSwitch"
                ></el-switch>
                <p>自定义CDN节点回源过程中所需访问的WEB服务器URL</p>
              </div>
            </div>
            <div v-show="urlno == true">
              <div class="talb_title_two">
                <span>回源URL地址</span>
                <span
                  style="max-width:160px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                >URL：{{ datalist.host_url.url }}</span>
                <span class="tala_x" @click="xzurl">修改</span>
              </div>
            </div>
            <!-- 回源弹窗 -->
            <el-dialog
              title="请输入回源URL地址"
              :visible.sync="dialogVisible"
              width="630px"
              @close="handleClose1"
            >
              <el-form
                :model="huiurl"
                ref="hosturlref"
                label-width="100px"
                class="bath_demo_dynamic"
              >
                <el-form-item
                  prop="url"
                  label="回源地址"
                  :rules="[
										{ validator: jiourl, trigger: 'blur' }
									]"
                >
                  <el-input v-model="huiurl.url" placeholder="请输入回源URL地址"></el-input>
                </el-form-item>
              </el-form>

              <!-- 分割 -->
              <el-button @click="nohosturl('hosturlref')">取 消</el-button>
              <el-button type="primary" @click="hosturl('hosturlref')">确 定</el-button>
            </el-dialog>
          </div>
        </el-tab-pane>

        <el-tab-pane label="缓存配置" name="there">
          <el-tabs v-model="activeName">
            <el-tab-pane label="缓存设置" name="first">
              <div class="talb_title_tio">
                <span>缓存自动刷新</span>
                <div>
                  <el-switch
                    v-model="valueh"
                    active-color="#13ce66"
                    inactive-color="#EEEEEE"
                    @change="changeSwitch2"
                  ></el-switch>
                  <p>开启后，能够自动发现加速节点的同名缓存刷新，并自动同步最新缓存</p>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="缓存过期时间" name="second">
              <!--  -->
              <div class="batch_huan">
                <div style="text-align:left;padding: 10px 0">
                  <el-button
                    type="primary"
                    style="width:100px;"
                    @click="
											huanVisible = true;
											edit = 0;
											editnum = '';
											city_disabled = false;
											radio1 = '自动过期';
										"
                  >
                    <span class="el-icon-plus"></span>配置
                  </el-button>
                </div>
                <!-- 缓存添加弹窗 -->
                <el-dialog title="配置缓存过期时间" :visible.sync="huanVisible">
                  <el-form :model="huanform">
                    <el-form-item
                      label="过期类型:"
                      style="text-align:left;"
                      :label-width="formLabelWidth"
                    >
                      <el-radio-group v-model="radio1" @change="selecttime()" class="huandan">
                        <el-radio-button label="自动过期"></el-radio-button>
                        <el-radio-button label="自定义时间"></el-radio-button>
                      </el-radio-group>
                      <p
                        v-if="automatic_time == true"
                        style="font-size: 12px;color: #676767;height: 18px;"
                      >当URL失去热度时缓存将自动过期</p>
                    </el-form-item>
                    <el-form-item
                      label="区域:"
                      style="text-align:left;"
                      :label-width="formLabelWidth"
                      class="huancunoption"
                    >
                      <el-cascader
                        :options="citylist1"
                        ref="cascaderAddr"
                        v-model="citylabel"
                        :disabled="city_disabled"
                      ></el-cascader>
                    </el-form-item>
                    <el-form-item
                      class="huancuntime"
                      label="过期时间:"
                      :label-width="formLabelWidth"
                      style="text-align:left;"
                      v-if="automatic_time == false"
                    >
                      <el-date-picker
                        v-model="huanfo"
                        type="datetime"
                        style="width:100%;"
                        align="right"
                        placeholder="选择日期时间"
                        :picker-options="pickerOptions0"
                      ></el-date-picker>
                      <p style="font-size: 12px;color: #676767;height: 18px;">最长过期时间为三年</p>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="huanno">取 消</el-button>
                    <el-button type="primary" @click="huanVisib()">确 定</el-button>
                  </div>
                </el-dialog>

                <el-table
                  :data="datalist.cache_con"
                  border
                  height="580"
                  :cell-style="rowClass"
                  :header-cell-style="headClass"
                >
                  <el-table-column prop="area" label="区域"></el-table-column>
                  <el-table-column prop="province" label="城市"></el-table-column>
                  <el-table-column prop="expire" label="过期时间">
                    <template slot-scope="scope">
                      <span v-if="scope.row.type == 0">自动过期</span>
                      <span v-else>
                        {{
                        scope.row.expire | settimes
                        }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="state" label="状态">
                    <template slot-scope="scope">
                      <span>
                        {{
                        scope.row.state == 0
                        ? '缓存中'
                        : '已过期'
                        }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        @click="
													xhuanVisib(
														scope.row,
														scope.$index
													)
												"
                        type="text"
                        size="small"
                      >修改</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="自定义页面" name="four">
          <div style="text-align: left;margin: 15px 0;" class="customize">
            <el-button type="primary" style="width:100px;" @click="dialogFormVisible = true">
              <span class="el-icon-plus"></span>添加
            </el-button>
            <!-- 添加弹窗 -->
            <el-dialog title="自定义错误码" :visible.sync="dialogFormVisible" @close="handleClick4">
              <el-form :model="form" ref="form">
                <el-form-item
                  label="错误码"
                  prop="errCode"
                  :label-width="formLabelWidth"
                  :rules="[
										{
											validator: jioerrcode,
											trigger: 'blur'
										}
									]"
                >
                  <el-input
                    v-model.number="form.errCode"
                    placeholder="请输入三位数字错误码，如（105，403）"
                    autocomplete="off"
                    maxlength="3"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="链接地址"
                  :label-width="formLabelWidth"
                  prop="url"
                  :rules="[
										{ validator: jiourl, trigger: 'blur' }
									]"
                >
                  <el-input v-model="form.url" placeholder="请输入URL" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="zareno('form')">取 消</el-button>
                <el-button type="primary" @click="zareVisible('form')">确 定</el-button>
              </div>
            </el-dialog>
          </div>

          <div class="pei_zhi_tabel">
            <el-table
              :data="datalist.custom_page"
              stripe
              style="width: 100%"
              height="580"
              :cell-style="rowClass"
              :header-cell-style="headClass"
            >
              <el-table-column prop="errCode" label="错误码"></el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <span style="color:#E54545" v-if="scope.row.state == 1">已停止</span>
                  <span style="color:#0ABF5B" v-else>启动中</span>
                </template>
              </el-table-column>
              <el-table-column prop="url" label="链接" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="zidingyi(scope.$index)" type="text" size="small">
                    {{
                    scope.row.state == 1
                    ? '启动'
                    : '停止'
                    }}
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    style="color:#000000"
                    @click="delzi(scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import {
  query_url,
  query_config,
  config_url,
  change_state,
  getterminal,
  check_label
} from "../../servers/api";
import { dateToMs, getymdtime, setbatime } from "../../servers/sevdate";
export default {
  inject: ["reload"],
  data() {
    return {
      city_disabled: false,
      loading: false,
      huiurl: { url: "" },
      setstate: false,
      sleckurl: "",
      urlname: "",
      edit: 0,
      radio1: "自动过期",
      editnum: "",
      tabPosition: "left",
      zurl: false,
      xas: false,
      fas: false,
      dialogVisible: false,
      huanVisible: false,
      urlno: false,
      dialogFormVisible: false,
      optiondisplay: false,
      rotate: false,
      oneName: "one",
      host_input: "",
      host_state: "",
      host_time: "",
      activeName: "first",
      formLabelWidth: "100px",
      oldlabel: "",
      huancun: [],
      citylist1: [
        {
          value: "华北",
          label: "华北",
          children: [
            {
              value: "北京",
              label: "北京"
            },
            {
              value: "内蒙古",
              label: "内蒙古"
            },
            {
              value: "山西",
              label: "山西"
            },
            {
              value: "河北",
              label: "河北"
            },
            {
              value: "天津",
              label: "天津"
            }
          ]
        },
        {
          value: "西北",
          label: "西北",
          children: [
            {
              value: "宁夏",
              label: "宁夏"
            },
            {
              value: "陕西",
              label: "陕西"
            },
            {
              value: "甘肃",
              label: "甘肃"
            },
            {
              value: "青海",
              label: "青海"
            },
            {
              value: "新疆",
              label: "新疆"
            }
          ]
        },
        {
          value: "东北",
          label: "东北",
          children: [
            {
              value: "黑龙江",
              label: "黑龙江"
            },
            {
              value: "吉林",
              label: "吉林"
            },
            {
              value: "辽宁",
              label: "辽宁"
            }
          ]
        },
        {
          value: "华东",
          label: "华东",
          children: [
            {
              value: "福建",
              label: "福建"
            },
            {
              value: "江苏",
              label: "江苏"
            },
            {
              value: "安徽",
              label: "安徽"
            },
            {
              value: "山东",
              label: "山东"
            },
            {
              value: "上海",
              label: "上海"
            },
            {
              value: "浙江",
              label: "浙江"
            }
          ]
        },
        {
          value: "华中",
          label: "华中",
          children: [
            {
              value: "河南",
              label: "河南"
            },
            {
              value: "湖北",
              label: "湖北"
            },
            {
              value: "江西",
              label: "江西"
            },
            {
              value: "湖南",
              label: "湖南"
            }
          ]
        },
        {
          value: "西南",
          label: "西南",
          children: [
            {
              value: "贵州",
              label: "贵州"
            },
            {
              value: "云南",
              label: "云南"
            },
            {
              value: "重庆",
              label: "重庆"
            },
            {
              value: "四川",
              label: "四川"
            },
            {
              value: "西藏",
              label: "西藏"
            }
          ]
        },
        {
          value: "华南",
          label: "华南",
          children: [
            {
              value: "广东",
              label: "广东"
            },
            {
              value: "广西",
              label: "广西"
            },
            {
              value: "海南",
              label: "海南"
            }
          ]
        },
        {
          value: "其他",
          label: "其他",
          children: [
            {
              value: "香港",
              label: "香港"
            },
            {
              value: "澳门",
              label: "澳门"
            },
            {
              value: "台湾",
              label: "台湾"
            }
          ]
        }
      ],
      dynamicValidateForm: {
        email: "1212"
      },
      mv1: "",
      mv2: "",
      form: {
        errCode: "",
        url: "",
        state: 0
      },
      huanform: {
        type: 0,
        area: "",
        province: "",
        expire: 0,
        state: 0
      },
      options: [
        {
          value: 0,
          label: "0"
        },
        {
          value: 1,
          label: "1"
        }
      ],
      label2: [],
      hostoptions: [
        {
          value: 0,
          label: "缓存中"
        },
        {
          value: 1,
          label: "已过期"
        }
      ],
      tableData: [],
      valuek: false,
      valueh: false,
      datalist: {
        url: "",
        label: "",
        create_time: "",
        label2: 0,
        state: 0,
        host_url: {},
        cache_con: [],
        custom_page: []
      },
      page: 0,
      chanid: "",
      huanfo: "",
      automatic_time: true,
      pickerOptions0: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "明天",
            onClick(picker) {
              const date = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周后",
            onClick(picker) {
              const date = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一年后",
            onClick(picker) {
              const date = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 365);
              picker.$emit("pick", date);
            }
          },
          {
            text: "三年后",
            onClick(picker) {
              const date = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 365 * 3);
              picker.$emit("pick", date);
            }
          }
        ],
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
      citylabel: ["华北", "北京"]
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
  mounted() {
    if (this.$cookies.get("id")) {
      this.chanid = this.$cookies.get("id") * 1;
    } else {
      this.$router.push({ path: "/" });
    }
    this.urlname = this.$route.query.urlress;
    if (this.$route.query.tabpne) {
      if (this.$route.query.tabpne == "second") {
        this.oneName = "there";
        this.activeName = "second";
      } else {
        this.oneName = this.$route.query.tabpne;
        this.activeName = "second";
      }
    }
    this.label2 = [];
    this.options = [];
    this.getqueryurl();
    this.getlabrl2();
  },
  methods: {
    //查看url
    cleckurl() {
      this.zurl = true;
      this.sleckurl = this.datalist.url;
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
    //获取配置信息--
    getqueryurl() {
      let parmas = new Object();
      parmas.url = this.urlname;
      parmas.page = 0;
      parmas.buser_id = this.chanid + "";
      query_url(parmas)
        .then(res => {
          console.log(res);
          this.datalist.create_time = res.data.result[0].create_time;
          this.datalist.url = res.data.result[0].url;
          this.datalist.label = res.data.result[0].label;
          this.oldlabel = res.data.result[0].label;
          this.datalist.label2 = res.data.result[0].label2;
          this.datalist.state = res.data.result[0].state;
          this.geturlconfig();
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取配置信息--详细信息
    geturlconfig() {
      let parmas = new Object();
      parmas.url = this.urlname;
      parmas.type = 0;
      query_config(parmas)
        .then(res => {
          //回源参数
          this.datalist.host_url.url = res.data.data.host_url.url;
          if (res.data.data.host_url.valid == 0) {
            this.datalist.host_url.valid = false;
            //回源状态
            this.valuek = false;
            this.urlno = false;
          } else {
            this.datalist.host_url.valid = true;
            this.valuek = true;
            this.urlno = true;
          }
          //缓存参数
          let concash = {};
          if (res.data.data.cache_config.valid == 0) {
            //缓存状态
            concash.valid = false;
            this.valueh = false;
          } else {
            concash.valid = true;
            this.valueh = true;
          }
          this.datalist.cache_con = res.data.data.cache_config.data;
          this.datalist.custom_page = res.data.data.custom_page;
        })
        .catch(err => {});
    },
    //修改url
    setquery_url() {
      this.loading = false;
      if (this.datalist.label) {
        if (this.oldlabel !== this.datalist.label) {
          let adminlanel = new Object();
          let labelarr = [];
          labelarr.push(this.datalist.label);
          adminlanel.data_count = 1;
          adminlanel.data_array = labelarr;
          check_label(adminlanel)
            .then(res => {
              if (res.status == 0) {
                if (res.data.success_count == 0) {
                  this.$message.error("主标签已存在");
                  return false;
                } else {
                  this.updateurl();
                }
              }
              return false;
            })
            .catch(error => {});
        } else {
          this.updateurl();
        }
      } else {
        this.updateurl();
      }
    },
    updateurl() {
      let parmas = new Object();
      let natobj = {};
      natobj.url = this.datalist.url;
      natobj.label = this.datalist.label;
      natobj.label2 = this.datalist.label2;
      natobj.host_url = new Object();
      natobj.cache_config = new Object();
      natobj.custom_page = [];
      if (this.valuek == false) {
        natobj.host_url.valid = 0;
      } else {
        natobj.host_url.valid = 1;
      }
      natobj.host_url.url = this.datalist.host_url.url;
      if (this.valueh == false) {
        natobj.cache_config.valid = 0;
      } else {
        natobj.cache_config.valid = 1;
      }
      if (this.valueh == false) {
        natobj.cache_config.valid = 0;
      } else {
        natobj.cache_config.valid = 1;
      }
      natobj.cache_config.data = this.datalist.cache_con;
      natobj.custom_page = this.datalist.custom_page;
      parmas.data_array = [];
      parmas.data_array.push(natobj);
      parmas.data_count = 1;
      config_url(parmas)
        .then(res => {
          this.getqueryurl();
          if (res.status == 0) {
            this.$message.success("配置成功");
            // setTimeout(() => {
            //   this.$router.push({ path: "/domain_management" });
            // }, 1000);
          }
        })
        .catch(err => {});
    },
    //停用
    disableuser(state) {
      let messagetext = "";
      if (state == 0) {
        messagetext = "停用后该URL将无法使用, 是否继续?";
      } else {
        messagetext = "启用该URL?";
      }
      this.$confirm(messagetext, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = new Object();
          let urllist = [];
          urllist.push(this.urlname);
          urllist.push(state);
          params.data_array = [];
          params.data_array.push(urllist);
          params.data_count = 0;
          change_state(params)
            .then(res => {
              if (res.status == 0) {
                this.getqueryurl();
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
    //返回
    goback() {
      this.$router.go(-1);
    },
    //修改主标签
    xsho() {
      this.xas = !this.xas;
      if (this.xas == false) {
        this.setquery_url();
      }
    },
    //修改视频终端
    fsho() {
      this.fas = !this.fas;
      if (this.fas == false) {
        this.setquery_url();
      }
    },
    //修改回源配置-主
    xzurl() {
      this.dialogVisible = true;
      if (this.datalist.host_url.url) {
        this.huiurl.url = this.datalist.host_url.url;
      }
    },
    //修改回源配置-副
    xfurl(data) {},
    //添加回源信息--确定
    hosturl(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.datalist.host_url.valid = true;
          this.valuek = true;
          this.urlno = true;
          this.datalist.host_url.url = this.huiurl.url;
          this.dialogVisible = false;
        }
        this.setquery_url();
      });
    },
    //添加回源信息--取消
    nohosturl(formName) {
      this.dialogVisible = false;
      this.valuek = false;
      this.datalist.host_url.valid = false;
      this.urlno = false;
      this.$refs[formName].resetFields();
    },
    //关闭按钮
    handleClose1() {
      this.nohosturl("hosturlref");
    },
    //删除回源地址
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    //添加回源地址
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now()
      });
    },
    handleClick(tab, event) {
      if (tab.name == "zero") {
        this.$router.push({ path: "/domain_management" });
      }
    },
    //自定义停止/启动
    zidingyi(dats) {
      if (this.datalist.custom_page[dats].state == 0) {
        this.datalist.custom_page[dats].state = 1;
      } else {
        this.datalist.custom_page[dats].state = 0;
      }
      this.setquery_url();
    },
    //删除自定义状态
    delzi(dats) {
      this.datalist.custom_page.splice(dats, 1);
      this.setquery_url();
    },
    changeSwitch() {
      this.valuek = !this.valuek;
      if (this.valuek == true) {
        this.urlno = true;
        this.dialogVisible = true;
        if (this.datalist.host_url.url) {
          this.huiurl.url = this.datalist.host_url.url;
        }
      } else {
        this.urlno = false;
        this.dialogVisible = false;
        this.setquery_url();
      }
    },
    changeSwitch2() {
      this.setquery_url();
    },
    //缓存-修改
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
    //修改缓存
    xhuanVisib(data, num) {
      this.city_disabled = true;
      this.citylabel = [data["area"], data["province"]];
      if (data["type"] == 1) {
        this.radio1 = "自定义时间";
        this.automatic_time = false;
        this.huanfo = new Date(parseInt(data["expire"] * 1000, 10));
      } else {
        this.radio1 = "自动过期";
        this.automatic_time = true;
      }
      this.edit = 1;
      this.editnum = num;
      this.huanform = {};
      this.huanform.type = data["type"];
      this.huanform.area = data["area"];
      this.huanform.province = data["province"];
      this.huanform.expire = data["expire"];
      this.huanform.state = data["state"];
      this.huanVisible = true;
    },
    selecttime() {
      if (this.radio1 == "自动过期") {
        this.automatic();
      } else {
        this.customize();
      }
    },
    //添加缓存--自动过期
    automatic() {
      this.automatic_time = true;
      this.huanform.type = 0;
      this.huanform.state = 0;
    },
    //添加缓存--自定义过期时间
    customize() {
      this.automatic_time = false;
      this.huanform.type = 1;
      this.huanform.state = 0;
    },
    //添加缓存--确定
    huanVisib() {
      this.loading = true;
      if (!this.huanfo) {
        this.huanform.expire = 0;
      } else {
        this.huanform.expire = dateToMs(this.huanfo);
      }
      if (this.citylabel.length < 2) {
        this.$message.error("请选择区域");
        return false;
      }
      this.huanform.area = this.citylabel[0];
      this.huanform.province = this.citylabel[1];
      if (this.edit == 1) {
        //添加缓存配置
        if (this.huanform.type == 0) {
          this.huanform.expire = 0;
        } else {
          if (this.huanform.expire <= 0) {
            this.$message.error("请选择过期时间");
            return false;
          }
        }
        let temp = Object.assign({}, this.huanform);
        this.datalist.cache_con[this.editnum] = temp;
      } else {
        //修改缓存配置
        if (this.huanform.type == 0) {
          this.huanform.expire = 0;
        } else {
          if (this.huanform.expire <= 0) {
            this.$message.error("请选择过期时间");
            return false;
          }
        }
        let temp = Object.assign({}, this.huanform);
        this.datalist.cache_con.push(temp);
      }
      this.huanVisible = false;
      this.citylabel = [];
      this.huanfo = "";
      this.automatic_time = true;
      setTimeout(() => {
        this.setquery_url();

        //this.reload();
      }, 1000);
    },
    //添加缓存--取消
    huanno() {
      this.radio1 = "自动过期";
      this.huanfo = "";
      this.citylabel = [];
      this.huanVisible = false;
    },
    //删除缓存
    delhc(data, num) {
      this.datalist.cache_con.splice(num, 1);
    },
    //自定义添加状态码--确定
    zareVisible(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let errobj = {};
          errobj.errCode = this.form.errCode;
          errobj.url = this.form.url;
          errobj.state = this.form.state;
          this.datalist.custom_page.push(errobj);
          this.dialogFormVisible = false;
          this.setquery_url();
          this.form.url = "";
          this.form.errCode = "";
        }
      });
    },
    //自定义添加状态码--取消
    zareno(formName) {
      this.form.url = "";
      this.form.errCode = "";
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    //自定义添加状态码--关闭按钮
    handleClick4() {
      this.zareno("form");
    },
    //校验url
    jiourl(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入URL"));
      } else {
        var resyzm = /^http(s)?:\/\/[^\u4e00-\u9fa5]{1,1020}$/;
        if (resyzm.test(value) === false) {
          callback(new Error("URL格式错误"));
        } else {
          callback();
        }
      }
    },
    //校验错误码
    jioerrcode(rule, value, callback) {
      if (value == "") {
        callback(new Error("请输入错误码"));
      } else {
        var reserrcode = /^\d{3}$/;
        if (reserrcode.test(value) === false) {
          callback(new Error("错误码格式错误"));
        } else {
          callback();
        }
      }
    },
    //筛选按钮
    option_display() {
      this.optiondisplay = !this.optiondisplay;
      this.rotate = !this.rotate;
    },
    //缓存过期时间--回车搜索
    onSubmit() {},
    //缓存过期时间--搜索--确定
    seachuserhost() {},
    //缓存过期时间--搜索--重置
    hostreset() {
      this.host_input = "";
      this.host_state = "";
      this.host_time = "";
    },
    //缓存过期时间--搜索--自定义时间
    hostgettimes(val) {},
    //自定义事时间
    gettimes() {},
    // 表头样式设置
    headClass() {
      return "text-align: center;background:#F3F6FB;";
    },
    // 表格样式设置
    rowClass() {
      return "text-align: center;";
    }
  },
  beforeRouteLeave(to, form, next) {
    sessionStorage.removeItem("tabPosition");
    sessionStorage.removeItem("activeName");
    next();
  }
};
</script>

<style lang="scss" scoped>
.content {
  // width: 1240px;
  // margin: auto;
  // padding: 19px;
  // margin-top: 34px;
  // background: #ffffff;
  .bath_title_btn {
    font-size: 16px;
    i {
      font-size: 16px;
      font-weight: 600;
      margin-right: 5px;
    }
  }
  .tala_title {
    height: 50px;
    line-height: 50px;
    // background: #eeeeee;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      color: #333333;
      font-size: 18px;
      font-weight: 600;
    }
  }
  .tala {
    li {
      height: 50px;
      // line-height: 50px;
      text-align: left;
      span {
        display: inline-block;
        margin-right: 25px;
        width: 60px;
      }
      .tala_con {
        display: inline-block;
        width: 200px;
      }
    }
  }
  .tala_x {
    margin-left: 10px;
    color: rgb(64, 158, 255);
  }
  .talb_title_tio {
    text-align: left;
    display: flex;
    span {
      margin-right: 45px;
    }
  }
  .talb_title_two {
    text-align: left;
    display: flex;
    margin: 15px 0;
    span {
      margin-right: 30px;
    }
  }
}
.seach {
  width: 100%;
  background: #ffffff;
  // margin: 30px 0 30px 0;
  // border-radius: 2px;
  // padding: 21px 37px;
  // box-shadow: 0px 0px 7px 0px rgba(41, 108, 171, 0.1);
  .seach_top {
    width: 100%;
    height: 60px;
    line-height: 60px;
    // display: flex;
    // align-items: center;
    .input-with-select {
      width: 20%;
      float: left;
    }
    .seach_top_right {
      float: left;
      width: 80px;
      text-align: center;
      height: 40px;
      margin-top: 10px;
      line-height: 40px;
      margin-left: 10px;
    }
  }
  .seach_hui {
    background: rgba(242, 246, 250, 1);
    .seach_bottom {
      height: 72px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      padding-left: 27px;
    }
  }
}
.pei_zi_url {
  max-width: 130px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
