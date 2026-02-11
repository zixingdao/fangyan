import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import UserLayout from '../layouts/UserLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import Home from '../views/web/Home.vue'
import Login from '../views/web/Login.vue'
import Register from '../views/web/Register.vue'
import { useUserStore } from '../store/user'
import { ElMessage } from 'element-plus'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: UserLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/web/Profile.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'guide',
        name: 'Guide',
        component: () => import('../views/web/Guide.vue')
      },
      {
        path: 'topics',
        name: 'Topics',
        component: () => import('../views/web/Topics.vue')
      },
      {
        path: 'ranking',
        name: 'Ranking',
        component: () => import('../views/web/Ranking.vue')
      },
      {
        path: 'honor',
        name: 'Honor',
        component: () => import('../views/web/Honor.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue')
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/admin/UserList.vue')
      },
      {
        path: 'rankings',
        name: 'RankingMgr',
        component: () => import('../views/admin/RankingMgr.vue')
      },
      {
        path: 'content',
        name: 'ContentMgr',
        component: () => import('../views/admin/ContentMgr.vue')
      },
      {
        path: 'recordings',
        name: 'RecordingMgr',
        component: () => import('../views/admin/RecordingMgr.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/admin/Settings.vue')
      },
      {
        path: 'logs',
        name: 'LogMgr',
        component: () => import('../views/admin/LogMgr.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局路由守卫
router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore()
  const token = userStore.token
  const user = userStore.user

  // 检查是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      ElMessage.warning('请先登录')
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }

    // 检查是否需要特定角色
    const requiredRole = to.matched.find(record => record.meta.role)?.meta.role
    if (requiredRole && user?.role !== requiredRole) {
      ElMessage.error('无权访问该页面')
      return next('/')
    }
  }

  next()
})

export default router
