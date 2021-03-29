<template>
  <div class="messageHelperInquire">
    <el-scrollbar style="height:100%;width:100% ">
      <el-container>
        <el-aside width="220px">
          <ul>
            <li>
              <h2>活动话术1</h2>
              <span>15645a6s4d56s4ad5sad</span>
            </li>
            <li>
              <h2>活动话术2</h2>
              <span>564a6s4d51as5d46a54d6sad</span>
            </li>
            <li>
              <h2>活动话术3</h2>
              <span>145s64ad1sa31das56d4as56d</span>
            </li>
          </ul>
        </el-aside>
        <el-container>
          <el-header style="height:''">
            <el-row v-for="index in 10" :key="index">
              <el-col :span="4">465545454564545a4d5645sa4d5as4d564sa5d4sa54d56sa4d56as4d5sa5d4asd46</el-col>
              <el-col :span="20">1544a6sd45as4d5a4d5a4das8d4as5d4sa5d48a4d5s1d53a14d54sa56d4as5d1as56d4sa56d456sa4d5asd4a5sd4as5d4sa5d4as56d4as56d4sa56d45sad45w64a51sd215w4a56d1s2a1d515wa457</el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-form :model="param" :inline="true" size="mini" label-position="left">
              <el-form-item label="任务线索结果：" label-width="100px">
                <el-select v-model="param.aa" @change="selectVal">
                  <el-option v-for="item in aaaa" :key="item.val" :label="item.lab" :value="item.val"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="预约时间：" label-width="75px">
                <el-date-picker v-model="param.bb" type="datetime" :disabled="(param.aa =='2' || param.aa == '3')"></el-date-picker>
              </el-form-item>
              <el-form-item label="处置原因：" label-width="80px">
                <el-select v-model="param.cc" :disabled="(param.aa =='0' || param.aa == '1')">
                  <el-option v-for="item in (param.aa=='2'?cccc:param.aa=='3'?dddd:'')" :key="item.val" :label="item.lab" :value="item.val"></el-option>
                  <!-- <el-option v-for="item in (param.aa=='3'?dddd:'')" :key="item.val" :label="item.lab" :value="item.val"></el-option> -->
                </el-select>
              </el-form-item>
              <el-form-item label="预约信息：" label-width="100px" class="mytext">
                <el-input type="textarea" rows="3" v-model="param.ee" placeholder="最多可输入100个字符" maxlength="100" resize="none"></el-input>
              </el-form-item>
            </el-form>
          </el-main> 
          <el-footer>
            <el-table border>
              <el-table-column label="日期"></el-table-column>
              <el-table-column label="姓名"></el-table-column>
              <el-table-column label="姓名"></el-table-column>
              <el-table-column label="姓名"></el-table-column>
              <el-table-column label="姓名"></el-table-column>
              <el-table-column label="姓名"></el-table-column>
              <el-table-column label="姓名"></el-table-column>
            </el-table>
          </el-footer>
        </el-container>
      </el-container>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      param: {
        aa: '',
        bb: '',
        cc: '',
        ee: ''
      },
      aaaa: [
        {lab:'挂起',val:'0'},
        {lab:'回访',val:'1'},
        {lab:'营销失败',val:'2'},
        {lab:'营销成功',val:'3'},
      ],
      cccc: [
        {lab:'客户拒绝',val:'0'},
        {lab:'有购买意向',val:'1'},
        {lab:'已持有',val:'2'},
        {lab:'未接通',val:'3'},
      ],
      dddd: [
        {lab:'在线购买成功',val:'0'},
        {lab:'有购买意向',val:'1'}
      ],
    }
  },
  methods: {
    selectVal(val){
      if(val=='2'||val=='3'){
        this.param.bb=''
        this.param.ee=''
      }
        this.param.cc=''
    }
  },
}
</script>
<style scoped>
.messageHelperInquire {
  height: 500px;
  width: 100%;
}
.messageHelperInquire .el-scrollbar__view>.el-container {
  padding-bottom: 30px;
}
.messageHelperInquire .el-container .el-header .el-col {
  word-wrap: break-word;
  word-break: break-all;
}
.messageHelperInquire /deep/ .el-form .el-form-item .el-form-item__label {
  padding-right: 0;
}
.messageHelperInquire /deep/ .el-select .el-input {
  width: 140px;
}
.messageHelperInquire /deep/ .el-input {
  width: 180px;
}
.messageHelperInquire .mytext {
  display: flex;
}
.messageHelperInquire /deep/ .mytext .el-form-item__content{
  flex: 1;
  max-width: 630px;
}
.messageHelperInquire /deep/ .el-table .el-table__body-wrapper::-webkit-scrollbar{
  width: 0;
  height: 0;
}
</style>
