<template>
  <div class="content information">
    <div class="top_title">账号信息</div>
    <!-- 主体内容 -->
    <div class="info_content">
      <div class="info_content_on">
        <div class="info_content_title">基本信息</div>
        <p>
          <span class="titlenama">用户名</span>
          <span class="conname">
            {{ username }}
            <img
              src="../../assets/img/bianji.png"
              style="margin-left: 10px;width: 21px;"
              @click="setusername('用户名')"
              alt
            />
            <img />
          </span>
        </p>
        <p>
          <span class="titlenama">账号ID</span>
          <span class="conname">{{ userid }}</span>
        </p>
        <p>
          <span class="titlenama">密钥</span>
          <span class="conname" v-show="sgo">
            *********
            <el-button type="text" size="small" @click="show_key">查看</el-button>
          </span>
          <span class="conname" v-show="!sgo">
            {{secret}}
            <el-button type="text" size="small" @click="reset_key">重置</el-button>
            <el-button type="text" size="small" class="show_key_btn" @click="show_key">收起</el-button>
          </span>
        </p>
      </div>

      <div class="info_content_on">
        <div class="info_content_title">账号安全</div>
        <p>
          <span class="titlenama">安全手机</span>
          <span
            class="titlenama"
            style="width:330px;margin-right: 98px;display: inline-block;"
          >账号保护的一种验证方式，可以用于校验用户身份</span>
          <span class="conname">
            +86 {{ userphone | settel }}
            <img
              src="../../assets/img/bianji.png"
              style="margin-left: 10px;width: 21px;"
              @click="setuserphone('手机号')"
              alt
            />
            <img />
          </span>
        </p>
        <p>
          <span class="titlenama">安全邮箱</span>
          <span
            class="titlenama"
            style="width:330px;margin-right: 98px;display: inline-block;"
          >安全邮箱可以作为账号身份验证的一种辅助校验方式</span>
          <span class="conname">
            {{ useremail | encryptedmailbox }}
            <img
              src="../../assets/img/bianji.png"
              style="margin-left: 10px;width: 21px;"
              @click="setuseremail('邮箱')"
              alt
            />
            <img />
          </span>
        </p>
        <p>
          <span class="titlenama">登陆密码</span>
          <span class="titlenama">******</span>
          <span @click="setuserpwd">
            修改密码
            <img src="../../assets/img/bianji.png" style="margin-left: 10px;width: 21px;" alt />
          </span>
        </p>
      </div>
    </div>
    <!-- 弹窗 -->
    <div>
      <el-dialog
        :title="titlename"
        :visible.sync="dialogFormVisible"
        width="610px"
        @close="handleClose"
      >
        <el-form :model="form" ref="form">
          <el-form-item
            :label="meconame"
            prop="name"
            class="usert"
            :label-width="formLabelWidth"
            :rules="[{ validator: jiousername, trigger: 'blur' }]"
          >
            <el-input v-model="form.name" autocomplete="off" :placeholder="placeholdername"></el-input>
          </el-form-item>
          <el-form-item
            label="验证码:"
            v-if="titlename !== '修改账号'"
            class="yama"
            prop="input"
            :rules="[{ validator: jioyzm, trigger: 'blur' }]"
          >
            <el-input v-model="form.input" placeholder="请输入内容">
              <el-button
                v-if="titlename == '修改手机号'"
                slot="append"
                style="background: #297AFF;color: #fff;width:112px;height:38px;"
                @click="getsscode(titlename)"
                :disabled="getyzmcode"
              >
                {{
                getyzmcode == true ? num : '获取验证码'
                }}
              </el-button>
              <el-button
                v-else
                slot="append"
               style="background: #297AFF;color: #fff;width:112px;height:38px;"
                @click="getsscode(titlename)"
                :disabled="getyzmcode2"
              >
                {{
                getyzmcode2 == true ? num2 : '获取验证码'
                }}
              </el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFo('form')">取 消</el-button>
          <el-button type="primary" @click="quesd('form')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改密码弹窗 -->
      <div class="setpwd">
        <el-dialog title="修改密码" :visible.sync="userpedVisible" width="610px" @close="handleClose2">
          <el-form :model="user" ref="user">
            <el-form-item
              label="手机号"
              prop="phone"
              :rules="[{ validator: jiophone, trigger: 'blur' }]"
            >
              <el-input v-model="user.phone" autocomplete="off" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code" :rules="[{ validator: jioyzm, trigger: 'blur' }]">
              <el-input
                v-model.number="user.code"
                maxlength="6"
                show-word-limit
                placeholder="请输入验证码"
              >
                <el-button
                  slot="append"
                  @click="sendyam"
                  :disabled="getsetcode"
                  style="background: #297AFF;color: #fff;width:112px;height:40px;"
                  
                >
                  {{
                  getsetcode == true ? num : '获取验证码'
                  }}
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item
              label="密码"
              prop="pwd"
              :rules="[
								{ validator: jiouserpwa, trigger: 'blur' }
							]"
            >
              <el-input v-model="user.pwd" type="password" autocomplete="off" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item
              label="确认密码"
              prop="passpwd"
              :rules="[{ validator: jioqpwd, trigger: 'blur' }]"
            >
              <el-input
                v-model="user.passpwd"
                type="password"
                autocomplete="off"
                placeholder="两次输入的密码必须一致"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="pwddialogFo('user')">取 消</el-button>
            <el-button type="primary" @click="pwdquesd('user')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getuser,
  editemail,
  editusername,
  editphone,
  getcode,
  getemail,
  forgetpassword,
  resetpassword,
  resecret
} from "../../servers/api";
export default {
  inject: ["reload"],
  data() {
    return {
      sgo: true,
      username: "",
      userid: "",
      secret: "",
      userphone: "",
      useremail: "",
      dialogFormVisible: false,
      userpedVisible: false,
      getsetcode: false,
      placeholdername: "",
      titlename: "",
      meconame: "",
      disafe: false,
      formLabelWidth: "120px",
      id: "",
      num: 60,
      num2: 60,
      getyzmcode: false,
      getyzmcode2: false,
      sertiem: "",
      sertiem2: "",
      form: {
        name: "",
        titlename: "",
        input: ""
      },
      user: {
        phone: "",
        code: "",
        pdw: "",
        passpwd: ""
      }
    };
  },
  filters: {
    settel(tel) {
      var tel1 = tel.replace(tel.substring(3, 7), "****");
      return tel1;
    },
    encryptedmailbox(email) {
      if (String(email).indexOf("@") > 0) {
        var str = email.split("@");
        var _s = "";
        var new_email = "";
        if (str[0].length > 3) {
          //@前面多于3位
          for (var i = 3; i < str[0].length; i++) {
            _s += "*";
          }
          new_email = str[0].substr(0, 3) + _s + "@" + str[1];
        } else {
          //@前面小于等于于3位
          for (var i = 1; i < str[0].length; i++) {
            _s += "*";
          }
          new_email = str[0].substr(0, 1) + _s + "@" + str[1];
        }

        return new_email;
      }
    }
  },
  mounted() {
    if (this.$cookies.get("id")) {
      this.id = this.$cookies.get("id") * 1;
    } else {
      this.$router.push({ path: "/" });
    }
    this.getuser();
  },
  methods: {
    //获取用户信息
    getuser() {
      let parmas = new Object();
      parmas.id = this.id;
      getuser(parmas)
        .then(res => {
          this.username = res.data.username;
          this.userphone = res.data.phone;
          this.useremail = res.data.email;
          this.userid = res.data.id;
          this.secret = res.data.secret;
        })
        .catch(err => {});
    },
    cancel() {
      return false;
    },
    show_key() {
      this.sgo = !this.sgo;
    },
    //重置密钥
    reset_key() {
      let parmas = new Object();
      parmas.id = this.id;
      resecret(parmas)
        .then(res => {
          if (res.status == 0) {
            this.secret = res.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {});
    },
    //修改用户名
    setusername(mea) {
      this.form.name = "";
      this.dialogFormVisible = true;
      this.meconame = mea;
      this.placeholdername = "请设置会员名(4-20位字母数字组成的字符串)";
      this.titlename = "修改账号";
      this.form.titlename = "修改账号";
    },
    //修改手机号
    setuserphone(mea) {
      this.form.name = "";
      this.dialogFormVisible = true;
      this.meconame = mea;
      this.placeholdername = "请输入11位有效手机号";
      this.titlename = "修改手机号";
      this.form.titlename = "修改手机号";
    },
    //修改邮箱
    setuseremail(mea) {
      this.form.name = "";
      this.dialogFormVisible = true;
      this.meconame = mea;
      this.placeholdername = "请输入有效邮箱";
      this.titlename = "修改邮箱";
      this.form.titlename = "修改邮箱";
    },
    //修改密码--弹窗
    setuserpwd() {
      this.userpedVisible = true;
    },
    //确定
    quesd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.titlename == "修改手机号") {
            let parmas = new Object();
            parmas.phone = this.form.name;
            parmas.code = this.form.input;
            parmas.id = this.id;
            editphone(parmas)
              .then(res => {
                if (res.status == 0) {
                  this.$message.success("修改成功");
                  clearInterval(this.sertiem);
                  this.num = 60;
                  this.getyzmcode = false;
                  this.reload();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch(err => {});
          } else if (this.form.titlename == "修改邮箱") {
            let parmas = new Object();
            parmas.email = this.form.name;
            parmas.code = this.form.input;
            parmas.id = this.id;
            editemail(parmas)
              .then(res => {
                if (res.status == 0) {
                  this.$message.success("修改成功");
                  clearInterval(this.sertiem);
                  this.num = 60;
                  this.getyzmcode = false;
                  this.reload();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch(err => {});
          } else {
            let parmas = new Object();
            parmas.username = this.form.name;
            parmas.id = this.id;
            editusername(parmas)
              .then(res => {
                if (res.status == 0) {
                  this.$cookies.set("user", parmas.username, 7 * 24 * 60 * 60);
                  this.$cookies.set("id", parmas.id, 7 * 24 * 60 * 60);
                  this.reload();
                  this.$message.success("修改成功");
                }
              })
              .catch(err => {});
          }

          this.dialogFormVisible = false;
          this.form.name = "";
          this.form.input = "";
        } else {
          return false;
        }
      });
    },
    //取消
    dialogFo(formName) {
      this.$refs[formName].resetFields();
      this.form.name = "";
      this.form.input = "";
      this.dialogFormVisible = false;
    },
    //关闭--按钮
    handleClose() {
      this.dialogFo("form");
    },
    //获取验证码
    getsscode(data) {
      let parmas = new Object();
      if (data == "修改手机号") {
        parmas.phone = this.form.name;
        getcode(parmas)
          .then(res => {
            if (res.status == 0) {
              this.$message({
                message: "获取验证码成功",
                type: "success"
              });
              this.getyzmcode = true;
              this.sertiem = setInterval(() => {
                this.num -= 1;
                if (this.num <= 0) {
                  clearInterval(this.sertiem);
                  this.num = 60;
                  this.getyzmcode = false;
                }
              }, 1000);
            } else {
              clearInterval(this.sertiem);
              this.num = 60;
              this.getyzmcode = false;
              this.getyzmcode = false;
              this.$message.error(res.msg);
            }
          })
          .catch(err => {});
      } else {
        parmas.email = this.form.name;
        getemail(parmas)
          .then(res => {
            if (res.status == 0) {
              this.getyzmcode2 = true;
              this.sertiem2 = setInterval(() => {
                this.num2 -= 1;
                if (this.num2 <= 0) {
                  clearInterval(this.sertiem2);
                  this.num2 = 60;
                  this.getyzmcode2 = false;
                }
              }, 1000);
            } else {
              clearInterval(this.sertiem2);
              this.num2 = 60;
              this.getyzmcode2 = false;
              this.getyzmcode2 = false;
              this.$message.error(res.msg);
            }
          })
          .catch(err => {});
      }
    },
    //修改登陆密码--获取验证码
    sendyam() {
      this.getyzmcode = true;
      let params = new Object();
      let phonenumber = this.user.phone + "";
      params.user = phonenumber;
      if (phonenumber.indexOf("@") != -1) {
        params.type = "email";
      } else {
        params.type = "phone";
      }
      forgetpassword(params)
        .then(res => {
          if (res.status == 0) {
            this.getsetcode = true;
            this.$message({
              message: "获取验证码成功",
              type: "success"
            });
            let sertiem = setInterval(() => {
              this.num -= 1;
              if (this.num <= 0) {
                clearInterval(sertiem);
                this.num = 60;
                this.getsetcode = false;
              }
            }, 1000);
          } else {
            this.getsetcode = false;
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.getsetcode = false;
        });
    },
    //修改密码--确认
    pwdquesd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = new Object();
          params.type = "phone";
          params.user = this.user.phone;
          params.password = this.user.pwd;
          params.password2 = this.user.passpwd;
          params.code = this.user.code;
          resetpassword(params)
            .then(res => {
              if (res.status == 0) {
                this.$message({
                  message: "密码重置成功",
                  type: "success"
                });
                this.userpedVisible = false;
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {});
        }
      });
    },
    //修改密码--取消
    pwddialogFo(formName) {
      this.$refs[formName].resetFields();
      this.userpedVisible = false;
    },
    handleClose2() {
      this.pwddialogFo("user");
    },
    //校验
    jiousername(rule, value, callback) {
      if (value === "") {
        callback(new Error("此项为必填内容!"));
      } else {
        let tell = /^1(3|4|5|6|7|8|9)\d{9}$/;
        let sReg = /[_a-zA-Z\d\-\.]+@[_a-zA-Z\d\-]+(\.[_a-zA-Z\d\-]+)+$/;
        if (this.form.titlename == "修改手机号") {
          if (tell.test(value) === true) {
            // this.userphone = this.form.name;
            callback();
          } else {
            callback(new Error("手机号格式错误"));
          }
          callback();
        } else if (this.form.titlename == "修改邮箱") {
          if (sReg.test(value) === true) {
            // this.useremail = this.form.name;
            callback();
          } else {
            callback(new Error("邮箱格式错误"));
          }
        } else if (this.form.titlename == "修改账号") {
        //   var fsdusername = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,20}$/;
        var fsdusername = /^(?![0-9]+$)[0-9A-Za-z]{4,20}$/;
          if (fsdusername.test(value) === false) {
            callback(new Error("账号格式错误"));
          } else {
            callback();
          }
        }
      }
    },
    //校验密码
    jiouserpwa(rule, value, callback) {
      var fspwd = /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{8,16}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (fspwd.test(value) === false) {
          callback(new Error("密码格式错误"));
        } else {
          if (this.user.passpwd !== "") {
            this.$refs.user.validateField("passpwd");
          }
          callback();
        }
      }
    },
    //校验确认密码
    jioqpwd(rule, value, callback) {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.user.pwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    },
    //校验电话号/邮箱
    jiophone(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入手机号或邮箱"));
      } else {
        if ((value + "").indexOf("@") != -1) {
          var fsemail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
          if (fsemail.test(value) === false) {
            callback(new Error("邮箱格式错误"));
          } else {
            callback();
          }
        } else {
          var fsdtel = /^[1]([3-9])[0-9]{9}$/;
          if (fsdtel.test(value) === false) {
            callback(new Error("手机号格式错误"));
          } else {
            callback();
          }
        }
      }
    },
    //校验验证码
    jioyzm(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        var resyzm = /^\d{6}$/;
        if (resyzm.test(value) === false) {
          callback(new Error("验证码格式错误"));
        } else {
          callback();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  .info_content {
    margin: auto;
    margin-left: 45px;
    margin-right: 45px;
    text-align: left;
    padding-top: 19px;
    .info_content_on {
      background: #ffffff;
      box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
      border-radius: 2px;
      margin-top: 20px;
      padding: 30px 40px;
    }
    .info_content_title {
      font-size: 20px;
      color: #202020;
      font-weight: 400;
      margin-bottom: 10px;
    }
    p {
      display: inline-block;
      width: 100%;
      line-height: 45px;
      color: #333333;
      span {
        font-size: 14px;
      }
    }
  }
}
.titlenama {
  display: inline-block;
  width: 56px;
  color: #999999;
  margin-right: 30px;
}
.conname {
  display: inline-block;
  margin-left: 15px;
}
.usert p {
  text-align: left;
  font-size: 12px;
  color: #bdbdbd;
}
</style>
