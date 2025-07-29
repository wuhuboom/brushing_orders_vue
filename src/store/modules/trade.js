import { defineStore } from 'pinia';
import { reqGetSymbolDetail, reqGetUserSelectMarketList } from '../../api/apis';
import BigNumber from 'bignumber.js';

export const useTradeStore = defineStore('trade', {
    // 启用持久化
    persist: true,
    state: () => ({
        symbol: 'OKBTCUSDT',
        detail: {},
        tradeType: 'NORMAL',
        userSelectMarketList: [],
    }),
    getters: {
    },
    actions: {
        setSymbol(symbol) {
            this.symbol = symbol;
        },
        setTradeType(type) {
            this.tradeType = type;
        },
        setMarketDetail(detail) {
            this.detail = detail;
        },
        // 获取用户所有自选行情
        getUserSelectMarketList() {
            reqGetUserSelectMarketList().then((res) => {
                this.userSelectMarketList = res.data;
            });
        },
        getSymbolDetail() {
            reqGetSymbolDetail({ symbol: this.symbol }).then((res) => {
                this.detail = res.data;
            });
        },
        updateMarketDetail(detail) {
            // console.log(detail, 'detail')
            this.detail.sellPrice = detail.sellPrice
            this.detail.price = detail.price
            this.detail.buyPrice = detail.buyPrice
            this.detail.rate = new BigNumber(this.detail.sellPrice).minus(this.detail.lastClosePrice).dividedBy(this.detail.lastClosePrice).multipliedBy(100).toFixed(2)
            if (this.detail.rate === 'NaN') {
                this.detail.rate = 0
            }
            this.detail.high = detail.high
            this.detail.low = detail.low
            this.detail.open = detail.open
        },
        setPriceToDetail(data) {
            this.detail.sellPrice = data[1].close ? data[1].close : 0
            this.detail.price = this.detail.sellPrice
            this.detail.buyPrice = data[1].price2 ? data[1].price2 : 0
            this.detail.lastClosePrice = data[0].close ? data[0].close : 0
            this.detail.rate = new BigNumber(this.detail.sellPrice).minus(this.detail.lastClosePrice).dividedBy(this.detail.lastClosePrice).multipliedBy(100).toFixed(2)
            if (this.detail.rate === 'NaN') {
                this.detail.rate = 0
            }
            this.detail.high = data[1].high
            this.detail.low = data[1].low
            this.detail.open = data[1].open
        }
    },
});