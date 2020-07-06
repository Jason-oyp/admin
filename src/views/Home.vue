<template>
  <el-container style="height: 100%;">
    <el-header>
      大学生考研互助后台管理系统
      <div class="login-register">
        hello {{$store.state.user.username}}
        <ul class="user-operations">
          <li @click="loginOut">退出登录</li>
        </ul>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px" height="500px">
        <!-- <el-tree :data="data" :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree> -->
        <el-menu :default-openeds="stauts">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-message"></i>官方文章管理
            </template>
            <el-menu-item index="1-1" @click="handleNodeClick('/articlelist')">文章列表</el-menu-item>
            <el-menu-item index="1-2" @click="handleNodeClick('/addarticle')">添加文章</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>审核管理
            </template>
            <el-menu-item index="2-1" @click="handleNodeClick('/examine')">审核列表</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>用户管理
            </template>
            <el-menu-item index="3-1" @click="handleNodeClick('/userlist')">用户列表</el-menu-item>
            <!-- <el-menu-item index="3-2">选项2</el-menu-item> -->
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      data: [
        {
          label: "官方文章管理",
          children: [
            {
              label: "文章列表"
            },
            {
              label: "添加文章"
            }
          ]
        },
        {
          label: "审核管理"
        },
        {
          label: "用户管理",
          children: [
            {
              label: "用户列表"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },

  computed: {
    stauts() {
      if (
        this.$route.path === "/articlelist" ||
        this.$route.path === "/addarticle"
      ) {
        return ["1"];
      } else if (this.$route.path === "/examine") {
        return ["2"];
      } else if (this.$route.path === "/userlist") {
        return ["3"];
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      this.$router.push(data);
    },
    loginOut() {
      this.$store.commit("user/setUsername", "");
      this.$store.commit("user/setUserId", "");
      localStorage.clear();
      this.$router.push("/login");
    }
  },
  created() {
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("_id");
    this.$store.commit("user/setUsername", username);
    this.$store.commit("user/setUserId", userId);
  }
};
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  font-size: 20px;
  font-weight: bold;
  position: relative;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  // text-align: center;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  position: relative;
  width: calc(100%-200px);
  overflow: auto;
}
.el-menu {
  background-color: transparent;
}

// body > .el-container {
//   margin-bottom: 40px;
// }

// .el-container:nth-child(5) .el-aside,
// .el-container:nth-child(6) .el-aside {
//   line-height: 260px;
// }

// .el-container:nth-child(7) .el-aside {
//   line-height: 320px;
// }
.user-operations {
  background-color: #fff;
  display: none;
  li:hover {
    cursor: pointer;
    background-color: #eee;
  }
}
// .el-tree-node__label.active {
//   background-color: cadetblue;
// }
.login-register {
  font-size: 14px;
  font-weight: normal;
  position: absolute;
  right: 20px;
  top: 0;
  z-index: 100;
}
.login-register:hover .user-operations {
  display: block;
}
</style>
