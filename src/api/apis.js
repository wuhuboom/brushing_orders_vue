// apis.js
import { initAPI } from "@/api/index.js";

// 每个请求在调用时动态获取 axios 实例，保证 window.g 已加载
const getApi = () => initAPI();

// ------------POST请求------------
export const reqLogout = (params) =>
  getApi().post("/uc/member/logout", params, { loading: true, showMsg: true });

export const register = (params) =>
  getApi().post("/user/register", params, { loading: true, showMsg: true });

export const login = (params) =>
  getApi().post("/user/login", params, { loading: true, showMsg: true });

export const editTradePassword = (params) =>
  getApi().post("/user/editTradePassword", params, { loading: true, showMsg: true });

export const editPassword = (params) =>
  getApi().post("user/editPassword", params, { loading: true, showMsg: true });

export const checkTradePassword = (params) =>
  getApi().post(`user/checkTradePassword`, params, { loading: true, showMsg: true });

export const addWithdrawalMethod = (params) =>
  getApi().post(`user/addWithdrawalMethod`, params, { loading: true, showMsg: true });

export const withdrawal = (params) =>
  getApi().post(`/account/withdrawal`, params, { loading: true, showMsg: true });

export const upload = (params) =>
  getApi().post(`/config/upload`, params, {
    loading: true,
    showMsg: true,
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateAvatar = (params) =>
  getApi().post(`/user/updateAvatar`, params, { loading: true, showMsg: true });

// ------------GET请求------------
export const userGetInfo = (params) =>
  getApi().get("/user/getInfo", { params, loading: false, showMsg: false });

export const getCustomerService = (params) =>
  getApi().get("/config/getCustomerService", { params, loading: false, showMsg: false });

export const getGlobalConfig = (params) =>
  getApi().get("/config/getGlobalConfig", { params, loading: false, showMsg: false });
export const getConfigByLang = (params) =>getApi().get("/config/getConfigByLang", {params,loading: false,showMsg: false});

export const getNoticeList = (params) =>
  getApi().get("/config/getNoticeList", { params, loading: false, showMsg: false });

export const getLevel = (params) =>
  getApi().get("/config/getLevel", { params, loading: false, showMsg: false });
export const getLevelByLang = (params) =>
  getApi().get("/config/getLevelByLang", { params,loading: false,showMsg: false});

export const getDeposit = (params) =>
  getApi().get("/account/getDeposit", { params, loading: false, showMsg: false });

export const getGoodsList = (params) =>
  getApi().get("/goods/getGoodsList", { params, loading: false, showMsg: false });

export const getGoodsListTwo = (params) =>
  getApi().get("/goods/getGoodsListTwo", { params, loading: false, showMsg: false });

export const getWithdrawals = (params) =>
  getApi().get("/account/getWithdrawals", { params, loading: false, showMsg: false });

export const getOrderInfos = (params) =>
  getApi().get("/order/getOrderInfos", { params, loading: false, showMsg: false });

export const createOrder = (params) =>
  getApi().get("/order/createOrder", { params, loading: false, showMsg: false });

export const submitOrder = (params) =>
  getApi().get(`/order/submitOrder/${params}`, { params, loading: false,showMsg: true });

export const getTradeConfig = (params) =>
  getApi().get(`/config/getTradeConfig`, { params, loading: false, showMsg: false });

export const getNotice = (params) =>
  getApi().get(`/config/getNotice/${params.id}`, { params, loading: false, showMsg: false });

export const getZoneActive = (params) =>
  getApi().get(`/config/getZoneActive`, { params, loading: false, showMsg: false });

export const bannerList = (params) =>
  getApi().get(`/config/bannerList`, { params, loading: false, showMsg: false });

export const getUserDraws = (params) =>
  getApi().get(`/lottery/getUserDraws`, { params, loading: false, showMsg: false });

export const getLotteryConfig = (params) =>
  getApi().get(`/lottery/getLotteryConfig`, { params, loading: false, showMsg: false });

export const getEmailAddress = (params) =>
  getApi().get(`/config/getEmailAddress`, { params, loading: false, showMsg: false });

export const draw = (params) =>
  getApi().get(`/lottery/draw`, { params, loading: false, showMsg: false });
export const getUserBankWallet = (params) =>
  getApi().get(`/account/getUserBankWallet
`, { params, loading: false, showMsg: false });
export const addWalletBank = (params) =>
  getApi().post("/account/addWalletBank", params, { loading: true, showMsg: true });
export const getBankWallet = (params) =>
  getApi().get(`/account/getBankWallet/${params.id}`, {  loading: false, showMsg: false });

export const withdrawalType = (params) =>
  getApi().get(`/account/withdrawalType`, { params, loading: false, showMsg: false });

