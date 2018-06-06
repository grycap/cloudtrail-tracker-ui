import Vue from 'vue'
import VueResource from 'vue-resource'
import router from './router'
import cognitoAuth from './cognito'
import App from './App.vue'
import VueChartkick from 'vue-chartkick'
import Helpers from './misc/helpers'
import env from './env.js'
// import axios from 'axios'

window.axios = require('axios')
window.Helpers = Helpers;
// window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

Vue.use(VueChartkick)
Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  cognitoAuth,
  // replace the content of <div id="app"></div> with App
  render: h => h(App)
})

