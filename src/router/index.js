import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Home from '@/pages/Home'
import Setting from '@/pages/Setting'
import Navigation from '@/pages/Navigation'
import User from '@/pages/User'
import Category from '@/pages/Category'
import Post from '@/pages/Post'
import Writing from '@/pages/Writing'
import Comment from '@/pages/Comment'
import Log from '@/pages/Log'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/home', name: 'Home', component: Home },
    { path: '/setting', name: 'Setting', component: Setting },
    { path: '/navigation', name: 'Navigation', component: Navigation },
    { path: '/user', name: 'User', component: User },
    { path: '/category', name: 'Category', component: Category },
    { path: '/post', name: 'Post', component: Post },
    { path: '/post/:id', name: 'Writing', component: Writing },
    { path: '/post/:id/comment', name: 'Comment', component: Comment },
    { path: '/log', name: 'Log', component: Log }
  ]
})
