import api from '@/api/index.js'


// ------------post请求------------
export const reqLogout = (params) => api.post('/uc/member/logout', params, { loading: true, showMsg: true, })// 请求退出登录
export const reqEditPassword = (params) => api.post('uc/member/updatePassword', params, { loading: true, showMsg: true, })//请求修改密码
export const reqBindBank = (params) => api.post('/ucenter/ucBindBankCard/bindBankCard', params, { loading: true, showMsg: true, })// 请求绑定银行卡
export const reqWithdraw = (params) => api.post('/ucenter/ucWithdrawal/create', params, { loading: true, showMsg: true, })// 请求出金
export const reqDeposite = (params) => api.post('/ucenter/ucDeposit/create', params, { loading: true, showMsg: true, })// 请求入金
export const reqMarketOrder = (params) => api.post('/exchange/order/open', params, { loading: true, showMsg: true, })// 请求市价单
export const reqLimitOrder = (params) => api.post('/exchange/entrust/add', params, { loading: true, showMsg: true, })// 请求限价单
export const reqCloseOrder = (params) => api.post('/exchange/order/close', params, { loading: true, showMsg: true, })// 请求关闭订单
export const reqRealNameAuth = (params) => api.post('/ucenter/ucRealNameVerified/submitApply', params, { loading: true, showMsg: true, })// 请求实名认证
export const reqEditNickname = (params) => api.post('/uc/member/updateNickname', params, { loading: true, showMsg: true, })// 请求修改昵称
export const updateAvatar = (params) => api.post('/uc/member/updateAvatar', params, { loading: true, showMsg: true, })// 请求修改头像
export const reqSendCodeToPhone = (params) => api.post(`/common/sms/send-code/${params}`,{}, { loading: true, showMsg: true, })// 请求获取手机验证码

// ------------get请求------------
// 请求获取客户端版本号
export const reqGetClientVersion = (params) => api.get('/common/setting/getVersionCode/2', { params: params, loading: false, showMsg: false, })
export const reqGetUserBalance = (params) => api.get('/ucenter/account/getUcAccountByMemberId', { params: params, loading: false, showMsg: false, })// 请求获取用户余额
export const reqGetSystemConfig = (params) => api.get('/common/setting/get', { params: params, loading: false, showMsg: false, })// 请求获取系统配置
export const reqGetBannerList = (params) => api.get('/home/homeCarouselPic', { params: params, loading: false, showMsg: false, })// 请求获取轮播图
export const reqGetHotCoinList = (params) => api.get('/exchange/objects/newList', { params: params, loading: false, showMsg: false, })// 请求获取热门币种
export const reqGetSymbolDetail = (params) => api.get(`/exchange/objects/detail/${params.symbol}`, { loading: false, showMsg: false, })// 请求获取交易对详情、
export const reqGetCommonQuestion = (params) => api.get('/ucenter/ucCommonQuestion/listByType', { params: params, loading: false, showMsg: false, })// 请求获取常见问题
export const reqGetBindList = (params) => api.get('/ucenter/ucBindBankCard/listMyCards', { params: params, loading: false, showMsg: false, })// 请求获取绑定列表
export const reqGetBindDetail = (params) => api.get('/ucenter/ucBindBankCard/detail', { params: params, loading: false, showMsg: false, })// 请求获取绑定的银行卡详情
export const reqGetWalletBalance = (params) => api.get('/ucenter/configCurrency/walletBalance', { params: params, loading: false, showMsg: false, })// 请求获取充值配置
export const reqGetCurrencyConfig = (params) => api.get('/ucenter/configCurrency/currency', { params: params, loading: false, showMsg: false, })// 请求获取提现配置
export const reqGetMessageList = (params) => api.get('/ucenter/ucMessageCenter/listMyMessages', { params: params, loading: false, showMsg: false, })// 获取消息列表
export const reqGetOrderList = (params) => api.get('/exchange/order/list', { params: params, loading: false, showMsg: false, })// 请求获取订单列表
export const reqGetEntrustList = (params) => api.get('/exchange/entrust/list', { params: params, loading: false, showMsg: false, })// 请求获取委托列表
export const reqGetHistoryList = (params) => api.get('/exchange/exchangeOrderHistory/list', { params: params, loading: false, showMsg: false, })// 请求获取历史订单列表
export const reqSendCodeToEmail = (params) => api.get('/common/sendMailVcode', { params: params, loading: true, showMsg: true })// 请求发送短信验证码
export const bankCards = (params) => api.get('/exchange/bankcard/bankCards', { params: params, loading: true, showMsg: true })// 请求银行卡
export const reqFindPasswordByPhone = (params) => api.get('/common/phonePwdByVcode', { params: params,loading: true, showMsg: true, }) // 请求手机忘记密码
export const getConversionRate = (params) => api.get('/ucenter/configCurrency/getConversionRate', { params: params, loading: false, showMsg: false })//汇率
export const reqFindPasswordByEmail = (params) => api.get('/common/changePwdByVcode', { params: params, loading: true, showMsg: true, })// 请求邮箱忘记密码
export const reqGetRechargeList = (params) => api.get('/ucenter/ucDeposit/list', { params: params, loading: false, showMsg: false, })// 请求获取充值记录
export const ucDepositList = (params) => api.post(`/ucenter/ucDeposit/list`, params, { loading: false, showMsg: false, })// 获取银行卡充值信息
export const reqGetWithdrawList = (params) => api.get('/ucenter/ucWithdrawal/list', { params: params, loading: false, showMsg: false, })// 请求获取提现记录
export const reqGetTradeConfig = (params) => api.get('/app/exchangeConfig/list', { params: params, loading: false, showMsg: false, })// 获取交易配置
export const reqGetPositionDetail = (params) => api.get('/exchange/order/detail', { params: params, loading: false, showMsg: false, })// 获取持仓详情


