import api from '@/api/index.js'
// ------------post请求------------
export const reqLogout = (params) => api.post('/uc/member/logout', params, { loading: true, showMsg: true, })// 请求退出登录
// ------------get请求------------
export const reqGetTradeConfig = (params) => api.get('/app/exchangeConfig/list', { params: params, loading: false, showMsg: false, })// 获取交易配置

// 注册
export const register = (params) => api.post('/user/register', params, { loading: true, showMsg: true, })// 注册
export const login = (params) => api.post('/user/login', params, { loading: true, showMsg: true, })// 登录
export const editTradePassword = (params) => api.post('/user/editTradePassword', params, { loading: true, showMsg: true, })// 修改交易密码
export const editPassword = (params) => api.post('user/editPassword', params, { loading: true, showMsg: true, })// 修改密码
export const checkTradePassword = (params) => api.post(`user/checkTradePassword`, params, { loading: true, showMsg: true, })// 验证交易密码
export const addWithdrawalMethod = (params) => api.post(`user/addWithdrawalMethod`, params, { loading: true, showMsg: true, })// 验证交易密码

export const withdrawal = (params) => api.post(`/account/withdrawal`, params, { loading: true, showMsg: true, })// 验证交易密码
export const upload = (params) => api.post(`/config/upload`, params, { loading: true, showMsg: true, headers: { 'Content-Type': 'multipart/form-data' }})// 上传头像

export const updateAvatar = (params) => api.post(`/user/updateAvatar`, params, { loading: true, showMsg: true, })// 上传头像
export const userGetInfo = (params) => api.get('/user/getInfo', { params: params, loading: false, showMsg: false, })// 获取交易配置

export const getCustomerService = (params) => api.get('/config/getCustomerService', { params: params, loading: false, showMsg: false, })// 获取交易配置

export const getGlobalConfig = (params) => api.get('/config/getGlobalConfig', { params: params, loading: false, showMsg: false, })// 获取基本配置

export const getNoticeList = (params) => api.get('/config/getNoticeList', { params: params, loading: false, showMsg: false, })// 获取公告配置

export const getLevel = (params) => api.get('/config/getLevel', { params: params, loading: false, showMsg: false, })// 获取vip等级配置

export const getDeposit = (params) => api.get('/account/getDeposit', { params: params, loading: false, showMsg: false, })// 获取vip等级配置

export const getGoodsList = (params) => api.get('/goods/getGoodsList', { params: params, loading: false, showMsg: false, })// 获取vip等级配置

export const getWithdrawals = (params) => api.get('/account/getWithdrawals', { params: params, loading: false, showMsg: false, })// 获取vip等级配置

export const getOrderInfos = (params) => api.get('/order/getOrderInfos', { params: params, loading: false, showMsg: false, })// 获取用户订单记录

export const createOrder = (params) => api.get('/order/createOrder', { params: params, loading: false, showMsg: false, })// 创建新订单

export const submitOrder = (params) => api.get(`/order/submitOrder/${params}`, { params: params, loading: false, showMsg: true, })// 提交订单

export const getTradeConfig = (params) => api.get(`/config/getTradeConfig`, { params: params, loading: false, showMsg: false, })// 提交订单


export const getNotice = (params) => api.get(`/config/getNotice/`+params.id, { params: params, loading: false, showMsg: false, })// 提交订单

export const getZoneActive = (params) => api.get(`/config/getZoneActive`,{ params: params, loading: false, showMsg: false, })// 提交订单

