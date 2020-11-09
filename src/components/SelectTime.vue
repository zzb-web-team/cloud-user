<template>
  <div style="display: flex; flex-direction: row; align-items: center;">
    <div class="wrapper" :class="{ customStyle: showTimePicker }">
      <template v-for="item in names">
        <div
          v-if="!showTimePicker"
          class="itemStyle"
          :class="{ isActive: item.key == selected}"
          :index="item.key"
          :key="item.key"
          @click="select(item.key, item.value)"
        >
          {{ item.value }}
        </div>
      </template>
      <div class="itemStyle" :class="{ isActive: selected == undefined}" @click="select()">自定义</div>
    </div>
    <el-date-picker
        v-show="showTimePicker"
        style="margin-left: auto"
        v-model="times"
        :type="type"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="left"
        @change="getTimes"
      >
    </el-date-picker>
  </div>
</template>

 <script>
 import {dateToMs} from "../servers/sevdate";
 import common from "../comm/js/util";
export default {
  data() {
    return {
      names: [
        {
          key: 0,
          value: "今天",
        },
        {
          key: 1,
          value: "昨天",
        },
        {
          key: 2,
          value: "近7天",
        },
        {
          key: 3,
          value: "近30天",
        },
      ],
      selected: 0,
      showTimePicker: false,
      times: [],
      starttime: '',
      endtime: '',
    };
  },
  props: {
    type:  {
      type: String,
      required: true,
    },
  },
  methods: {
    select(i, v) {
      console.log(i, v);
      this.selected = i;
      if (i == undefined) {
        this.showTimePicker = !this.showTimePicker;
        if(this.times){
          this.times = [];
        }
      } else if (i == 0) {
        let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
        this.starttime = times;
        this.endtime = Date.parse(new Date()) / 1000;
        this.$emit("selectTime", {
          starttime: this.starttime,
          endtime: this.endtime,
        });
      } else if (i == 1) {
        let times = new Date(new Date().toLocaleDateString()).getTime() / 1000;
        this.starttime = times - 24 * 60 * 60 * 1;
        this.endtime = times - 1;
        this.$emit("selectTime", {
          starttime: this.starttime,
          endtime: this.endtime,
        });
      } else if (i == 2) {
        let times = parseInt(new Date(new Date()).getTime() / 1000);
        this.starttime = times - 24 * 60 * 60 * 6;
        this.endtime = times;
        this.$emit("selectTime", {
          starttime: this.starttime,
          endtime: this.endtime,
        });
      } else if (i == 3) {
        let times = parseInt(new Date(new Date()).getTime() / 1000);
        this.starttime = times - 24 * 60 * 60 * 29;
        this.endtime = times;
        this.$emit("selectTime", {
          starttime: this.starttime,
          endtime: this.endtime,
        });
      }
    },
    getTimes() {
      if(this.type == 'datetimerange'){
        this.starttime = this.times ? dateToMs(this.times[0]) : new Date(new Date().toLocaleDateString()).getTime() / 1000;
        this.endtime = this.times ? dateToMs(this.times[1]) : Date.parse(new Date()) / 1000;
      }else{
        this.starttime = this.times ? dateToMs(this.times[0]) : new Date(new Date().toLocaleDateString()).getTime() / 1000;
        this.endtime = this.times ? dateToMs(this.times[1]) + (24*60*60-1) : Date.parse(new Date()) / 1000;
      }
      this.$emit("selectTime", {
        starttime: this.starttime,
        endtime: this.endtime,
      });
    },
    resetTimes() {
      this.showTimePicker = false;
      this.times = [];
      this.selected = 0;
    }
  },
};
</script>



<style scoped>
.wrapper {
  height: 40px;
  background: #f9f9f9;
  border-radius: 28px;
  border: 1px solid #eeeeee;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.itemStyle {
  width: 116px;
  line-height: 40px;
  height: 40px;
  color: #333;
  text-align: center;
  cursor: pointer;
  background: #f9f9f9;
  border-radius: 28px;
}
.customStyle{
  width: 116px;
  line-height: 40px;
  height: 40px;
  text-align: center;
}
.isActive {
  background: rgba(100, 76, 247, 0.06);
  border-radius: 26px;
  color: #644cf7;
  border: 1px solid #644cf7;
}
</style>
