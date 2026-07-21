import { initAPI } from '@/api/index.js'

const getApi = () => initAPI()
// ------------post请求------------
export const reqLogout = (params) => getApi().post('/uc/member/logout', params, { loading: true, showMsg: true, })// 请求退出登录
// ------------get请求------------
export const reqGetTradeConfig = (params) => getApi().get('/app/exchangeConfig/list', { params: params, loading: false, showMsg: false, })// 获取交易配置

// 注册
export const register = (params) => getApi().post('/user/register', params, { loading: true, showMsg: true, })// 注册
export const login = (params) => getApi().post('/user/login', params, { loading: true, showMsg: true, })// 登录
export const editTradePassword = (params) => getApi().post('/user/editTradePassword', params, { loading: true, showMsg: true, })// 修改交易密码
export const editPassword = (params) => getApi().post('user/editPassword', params, { loading: true, showMsg: true, })// 修改密码
export const checkTradePassword = (params) => getApi().post(`user/checkTradePassword`, params, { loading: true, showMsg: true, })// 验证交易密码
export const addWithdrawalMethod = (params) => getApi().post(`user/addWithdrawalMethod`, params, { loading: true, showMsg: true, })// 验证交易密码

export const withdrawal = (params) => getApi().post(`/account/withdrawal`, params, { loading: true, showMsg: true, })// 验证交易密码
export const upload = (params) => getApi().post(`/config/upload`, params, { loading: true, showMsg: true, headers: { 'Content-Type': 'multipart/form-data' }})// 上传头像

export const updateAvatar = (params) => getApi().post(`/user/updateAvatar`, params, { loading: true, showMsg: true, })// 上传头像
export const userGetInfo = (params) => getApi().get('/user/getInfo', { params: params, loading: false, showMsg: false, })// 获取交易配置

export const getCustomerService = (params) => getApi().get('/config/getCustomerServiceByLang', { params: params, loading: false, showMsg: false, })// 获取交易配置

export const getGlobalConfig = (params) => getApi().get('/config/getConfigByLang', { params: params, loading: false, showMsg: false, })// 获取基本配置

export const getNoticeList = (params) => getApi().get('/config/getNoticeListByLang', { params: params, loading: false, showMsg: false, })// 获取公告配置

export const getSplashAdImage = (params) => getApi().get('/config/getSplashAdImage', { params: params, loading: false, showMsg: false, })// 获取公告配置

export const getLevel = (params) => getApi().get('/config/getLevelByLang', { params: params, loading: false, showMsg: false, })// 获取vip等级配置

export const getDeposit = (params) => getApi().get('/account/getDeposit', { params: params, loading: false, showMsg: false, })// 获取vip等级配置

export const getGoodsList = (params) => getApi().get('/goods/getGoodsList', { params: params, loading: false, showMsg: false, })// 获取vip等级配置

export const getWithdrawals = (params) => getApi().get('/account/getWithdrawals', { params: params, loading: false, showMsg: false, })// 获取vip等级配置

export const getOrderInfos = (params) => getApi().get('/order/getOrderInfos', { params: params, loading: false, showMsg: false, })// 获取用户订单记录

export const createOrder = (params) => getApi().get('/order/createOrder', { params: params, loading: false, showMsg: false, })// 创建新订单

export const submitOrder = (params) => getApi().get(`/order/submitOrder/${params}`, { params: params, loading: false, showMsg: true, })// 提交订单

export const getGoodsInfo = (params) => getApi().get(`/order/getOrderInfo/${params}`, { params: params, loading: false, showMsg: false, })// 获取订单信息

export const getTradeConfig = (params) => getApi().get(`/config/getTradeConfig`, { params: params, loading: false, showMsg: false, })// 提交订单


export const getNotice = (params) => getApi().get(`/config/getNoticeByLang/`+params.id, { params: params, loading: false, showMsg: false, })// 提交订单

export const getZoneActive = (params) => getApi().get(`/config/getZoneActive`, { params: params, loading: false, showMsg: false, })// 获取时区

export const getUnreadNoticeCount = (params) => getApi().get(`/config/getUnreadNoticeCount`, { params: params, loading: false, showMsg: false, })// 获取未读通知

export const markNoticeRead = (params) => getApi().post(`config/markNoticeRead/${params}`, params, { loading: true, showMsg: true, })// 验证交易密码
