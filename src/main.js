import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/reset.css'
import '@/assets/global.css'
import axios from "axios"
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$showMessage = function (message, type) {
  this.$message({
    message,
    type,
    duration: 1500
  });
}
Vue.prototype.$axios = axios;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
