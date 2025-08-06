import { defineStore } from 'pinia';
// import { reqUserInfo, reqGetAllWallet } from '@/api/apis.js';
import router from '@/router/index.js';
import { userGetInfo,getGlobalConfig } from '../../api/apis';
import BigNumber from 'bignumber.js';

export const useUserStore = defineStore('user', {
    // 启用持久化
    persist: true,
    state: () => ({
        token: '',
        userInfo: {},
        GlobalConfig:{},
        accountType: 'REAL',
        allWallet: [],
        assets: {}
    }),
    getters: {
        wallet() {
            return this.allWallet.find((item) => item.type === this.accountType);
        }
    },
    actions: {
        changeAccountType() {
            this.accountType = this.accountType === 'REAL' ? 'VIRTUAL' : 'REAL';
        },
        setToken(token) {
            this.token = token;
        },
        setUserInfo(userInfo) {
            this.userInfo = userInfo;
        },
        setAllWallet(allWallet) {
            this.allWallet = allWallet;
        },
        getUserInfo({ callback } = {}) {
            userGetInfo(callback).then((res) => {
                this.userInfo = res.data;
                if (callback) callback();
            });
        },
        logout() {
            this.token = '';
            this.userInfo = {};
            this.allWallet = [];
            router.replace({ path: '/account/login' });
        },
        setUserBalance(data) {
            this.assets = data;
            this.assets.totalAssets = new BigNumber(data.balance).plus(data.frozen).plus(data.value).toFixed();
        },
        getGetGlobalConfig(){
            getGlobalConfig().then(res =>{
                this.GlobalConfig = res
            })
        }
    },
});