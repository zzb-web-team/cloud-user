<template>
  <div class="con"
       ref="box_rHeight">
    <!-- <div class="con_title"> 资金管理 > 添加银行卡</div> -->
    <div class="t_title">添加银行卡</div>
    <div class="configuration">
      <!-- <div class="top_title">流量包配置</div> -->
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
               label-width="100px"
               class="con_ruleForm">
        <el-form-item label="开户银行:"
                      prop="name">
          <el-select v-model="ruleForm.name"
                     style="width:220px;"
                     placeholder="请选择开户银行">
            <el-option :label="item.text"
                       :value="item.value"
                       v-for="item in bankName"
                       :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行卡号:"
                      prop="specification">
          <el-input v-model="ruleForm.specification"
                    :disabled=disable_input
                    style="width:220px;"></el-input>

        </el-form-item>
        <el-form-item label="姓名:"
                      :disabled=disable_input
                      prop="username">
          <el-input v-model="ruleForm.username"
                    style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="证件:"
                      prop="original_price">
          <el-select v-model="ruleForm.certificate_type"
                     style="width:100px;"
                     placeholder="请选择证件">
            <el-option label="身份证"
                       value="sfz"></el-option>
          </el-select>
          <el-input v-model="ruleForm.original_price"
                    style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="预留手机号:"
                      prop="phone">
          <el-input v-model="ruleForm.phone"
                    style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="校验码:"
                      prop="sotr">
          <el-input v-model="ruleForm.sotr"
                    style="width:90px;"></el-input>
          <el-button type="primary"
                     @click="get_check_code"
                     :disabled="getcode_disabled">{{btntxt}}</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="ruleForm.argue">我已了解<span class="link_text"></span></el-checkbox>
        </el-form-item>
        <el-form-item v-show="show_btn" style="margin-top:50px;">
          <el-button type="primary"
                     @click="submitForm('ruleForm')">同意协议并提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
      </p>
    </div>
  </div>
</template>

