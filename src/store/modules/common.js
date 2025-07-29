import { defineStore } from 'pinia';
import { reqGetSystemConfig, reqGetClientVersion } from '../../api/apis';

export const useCommonStore = defineStore('common', {
    // 启用持久化
    persist: true,
    state: () => ({
        clientLang: 'en',
        clientVersion: null,
        path: '',
        shareList: [10, 50, 100, 500],
        setting: {}
    }),
    getters: {
        lang: (state) => state.clientLang,

    },
    actions: {
        updateLang(newLang) {
            this.clientLang = newLang;
        },
        setPath(path) {
            this.path = path
        },
        getSystemConfig() {
            reqGetSystemConfig().then(res => {
                this.setting = res.data
                this.updateClientVersion()
            })
        },
        getClientVersion() {
            reqGetClientVersion().then(res => {
                const clientVersionCode = this.clientVersion || 0;
                if (clientVersionCode > 0 && clientVersionCode !== res.data) {
                    window.location.href = this.setting.h5Link;
                }
                this.clientVersion = res.data;
                this.updateClientVersion()
            })
        },
        updateClientVersion() {
            setTimeout(() => {
                this.getClientVersion()
            }, 5000);
        },
    },
});