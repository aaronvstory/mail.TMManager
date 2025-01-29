import { createRouter, createWebHistory } from 'vue-router'
import EmailList from '../views/EmailList.vue'
import EmailView from '../views/EmailView.vue'

const routes = [
  {
    path: '/',
    name: 'Inbox',
    component: EmailList,
    props: { folder: 'inbox' }
  },
  {
    path: '/sent',
    name: 'Sent',
    component: EmailList,
    props: { folder: 'sent' }
  },
  {
    path: '/drafts',
    name: 'Drafts',
    component: EmailList,
    props: { folder: 'drafts' }
  },
  {
    path: '/trash',
    name: 'Trash',
    component: EmailList,
    props: { folder: 'trash' }
  },
  {
    path: '/email/:id',
    name: 'EmailView',
    component: EmailView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
