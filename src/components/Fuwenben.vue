<template>
  <div id="fuwenben">
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
    </div>
    <div class="title-container">
      <span class="title">标题：</span>
      <el-input v-model="titleState"></el-input>
    </div>

    <editor id="tinymce" v-model="html" :init="init"></editor>
    <br />
    <br />
    <el-button type="primary" @click="onSubmit">上传</el-button>
  </div>
</template>

<script>
import tinymce from "tinymce/tinymce";

import "tinymce/themes/silver/theme";

import Editor from "@tinymce/tinymce-vue";
import "tinymce/skins/ui/oxide/skin.min.css";

import "@/assets/langs/zh_CN.js";

import "tinymce/plugins/image";

import "tinymce/plugins/link";

import "tinymce/plugins/code";

import "tinymce/plugins/table";

import "tinymce/plugins/lists";

import "tinymce/plugins/contextmenu";

import "tinymce/plugins/wordcount";

import "tinymce/plugins/colorpicker";

import "tinymce/plugins/textcolor";

import "tinymce/plugins/save";
import { mapState } from "vuex";
export default {
  data() {
    return {
      options: [
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
      value: "english",
      init: {
        language_url: "@/langs/zh_CN.js",
        language: "zh_CN",
        height: 500,
        plugins:
          "link lists image code table colorpicker textcolor wordcount contextmenu save", //自定义配置功能
        toolbar:
          "bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat | save", //自定义配置功能
        branding: false,
        autoRefresh: true,
        inputStyle: "textarea"
      },
      html: "",
      titleState: ""
    };
  },
  computed: {
    ...mapState("user", ["username", "userId"])
  },
  methods: {
    async onSubmit() {
      const result = tinymce.activeEditor.getContent();
      var activeEditor = tinymce.activeEditor;
      var editBody = activeEditor.getBody();
      activeEditor.selection.select(editBody);
      var text = activeEditor.selection.getContent({ format: "text" });
      // console.log(result); //带有html标签的内容
      // console.log(text); //纯文本内容

      if (!this.titleState.trim() || !result.trim()) {
        alert("标题或内容不能为空！");
      } else {
        const addResult = await this.$axios.post(
          "/api/addArticle",
          {
            ctime: new Date(Date.now()).toLocaleDateString(),
            title: this.titleState,
            from: "官方",
            content: result,
            text,
            user_id: -1,
            type: this.value,
            isAdmin: true
          },
          {
            headers: { Authorization: localStorage.getItem("token") }
          }
        );
        console.log(addResult);
        addResult.data.message === "success"
          ? alert("上传成功")
          : alert("上传失败");
        this.$router.push("/articlelist");
      }
    }
  },
  mounted() {
    tinymce.init({});
  },
  components: {
    Editor
  }
};
</script>

<style lang="scss" scoped>
#fuwenben {
  width: 100%;
  .title-container {
    font-size: 18px;
    margin-bottom: 10px;
  }
}
</style>