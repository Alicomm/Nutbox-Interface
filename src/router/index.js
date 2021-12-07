import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import CommunityIndex from '@/views/community/Index'
import CommunityHome from '@/views/community/CommunityHome'
import DeployCommunityToken from '@/views/community/DeployCommunityToken'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/community',
    name: 'community',
    component: CommunityIndex,
    redirect: '/community/index',
    children: [
      {
        path: 'index',
        component: CommunityHome
      },
      {
        path: 'deploy-token',
        component: DeployCommunityToken
      }
    ]
  }
]

const router = new VueRouter({
  linkActiveClass: 'active',
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.query.id) {
//     next()
//   } else if (to.matched[0].path === '/specify' && from.query.id) {
//     next({
//       path: to.path,
//       query: {
//         ...to.query,
//         id: from.query.id
//       }
//     })
//   } else if (to.matched[0].path === '/specify' && !from.query.id) {
//     next({
//       path: '/'
//     })
//   } else {
//     next()
//   }
// })
export default router
