<template>
  <div>
    短信通
    <el-button @click="isSign=true" size="mini">解约页</el-button>
    <el-button @click="isSign=false" size="mini">签约页</el-button>
    <component :is="messageHelperSettingId"></component>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSign: false,
      messageHelperSettingId: ""
    };
  },
  created() {
    this.show();
  },
  watch: {
    isSign: {
      handler(nval, oval) {
        console.log("-----------",nval,oval);
        this.show();
      }
    }
  },
  methods: {
    show() {
      if (this.isSign) {
        this.messageHelperSettingId = () =>
          import(
            "@/pages/trans/sjh/MessageHelperSetting/MessageHelperSettingTermination"
          );
      } else {
        this.messageHelperSettingId = () =>
          import(
            "@/pages/trans/sjh/MessageHelperSetting/MessageHelperSettingSign"
          );
      }
    }
  }
};
</script>

<style scoped>
</style>
