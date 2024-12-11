import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { authMiddleware } from './middleware/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/donations',
    name: 'donations',
    component: () => import('@/views/Donations.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/documents',
    name: 'documents',
    component: () => import('@/views/Documents.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/alerts',
    name: 'alerts',
    component: () => import('@/views/Alerts.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/media',
    name: 'media',
    component: () => import('@/views/Media.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('@/views/News.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/events',
    name: 'events',
    component: () => import('@/views/Events.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/impact',
    name: 'impact',
    component: () => import('@/views/Impact.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory('/'),
  routes
});

router.beforeEach(authMiddleware);

export default router;
