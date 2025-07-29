import { defineStore } from 'pinia';
import { useTradeStore } from './trade';

export const useMarketStore = defineStore('market', {
    // 启用持久化
    persist: false,
    state: () => ({
        currentTime: Date.now(),  // 移动到state中
        allMarketObjects: {},
    }),
    getters: {
    },
    actions: {
        // 新增定时更新时间方法
        startTimeUpdate() {
            setInterval(() => {
                this.currentTime = Date.now();
            }, 1000);
        },
        setMarketDetail(detail) {
            this.allMarketObjects[detail.symbol] = detail;
            // 修改trade模块中的detail
            if (useTradeStore().symbol === detail.symbol) {
                useTradeStore().updateMarketDetail(detail);
            }
        },
    },
});