import Vue from 'vue'
import {store} from './store/store'
import VueRouter from 'vue-router'
import routes from './routes'
import Master from './components/Master'
Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: "history"
})


router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth) && !store.state.isAuthenticated) {
    next({ name: 'login' });
    return null;
  }else{
    next()
  }

})

new Vue({
  store,
  router,
  render: h => h(Master)
}).$mount('#app')