<script>
import base from '../../components/base'
// import { add_pktproduct, config_pktproduct } from '../../servers/api'
import { bankName } from '../../servers/data'
export default {
  mixins: [base],
  data() {
    return {
      clientHeight: '',
      bankName: bankName,
      ruleForm: {
        name: '',
        specification: '',
        unit: 'GB',
        username: '',
        phone: '',
        original_price: '',
        current_price: '',
        sotr: '',
        valid_period: '流量用完即止',
        delivery: false,
        argue: false,
        certificate_type: 'sfz',
        val_time: [],
      },
      getcode_disabled: false,
      time: 60,
      btntxt: '获取验证码',
      rules: {
        name: [
          {
            required: true,
            message: '请选择开户银行',
            trigger: 'change',
          },
        ],
        specification: [
          {
            required: true,
            message: '请输入银行卡号',
            trigger: 'blur',
          },
        ],
        username: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          },
        ],
        original_price: [
          { required: true, message: '请输入证件号', trigger: 'blur' },
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur',
          },
          {
            pattern: /^1[3|4|5|7|8][0-9]{9}$/,
            message: '请输入正确的手机号',
            trigger: 'blur',
          },
        ],
        sotr: [
          {
            required: true,
            message: '请输入校验码',
            trigger: 'blur',
          },
        ],
      },
      show_btn: true,
      disable_input: false,
    }
  },
  filters: {},
  watch: {
    ruleForm: {
      handler(val, oldval) {
        if (val.discount == 0) {
          val.current_price = Number(val.original_price)
        } else {
          val.current_price = (
            Number(val.original_price) * Number(val.discount)
          ).toFixed(2)
        }
      },
      deep: true, //true 深度监听
      immediate: true, //第一次改变也监听
    },
    clientHeight() {
      //如果clientHeight 发生改变，这个函数就会运行
      this.changeFixed(this.clientHeight)
    },
  },
  mounted() {
    let that = this
    that.clientHeight = `${
      document.documentElement.clientHeight ||
      document.documentElement.offsetHeight
    }` //获取浏览器可视区域高度
    window.onresize = function () {
      that.clientHeight = `${
        document.documentElement.clientHeight ||
        document.documentElement.offsetHeight
      }`
    }
    if (localStorage.getItem('codetime')) {
      this.time = localStorage.getItem('codetime')
      this.timer()
    }
  },
  methods: {
    go_back() {
      this.$router.go(-1)
    },
    //获取验证码
    get_check_code() {
      this.code_time = 90
      if (this.ruleForm.phone == '') {
        this.$refs.ruleForm.validateField('phone')
        return false
      }
      this.time = 60
      this.timer()
    },
    timer() {
      if (this.time > 0) {
        this.getcode_disabled = true
        this.time--
        this.btntxt = '重新获取' + '(' + this.time + ')'
        localStorage.setItem('codetime', this.time)
        setTimeout(this.timer, 1000)
      } else {
        this.time = 0
        this.btntxt = '获取验证码'
        this.getcode_disabled = false
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {}
          params.stocks = Number(this.ruleForm.num)
          params.price = Number(this.ruleForm.original_price)
          params.discount = Number(this.ruleForm.discount)
          params.product_order = Number(this.ruleForm.sotr)

          if (!this.$route.query.data) {
            params.product_name = this.ruleForm.name
            params.size_spec = Number(
              this.update_unit(this.ruleForm.specification, this.ruleForm.unit)
            )
            params.create_time = parseInt(Date.parse(new Date()) / 1000)
            params.valid_type = this.ruleForm.valid_period == '限时使用' ? 2 : 1
            if (this.ruleForm.valid_period == '限时使用') {
              params.start_timelimit = parseInt(
                this.ruleForm.val_time[0] / 1000
              )
              params.end_timelimit = parseInt(this.ruleForm.val_time[1] / 1000)
            }
            //添加
            add_pktproduct(params)
              .then((res) => {
                if (res.status == 0) {
                  this.$message({
                    type: 'success',
                    message: '添加成功!',
                  })
                }
              })
              .catch((error) => {})
          } else {
            //修改
            let dat = JSON.parse(this.$route.query.data)
            params.product_id = dat.product_id
            config_pktproduct(params)
              .then((res) => {
                if (res.status == 0) {
                  this.$message({
                    type: 'success',
                    message: '修改成功!',
                  })
                }
              })
              .catch((error) => {})
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    update_unit(num, unit) {
      if (unit == 'MB') {
        return Number((num / 1024).toFixed(2))
      } else if (unit == 'GB') {
        return num
      } else if (unit == 'TB') {
        return num * 1024
      } else if (unit == 'EB') {
        return num * 1024 * 1024
      } else if (unit == 'ZB') {
        return num * 1024 * 1024 * 1024
      } else if (unit == 'YB') {
        return num * 1024 * 1024 * 1024 * 1024
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      // this.$router.push({path:'/traffic_list'}
    },
    //查询屏幕高度自适应
    changeFixed(data) {
      if (this.$refs.box_rHeight) {
        this.$refs.box_rHeight.style.height = data - 130 + 'px'
        this.$refs.box_rHeight.style.minHeight = 850 + 'px'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
i {
  font-style: normal;
  margin-right: 5px;
}
.con {
  height: 100%;
  margin-top: 30px;
  margin-left: 25px;
  margin-right: 25px;
  box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
  .t_title {
			// margin-bottom: 20px;
			font-size: 16px;
			font-weight: 500;
			width: 100%;
			height: 60px;
			line-height: 70px;
			text-align: left;
			color: #202020;
            margin-left: 30px;
            padding-top: 10px;
		}
  .con_title {
    padding-top: 25px;
    padding-left: 25px;
    margin-bottom: 20px;
    text-align: left;
    font-size: 16px;
    span {
      font-size: 16px;
    }
  }
  .configuration {
    width: 600px;
    margin: auto;
    text-align: left;
    padding: 20px 0;
    .top_title {
      text-align: center;
      margin-left: -200px;
      font-weight: 600;
    }
    .con_ruleForm {
      width: 100%;
      margin-top: 40px;
      .my_group {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        .el-radio:last-child {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
