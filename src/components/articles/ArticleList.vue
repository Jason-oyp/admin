<template>
  <div id="article-list">
    <div class="search">
      类型：
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <br />
    <el-table :data="tableData" height="350" border style="width: 100%">
      <el-table-column prop="title" label="文章标题" align="center"></el-table-column>
      <el-table-column prop="text" label="文章内容" align="center"></el-table-column>
      <el-table-column prop="ctime" label="上传时间" align="center"></el-table-column>
      <el-table-column prop="views" label="浏览量" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            size="small"
          >移除</el-button>
        </template>
      </el-table-column>
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
    <Masker :loading="loading" />
  </div>
</template>

<script>
import axios from "axios";
import Masker from "@/components/mask/Masker";
export default {
  components:{
    Masker
  },
  data() {
    return {
      loading: false,
      curPage: 1,
      bool: false,
      tableData: [],
      options: [
        {
          value: "all",
          label: "全部"
        },
        {
          value: "english",
          label: "英语"
        },
        {
          value: "math",
          label: "数学"
        },
        {
          value: "politics",
          label: "政治"
        },
        {
          value: "profession",
          label: "专业课"
        },
        {
          value: "jyxd",
          label: "经验心得"
        },
        {
          value: "fszd",
          label: "复试指导"
        }
      ],
      value: "all",
      total: 0,
      limit: 10
    };
  },
  methods: {
    changePage(curPage) {
      this.search(curPage);
    },
    async search(curPage) {
      this.loading = true;
      const result = await this.$axios
        .get("/api/queryArticleByUserIdAndType", {
          headers: { Authorization: localStorage.getItem("token") },
          params: {
            userId: -1,
            type: this.value,
            status: 1,
            isAdmin: true,
            page: typeof curPage === "number" ? curPage : 1,
            limit: this.limit
          }
        })
        .then(data => data.data);
        this.loading = false;
      this.curPage =  typeof curPage === "number" ? curPage : 1;
      this.tableData = result.result;
      this.total = result.count;
    },
    deleteRow(index, tableData) {
      axios
        .post(
          "/api/deleteArticleById",
          {
            id: tableData[index].id,
            isAdmin: true
          },
          {
            headers: { Authorization: localStorage.getItem("token") }
          }
        )
        .then(data => {
          if (data.data.message === "success") {
            this.$message("删除成功", "success");
          }
          location.href = "/articlelist";
        });
    }
  },
  async mounted() {
    this.loading = true;
    const result = await axios
      .get("/api/queryArticleByUserIdAndType", {
        headers: { Authorization: localStorage.getItem("token") },
        params: {
          userId: -1,
          type: "all",
          status: 1,
          isAdmin: true,
          page: 1,
          limit: this.limit
        }
      })
      .then(data => data.data);

    this.tableData = result.result;
    this.total = result.count;
    this.loading = false;
  }
};
</script>

<style scoped>
#article-list {
  width: 1120px;
}
.el-button {
  margin-left: 20px;
  height: 40px;
  box-sizing: border-box;
}
</style>