// ------------delete请求------------
export const reqDeleteBind = (id) => api.delete(`/ucenter/ucBindBankCard/delete/${id}`, { loading: true, showMsg: true, })//请求删除银行卡
export const reqDeleteEntrust = (id) => api.post(`/exchange/entrust/cancel/${id}`, { loading: true, showMsg: true, })//请求删除委托

// ------------put请求------------
export const reqReadMessage = (id) => api.put(`/ucenter/ucMessageCenter/read/${id}`, {}, { loading: true, showMsg: true, })// 请求读取消息



export const reqValidMail = (params) => api.get('/common/validMailCode', { params: params, loading: true, showMsg: true })// 请求验证邮箱
export const reqRegisterAccount = (params) => api.post('/uc/member/register', params, { loading: true, showMsg: true, })// 请求注册账号
export const reqUserInfo = (params) => api.get('/uc/member/detail', { params: params, loading: false, showMsg: false })// 请求获取用户信息
export const reqBannerList = (params) => api.get('/home/homeCarouselPic', { params: params, loading: false, showMsg: false, })// 请求获取轮播图
export const reqHotCoinList = (params) => api.get('/exchange/objects/hot', { params: params, loading: false, showMsg: false, })// 请求获取热门币种
export const reqRechargeList = (params = {}) => api.post('/ucenter/ucDeposit/list', params, { loading: false, showMsg: false, })// 请求获取充值列表
export const reqUsdtRate = (params) => api.get('/common/getRealTimeUsdMarket', { params: params, loading: false, showMsg: false, })//请求获取USDT汇率
export const reqRecharge = (params) => api.post('/ucenter/ucDeposit/create', params, { loading: true, showMsg: true, })//请求充值
export const reqGetInviteDetail = (params) => api.get('/myTeam/invitation-info', { params: params, loading: false, showMsg: false, })//请求获取邀请信息
export const reqGetInviteRecord = (params) => api.get('/myTeam/listMyRebateBenefitRecord', { params: params, loading: false, showMsg: false, })//获取佣金记录
export const reqGetInviteList = (params) => api.get('/myTeam/list', { params: params, loading: false, showMsg: false, })//获取推广记录

// ------   账号相关    ------
export const reqLogin = (params) => api.post('/uc/member/loginByPassword', params, { loading: true, showMsg: true, })// 请求登录
export const reqLoginToPhone = (params) => api.post('/uc/member/loginByPhone', params, { loading: true, showMsg: true, })// 请求登录
export const reqRegister = (params) => api.post('/uc/member/register', params, { loading: true, showMsg: true, })// 请求注册
export const reqSendCode = (params) => api.get('/common/sendMailVcode', { params: params, loading: true, showMsg: true, })// 请求发送验证码
export const reqFindPassword = (params) => api.post('/common/changePwdByVcode', params, { loading: true, showMsg: true, })// 请求找回密码


export const reqGetAllWallet = (params) => api.get('/ucenter/account/all', { params: params, loading: false, showMsg: false, })// 获取所有钱包

// ------   市场相关    ------
// 获取市场列表
export const reqGetMarketList = (params) => api.get('/exchange/objects/listWithFavor', { params: params, loading: false, showMsg: false, })
// 获取用户自选市场列表
export const reqGetUserSelectMarketList = (params) => api.get('/exchange/favor/list', { params: params, loading: false, showMsg: false, })
// 获取合约列表
export const reqGetContractList = (params) => api.post('/exchange/objects/findByDto', params, { loading: false, showMsg: false, })
// 获取交易对详情
export const reqGetMarketDetail = (params) => api.get(`/exchange/objects/detail/${params.symbol}`, { loading: false, showMsg: false, })
// 添加单个自选
export const reqAddUserSelectMarket = (params) => api.post(`/exchange/favor/add/${params.symbol}`, {}, { loading: true, showMsg: true, })
// 删除单个自选
export const reqDeleteUserSelectMarket = (params) => api.delete(`/exchange/favor/delete/${params.symbol}`, { loading: true, showMsg: true, })
// 获取交易对最新数据
export const reqGetMarketNewData = (params) => api.get(`/kline/getKeyLineOCHLByThistime/${params.symbol}`, { loading: false, showMsg: false, })
// 获取交易对历史记录
export const reqGetMarketHistoryData = (params) => api.get(`/exchange/kline/historyNew`, { params: params, loading: false, showMsg: false, })
// 请求开仓
export const reqOpenPosition = (params) => api.post(`/exchange/order/open`, params, { loading: true, showMsg: true, })