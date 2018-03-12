import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router'
import routes from './router/router'
import {routerMode} from './api/env'
Vue.config.productionTip = false;

Vue.use(VueRouter);
// 或者你可以新建一个方法
VueRouter.prototype.go = function (n) {
  this.go((n||-1));
}

const router = new VueRouter({
	routes,
	mode: routerMode,
	strict: process.env.NODE_ENV !== 'production'
});

/* eslint-disable no-new */
new Vue({
  el: '#index',
  router,
  template: '<App/>',
  components: { App }
});