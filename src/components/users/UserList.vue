<template>
  <div id="userlist">
    <div class="search-bar">
      <div class="search">
        用户名：
        <el-input v-model="input" placeholder="请输入用户名(默认为所有用户)"></el-input>
        <el-button type="primary" @click="search">查询</el-button>
      </div>
    </div>
    <div class="content">
      <br />
      <el-table :data="tableData" height="350" border style="width: 100%">
        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
        <el-table-column prop="gender" label="性别" align="center"></el-table-column>
        <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
        <!-- <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="freeze(scope.$index,tableData)">冻结该用户</el-button>
            <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small"
            >移除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <br />
      <el-pagination
        :hide-on-single-page="bool"
        :page-size="limit"
        background
        @current-change="changePage"
        :current-page="curPage"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      bool: true,
      limit: 10,
      curPage: 1,
      total: 0,
      tableData: []
    };
  },
  methods: {
    async getData(curPage) {
      const result = await this.$axios
        .get("/api/queryUsersInfo", {
          headers: { Authorization: localStorage.getItem("token") },
          params: {
            username: this.input,
            page: typeof curPage === "number" ? curPage : 1,
            limit: this.limit,
            isAdmin: true
          }
        })
        .then(res => res.data);
      this.total = result.count;
      this.tableData = result.result;
    },
    search() {
      this.getData();
    },
    changePage(curPage) {
      this.getData(curPage);
    },
    freeze() {
      alert("敬请期待");
    }
  },
  async mounted() {
    this.getData();
  }
};
</script>

<style scoped>
.el-input {
  width: 218px;
  margin-right: 12px;
}
</style>