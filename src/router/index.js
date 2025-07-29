// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

// 自动导入views目录下所有vue文件作为路由
const modules = import.meta.glob('../views/**/*.vue')

const routes = Object.entries(modules).map(([path, component]) => {
  // Skip files in components directory
  if (path.includes('/components/')) return null
  
  const routePath = path
    .replace('../views', '')
    .replace(/\.vue$/, '')
    .replace(/\/index$/, '') || '/'
  
  return {
    path: routePath,
    component,
    name: routePath.split('/').filter(Boolean).join('-') || 'home'
  }
}).filter(Boolean)  // 过滤掉null值
console.log(routes, 'routes')

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 更新路由拦截
router.beforeEach((to, from, next) => {
  const isAuthenticated = true
  if (to.path !== '/account/login' && !isAuthenticated) {
    next('/account/login')
  } else {
    next()
  }
})

export default router
