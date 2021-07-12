import Vue from 'vue'

const Coms = [
  {
    name: 'hamburger',
    component: () => import('@/components/hamburger.vue')
  },
  {
    name: 'sdialog',
    component: () => import('@/components/selectDialog.vue')
  },
  {
    name: 'main-box',
    component: () => import('@/components/mainBox.vue')
  },
  {
    name: 'filter-box',
    component: () => import('@/components/filterBox.vue')
  },
  {
    name: 'm-table',
    component: () => import('@/components/mTable.vue')
  },
  {
    name: 'm-pagin',
    component: () => import('@/components/mPagination.vue')
  },
  {
    name: 'm-dialog',
    component: () => import('@/components/mDialog.vue')
  },
  {
    name: 'm-progress',
    component: () => import('@/components/mProgress.vue')
  },
  {
    name: 'm-tree',
    component: () => import('@/components/mTree.vue')
  },
  {
    name: 'm-error',
    component: () => import('@/components/errorDialog.vue')
  },
  {
    name: 'm-theme',
    component: () => import('@/components/theme.vue')
  }
]

const vueComs = () => {
  Coms.forEach((item) => {
    return Vue.component(item.name, item.component)
  })
}
export default vueComs
