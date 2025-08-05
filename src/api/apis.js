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


export const userGetInfo = (params) => api.get('/user/getInfo', { params: params, loading: false, showMsg: false, })// 获取交易配置

export const getCustomerService = (params) => api.get('/config/getCustomerService', { params: params, loading: false, showMsg: false, })// 获取交易配置

export const getGlobalConfig = (params) => api.get('/config/getGlobalConfig', { params: params, loading: false, showMsg: false, })// 获取基本配置



