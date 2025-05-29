// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import Join1 from '../views/join1.vue' 



const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index
  },
  { 
    path: '/join1', 
    name: 'Join1', 
    component: Join1 
  } 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
