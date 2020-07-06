<template>
  <div id="examine">
    <div class="search-bar">
      <div class="search">
        类型：
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>审核类型：
        <el-select v-model="examineValue" placeholder="请选择">
          <el-option
            v-for="item in examineOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>用户名：
        <el-input v-model="input" placeholder="请输入用户名(默认为所有用户)"></el-input>
        <el-button type="primary" @click="search">查询</el-button>
      </div>
      <div class="content">
        <br />
        <el-table :data="tableData" height="350" border style="width: 100%">
          <el-table-column prop="from" label="用户名" align="center"></el-table-column>
          <el-table-column prop="title" label="文章标题" align="center"></el-table-column>
          <el-table-column prop="type" label="文章类型" align="center"></el-table-column>
          <el-table-column prop="text" label="文章内容" align="center"></el-table-column>
          <el-table-column prop="ctime" label="上传时间" align="center"></el-table-column>
          <el-table-column prop="views" label="浏览量" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="open(scope.$index,tableData)">修改审核状态</el-button>
              <!-- <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small"
              >移除</el-button> -->
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
    </div>
  </div>
</template>

<script>
import Masker from "@/components/mask/Masker";
export default {
  components:{
    Masker
  },
  data() {
    return {
      loading: false,
      total: 0,
      curPage: 1,
      limit: 10,
      bool: true,
      tableData: [],
      input: "",
      options: [
        {
          value: "",
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
        }
      ],
      value: "",
      examineOptions: [
        {
          value: "0",
          label: "未通过"
        },
        {
          value: "1",
          label: "通过"
        },
        {
          value: "-1",
          label: "未审核"
        }
      ],
      examineValue: "-1",
      afterExamineValue: "-1"
    };
  },
  methods: {
    open(index, tableData) {
      const h = this.$createElement;
      // console.log(textarea);
      setTimeout(_ => {
        if (this.examineValue === "0") {
          textarea.style.display = "block";
        }
      });

      this.$msgbox({
        title: tableData[index].title,
        message: h("div", null, [
          h("div", {
            domProps: {
              innerHTML: tableData[index].content
            }
          }),
          h("hr"),
          h("span", null, "审核类型"),
          h(
            "select",
            {
              attrs: {
                id: "selectValue"
              },
              domProps: {
                value: this.examineValue
              },
              on: {
                input: event => {
                  if (event.target.value === "0") {
                    textarea.style.display = "block";
                  } else {
                    textarea.style.display = "none";
                  }
                }
              }
            },
            this.examineOptions.map(function(item) {
              return h(
                "option",
                {
                  domProps: {
                    value: item.value
                  }
                },
                item.label
              );
            })
          ),
          h("div", null, [
            h("textarea", {
              attrs: {
                placeholder: "请填写未过审原因",
                id: "textarea"
              },
              domProps: {
                value: tableData[index].fail_reason
              }
            })
          ])
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 3000);
          } else {
            done();
          }
        }
      })
        .then(async action => {
          const result = await this.$axios.post(
            "/api/updateArticleStatusById",
            {
              status: selectValue.value,
              id: tableData[index].id,
              fail_reason: textarea.value,
              success_time: new Date().toLocaleDateString(),
              isAdmin: true
            },
            {
              headers: { Authorization: localStorage.getItem("token") }
            }
          );
          this.$message({
            type: "info",
            message: "action: " + action
          });
          this.search();
        })
        .catch(() => {});
    },
    async search() {
       this.loading = true;
      const result = await this.$axios
        .get("/api/queryArticleByPageAndExamine", {
          params: {
            examineType: this.examineValue,
            page: 1,
            limit: this.limit,
            type: this.value,
            from: this.input,
            isAdmin: true
          },
          headers: { Authorization: localStorage.getItem("token") }
        })
        .then(data => data.data);
      this.tableData = result.result;
      this.total = result.count;
      this.afterExamineValue = this.examineValue;
       this.loading = false;
    },
    async changePage(curPage) {
       this.loading = true;
      const result = await this.$axios
        .get("/api/queryArticleByPageAndExamine", {
          params: {
            examineType: this.examineValue,
            page: curPage,
            limit: this.limit,
            type: this.value,
            from: this.input,
            isAdmin: true
          },
          headers: { Authorization: localStorage.getItem("token") }
        })
        .then(data => data.data);
      this.tableData = result.result;
      this.total = result.count;
       this.loading = false;
    }
  },
  async mounted() {
     this.loading = true;
    const result = await this.$axios
      .get("/api/queryArticleByPageAndExamine", {
        params: {
          examineType: this.examineValue,
          page: 1,
          limit: this.limit,
          type: this.value,
          from: this.input,
          isAdmin: true
        },
        headers: { Authorization: localStorage.getItem("token") }
      })
      .then(data => data.data);
    this.tableData = result.result;
    this.total = result.count;
     this.loading = false;
  }
};
</script>

<style scoped>
#examine {
  width: 1120px;
}
.el-select {
  margin-right: 12px;
}
.el-input {
  width: 218px;
  margin-right: 12px;
}
</style>