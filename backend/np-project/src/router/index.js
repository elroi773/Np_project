// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/index.vue' 
import Join1 from '@/views/join1.vue'
import Join2 from '@/views/join2.vue'
import Join3 from '@/views/join3.vue'
import Join4 from '@/views/join4.vue'
import Join5 from '@/views/join5.vue'
import Login from '@/views/login.vue'
import Main from '@/views/main.vue'
import Join2_Sell from '@/views/join2_sell.vue'
import Join4_Sell from '@/views/join4_sell.vue'
import Notifications from '@/views/notifications.vue'



const routes = [
  { path: '/', name: 'Index', component: Index },
  { 
    path: '/join1', 
    name: 'Join1', 
    component: Join1 
  } ,
  {
    path: '/join2',
    name: 'Join2',
    component: Join2
  },
  {
    path: '/join3',
    name: 'Join3',
    component: Join3
  },
  {
    path: '/join4',
    name: 'Join4',
    component: Join4
  },
  {
    path: '/join5',
    name: 'Join5',
    component: Join5
  },
  {
    path:'/login',
    name:'Login',
    component: Login
  },
  {
    path: '/main',
    name: 'Main',
    component: Main
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: Notifications, 
  },
  {
    path: '/join2_sell',
    name: 'Join2Sell',
    component: Join2_Sell
  },
  {
    path:'/join4_sell',
    name: 'Join4Sell',
    component: Join4_Sell
  }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})



export default router
