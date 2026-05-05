import { defineStore } from 'pinia';
// import { reqUserInfo, reqGetAllWallet } from '@/api/apis.js';
import router from '@/router/index.js';
import { userGetInfo,getGlobalConfig,getZoneActive } from '../../api/apis';
import BigNumber from 'bignumber.js';

let userInfoRequest = null;

export const useUserStore = defineStore('user', {
    // 启用持久化
    persist: true,
    state: () => ({
        token: '',
        userInfo: {},
        zoneActive:{},
        GlobalConfig:{},
        accountType: 'REAL',
        allWallet: [],
        assets: {},
        userWallerType:{}
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
        setuserWallerType(userWallerType) {
            this.userWallerType = userWallerType
        },
        setUserInfo(userInfo) {
            this.userInfo = userInfo;
        },
        setAllWallet(allWallet) {
            this.allWallet = allWallet;
        },
        getUserInfo({ callback, force = false } = {}) {
            if (userInfoRequest) {
                return userInfoRequest.then((data) => {
                    if (callback) callback();
                    return data;
                });
            }

            if (!force && this.userInfo?.username) {
                if (callback) callback();
                return Promise.resolve(this.userInfo);
            }

            userInfoRequest = userGetInfo()
                .then((res) => {
                    this.userInfo = res.data || {};
                    if (callback) callback();
                    return this.userInfo;
                })
                .finally(() => {
                    userInfoRequest = null;
                });

            return userInfoRequest;
        },
        getZone({ callback } = {}) {
            getZoneActive(callback).then((res) => {
                this.zoneActive = res.data;
                if (callback) callback();
            });
        },
        logout() {
            this.token = '';
            this.userInfo = {};
            this.allWallet = [];
            this.userWallerType = {};
            if (router.currentRoute.value.path !== '/account/login') {
                router.replace({ path: '/account/login' }).catch(() => {});
            }
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
