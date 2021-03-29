<template>
  <div class="oralReportTheLoss">
    <el-button @click="OralReportTheLoss_inquire">查询</el-button>
    <el-button @click="OralReportTheLoss_loss">挂失</el-button>
    <div class="top"></div>
    <div class="view">
      <el-row>
        <el-col :span="6">
          <div class="left">卡号：</div>
        </el-col>
        <el-col :span="18">
          <div class="right">{{AcctNo}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="left">开始时间：</div>
        </el-col>
        <el-col :span="18">
          <div class="right">
            <div class="block">
              <el-date-picker
                value-format="yyyyMMdd"
                align="center"
                size="mini"
                v-model="Date1"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="left">结束时间：</div>
        </el-col>
        <el-col :span="18">
          <div class="right">
            <div class="block">
              <el-date-picker
                value-format="yyyyMMdd"
                align="center"
                size="mini"
                v-model="Date2"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="conten">
      <el-table :data="dataList" style="width: 100%" :empty-text="cont" border>
        <el-table-column prop="CustNo" label="客户号" align="center" width="180"></el-table-column>
        <el-table-column prop="NameCh" label="客户中文名" align="center" width="180"></el-table-column>
        <el-table-column prop="Code" label="操作" align="center"></el-table-column>
        <el-table-column prop="ClearCode" label="营业机构号" align="center"></el-table-column>
        <el-table-column prop="BillDate" label="挂失日期" align="center"></el-table-column>
        <el-table-column prop="Time1" label="挂失时间" align="center"></el-table-column>
        <el-table-column prop="InspCode" label="解挂日期" align="center"></el-table-column>
        <el-table-column prop="Time2" label="解挂时间" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 弹框 -->
    <el-dialog title="提示" :visible="dialogVisible" width="30%">
      <el-form label-width="100px">
        <el-form-item label="手机号：">
          <el-input class="msgPhone">123</el-input>
          <el-button>获取来电</el-button>
        </el-form-item>
        <el-form-item label="短信模板：">
          <el-input type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getDateTime } from "@/core/utils/GlobalMethods";
export default {
  name: "OralReportTheLoss",
  data() {
    return {
      Date2: "",  // 结束时间
      Date1: "",  //  开始时间
      dataList: [],  //  查询结果列表
      cont: "暂无数据",
      AcctNo: 1234567894, //  卡号
      ICcard: true,   
      dialogVisible: false,
      isSearch: false
    };
  },
  created() {
    this.getTimes();
  },
  methods: {
    getTimes() {
      let Date1 = new Date();
      Date1.setMonth(new Date().getMonth() - 1);
      this.Date1 = getDateTime(Date1, true, false, "");
      this.Date2 = getDateTime(new Date(), true, false, "");
    },
    OralReportTheLoss_inquire() {
      console.log(this.Date1, this.Date2);
      if (this.Date1 > this.Date2) {
        this.$message.error("开始时间需早于或等于结束时间");
      } else {
        this.$message.success("查询挂失记录");
        let param = {
          
        }
        // this.$MainAjax.doPost(urlConfig.trans, param).then(res=>{
        //   console.log(res)
        // })
          this.dataList = [
          {
            CustNo: "1213594",
            NameCh: '张大三',
            Code: '口头挂失',
            ClearCode: "北京长安支行",
            BillDate: "20191025",
            Time1: "11:25:30",
            InspCode: "20191028",
            Time2:  "15:25:30"
          }
        ]
        if (!this.dataList.length) {
          this.cont = "查询无挂失记录，若需继续操作挂失请点击“挂失”";
        }
        this.isSearch = true;
      }

    },
    OralReportTheLoss_loss() {
      if (this.isSearch) {
        if (this.dataList.length) {
          // this.csrAlert.warning("不允许重复挂失")
          this.$message.warning("不允许重复挂失");
        } else {
          // this.csrAlert.info('123','ceshi')
          this.$confirm("挂失卡号" + this.AcctNo, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            if (this.ICcard) {
              this.$confirm(
                "您申请挂失的为阳光借记卡，账户为【******】，如操作挂失，金融账户将被冻结，电子现金账户余额视为丢失，无法找回",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }
              )
                .then(() => {
                  this.$message({
                    type: "success",
                    message: "继续挂失!"
                  });
                  this.dialogVisible = true;
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "取消挂失"
                  });
                });
            }
          });
        }
      } else {
        this.$alert("请先进行【查询】", "提示", {
          confirmButtonText: "确定"
        });
      }
    },
    // beforeClose(index) {
    //   console.log("关闭交易页面2");
    //   this.csrAlert
    //     .confirm({
    //       title: "确定要关闭交易么？",
    //       icon: "warning"
    //     })
    //     .then(res => {
    //       if (res) {
    //         this.$emit("close", index);
    //       } else {
    //       }
    //     });
    // }
  }
};
</script>
<style scoped>
.top {
  height: 30px;
  background:linear-gradient(to bottom,#7cbcdf,#7494c7);
  margin-bottom: 2px;
}
.el-row {
  background: #dce5f2;
  text-align: center;
  height: 38px;
  line-height: 38px;
  border-top: 1px solid #afc8ee;
  font-size: 14px;
}
.el-row:last-child {
  border-bottom: 1px solid #afc8ee;
  margin-bottom: 5px;
}
.msgPhone {
  width: 75%;
}
</style>
