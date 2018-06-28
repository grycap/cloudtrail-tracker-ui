import Vue from 'vue'
import Router from 'vue-router'
import cognitoAuth from '@/cognito'
import Login from '@/components/auth/login/Login.vue'
import Signup from '@/components/auth/signup/Signup.vue'
import ResetPassword from '@/components/auth/resetpass/PasswordReset.vue'
import Dashboard from '@/components/dashboard/Dashboard.vue'
import PasswordResetConfirm from '@/components/auth/confirpassreset/PasswordResetConfirm.vue'
import Confirm from '@/components/auth/confirm/Confirm.vue'
import PasswordChange from '@/components/auth/changepass/PasswordChange.vue'
import SearchByUser from '@/components/SearchByUsers.vue'
import CursoAWS from '@/components/CursoAWS.vue'




import menuModule from 'vuex-store/modules/menu'

Vue.use(Router)

function requireAuth (to, from, next) {
  cognitoAuth.isAuthenticated((err, loggedIn) => {
    if (err) return next()
    if (!loggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  })
}

export default new Router({
  linkActiveClass: 'active',
  // mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Dashboard, beforeEnter: requireAuth  },
    { path: '/dashboard', component: Dashboard, beforeEnter: requireAuth },
    { path: '/login', component: Login},
    { path: '/signup', component: Signup},
    { path: '/resetpass', component: ResetPassword},
    { path: '/confirm', component: Confirm },
    { path: '/changepassword', component: PasswordChange, beforeEnter: requireAuth },
    { path: '/confirmpassreset', component: PasswordResetConfirm },    
    { path: '/search_by_user', component: SearchByUser , beforeEnter: requireAuth },
    { path: '/cursoaws', component: CursoAWS , beforeEnter: requireAuth },
    
    // { path: '/curso_cloud_aws', component: Cursocloudaws },
     { path: '/logout',
      beforeEnter (to, from, next) {
        cognitoAuth.logout();
        
        
        next('/login')
        document.getElementsByName('token')['0'].content = '';
        localStorage.removeItem('session');
      }
    }
  ]
})

// const demoRoutes = []
// if (process.env.NODE_ENV === 'development') {
//   const VueComponentTree = require('vue-component-tree').default

//   demoRoutes.push(
//     VueComponentTree(require.context('./..', true, /.demo.vue$/), '/demo')
//   )
// }

// export default new Router({
//   routes: [
//     ...demoRoutes,
//     ...generateRoutesFromMenu(menuModule.state.items),
//     {
//       path: '*',
//       redirect: { name: getDefaultRoute(menuModule.state.items).name }
//     }
//   ]
// })

// function generateRoutesFromMenu (menu = [], routes = []) {
//   for (let i = 0, l = menu.length; i < l; i++) {
//     let item = menu[i]
//     if (item.path) {
//       routes.push(item)
//     }
//     if (item.children) {
//       generateRoutesFromMenu(item.children, routes)
//     }
//   }
//   return routes
// }

// function getDefaultRoute (menu = []) {
//   let defaultRoute

//   menu.forEach((item) => {
//     if (item.meta.default) {
//       defaultRoute = item
//     } else if (item.children) {
//       let defaultChild = item.children.find((i) => i.meta.default)
//       defaultRoute = defaultChild || defaultRoute
//     }
//   })

//   return defaultRoute
// }
