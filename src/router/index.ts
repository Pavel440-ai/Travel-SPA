import { createRouter, createWebHistory, type RouterOptions } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DestinationView from '../views/DestinationView.vue'
import ExperienceView from '../views/ExperienceView.vue'

const routes: RouterOptions['routes'] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/destination/:slug',
    name: 'destination',
    component: DestinationView,
    props: true,
    children: [
      {
        path: ':experienceSlug',
        name: 'experience',
        component: ExperienceView,
        props: true,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router





