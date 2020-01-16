<template>
  <div id="app">
    <router-view v-if="isReload"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isReload: true
    };
  },
  methods: {
    reload() {
      this.isReload = false;
      this.$nextTick(() => {
        this.isReload = true;
      });
    }
  }
};
</script>

<style lang="scss">
@import "./assets/style/index";
@import url(./assets/font/font.scss);
</style>
<style>
#app {
  font-family: "PuHuiTi", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #eff3f5;
  width: 100%;
  height: 100%;
}
</style>
