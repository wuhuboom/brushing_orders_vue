import { defineStore } from "pinia";
// import { reqUserInfo, reqGetAllWallet } from '@/api/apis.js';
import router from "@/router/index.js";
import {
  userGetInfo,
  getGlobalConfig,
  getZoneActive,
  reqLogout,
} from "../../api/apis";
import BigNumber from "bignumber.js";

export const useUserStore = defineStore("user", {
  // 启用持久化
  persist: true,
  state: () => ({
    token: "",
    userInfo: {},
    zoneActive: {},
    GlobalConfig: {},
    accountType: "REAL",
    allWallet: [],
    assets: {},
  }),
  getters: {
    wallet() {
      return this.allWallet.find((item) => item.type === this.accountType);
    },
  },
  actions: {
    changeAccountType() {
      this.accountType = this.accountType === "REAL" ? "VIRTUAL" : "REAL";
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
    getZone({ callback } = {}) {
      getZoneActive(callback).then((res) => {
        this.zoneActive = res.data;
        if (callback) callback();
      });
    },
    async logout(notifyServer = true) {
      if (notifyServer && this.token) {
        try {
          await reqLogout();
        } catch (_) {
          /* local logout must still complete */
        }
      }
      this.token = "";
      this.userInfo = {};
      sessionStorage.removeItem("dasWithdrawalToken");
      this.allWallet = [];
      router.replace({ path: "/account/login" });
    },
    setUserBalance(data) {
      this.assets = data;
      this.assets.totalAssets = new BigNumber(data.balance)
        .plus(data.frozen)
        .plus(data.value)
        .toFixed();
    },
    getGetGlobalConfig() {
      getGlobalConfig().then((res) => {
        this.GlobalConfig = res.data || res;
      });
    },
  },
});
