    <template>
  <div>
    <el-col :span="24" class="text_right">
      <el-button type="primary" size="small" plain @click="compListQuery()">查询</el-button>
    </el-col>
    <el-row class="custquery">
      <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
        <el-col :span="8">
          <el-form-item label="电话号码">
            <el-input v-model="form.Num" clearable maxlength="30"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件号码">
            <el-input v-model="form.signPhone" maxlength="11" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="账/卡号">
            <el-input v-model="form.cardNum" maxlength="11" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 结果显示页面 -->
    <queryResTable
      :pageSize="20" pagePosition="right" :url="resultUrl" :param="param" :pageSizes="[20]" @dataResult="dataResultCallback" height="300" ref="tableBox" :reloadData.sync="reloadData">
      <template v-slot:paginationContainer>
        <el-table ref="resultTable" :data="resultTableData" tooltip-effect="dark" stripe max-height="500" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="dicValues" label="序号" :span="8"></el-table-column>
          <el-table-column prop="status" label="名单名称" :span="8" :formatter="formstatus"></el-table-column>
        </el-table>
      </template>
    </queryResTable>
  </div>
</template>
  
    <script>
import queryResTable from "@/core/components/PaginationContainer";
import { mapActions } from "vuex";
export default {
    components: { queryResTable },
  data() {
    return {
      form: {
        Num: "",
        signPhone: "",
        cardNum: ""
      },
      reloadData: 0,
      pageSize: 10,
      pagePosition: "",
      postUrl: urlConfig.admin.overloadQuery,
      resultUrl: urlConfig.admin.overloadResult,
      params: {},
      param: [],
      codePath: "",
      dicValues: "",
      paramTableData: [],
      resultTableData: [],
      multipleSelection: []
    };
  }
};
</script>
<style scoped>
</style>