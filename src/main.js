import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'material-icons/iconfont/material-icons.css';
import './assets/styles/index.css';

Vue.use(Vuesax,VueAxios,axios);
Vue.config.productionTip = false;

//Local
//axios.defaults.baseURL = 'http://localhost:3000/api';
//Prod
axios.defaults.baseURL = 'https://nodex.herokuapp.com/api';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
