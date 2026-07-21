import { defineStore } from 'pinia'
export const useScrollStore = defineStore('scroll', {
  state: () => ({
    scrollCache: {} // key：页面组件name，value：滚动高度
  }),
  actions: {
    setPageScroll(pageName, top) {
      this.scrollCache[pageName] = top
    },
    getPageScroll(pageName) {
      return this.scrollCache[pageName] ?? 0
    }
  }
})