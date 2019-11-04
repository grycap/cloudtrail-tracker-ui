// Polyfills
import 'es6-promise/auto'
// import 'babel-polyfill'

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import App from './App'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'
import VuesticPlugin from 'vuestic-theme/vuestic-plugin'
import './i18n'
import YmapPlugin from 'vue-yandex-maps'
import cognitoAuth from './cognito'
import Helpers from './misc/helpers'
import VueResource from 'vue-resource'

window.axios = require('axios')
window.Helpers = Helpers;



window.axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  // const AUTH_TOKEN = document.getElementsByName("token")["0"].content;
  var session = JSON.parse(localStorage.getItem("session"))  
  const AUTH_TOKEN = session.user.token   
  if(AUTH_TOKEN){
      config.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error.response);
});


Vue.use(VuesticPlugin)
Vue.use(YmapPlugin)

// NOTE: workaround for VeeValidate + vuetable-2
Vue.use(VeeValidate, {fieldsBagName: 'formFields'})
Vue.prototype.$eventHub = new Vue();

sync(store, router)

let mediaHandler = () => {
  if (window.matchMedia(store.getters.config.windowMatchSizeLg).matches) {
    store.dispatch('toggleSidebar', true)
  } else {
    store.dispatch('toggleSidebar', false)
  }
}

router.beforeEach((to, from, next) => {
  store.commit('setLoading', true)
  next()
})

router.afterEach((to, from) => {
  mediaHandler()
  store.commit('setLoading', false)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  cognitoAuth,
  store,
  render: h => h(App)
  // template: '<App/>',
  // components: { App }
})
