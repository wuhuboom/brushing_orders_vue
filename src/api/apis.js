import api from "@/api/index.js";
import { parseCreateOrderResponse } from "@/utils/orderCreate";

const requestConfig = (overrides = {}) => ({
  loading: false,
  showMsg: false,
  ...overrides,
});
const pageParams = (params = {}) => ({ pageNum: 1, pageSize: 10, ...params });
const unwrapData = (response) => response?.data ?? response;
const withData = (response, data) => ({ ...response, data });
const createRequestId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeMemberLevel = (level = {}) => ({
  ...level,
  nameEn: level.name || `VIP${level.level || level.id || ""}`,
  nameZh: level.name || `VIP${level.level || level.id || ""}`,
  descriptionEn: level.description || "",
  orderCount: level.orderCountPerDay ?? level.taskCountPerDay ?? 0,
  minAmount: level.minBalance ?? level.minWithdrawAmount ?? 0,
  maxAmount: level.maxWithdraw ?? level.withdrawLimitPerDay ?? 0,
});

const firstDefined = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const toNumberOrZero = (...values) => {
  const value = firstDefined(...values);
  if (value === undefined) return 0;
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const normalizeUser = (user = {}) => {
  const memberLevel = normalizeMemberLevel(
    user.memberLevel || user.userLevel || {},
  );
  const balance = toNumberOrZero(
    user.balance,
    user.availableBalance,
    user.accountBalance,
  );
  const frozenBalance = toNumberOrZero(
    user.frozenBalance,
    user.freezeAmount,
    user.frozenAmount,
    user.holdAmount,
  );
  const sex = firstDefined(user.sex, user.gender, user.genderCode);
  return {
    ...user,
    phone: firstDefined(user.phone, user.phoneNumber, user.mobile),
    phoneNumber: firstDefined(user.phoneNumber, user.phone, user.mobile),
    sex,
    gender: firstDefined(user.gender, user.sex, user.genderCode),
    rawSex: user.sex,
    rawGender: firstDefined(user.gender, user.genderCode),
    levelId: user.vipId ?? user.levelId ?? memberLevel.level ?? memberLevel.id,
    userLevel: memberLevel,
    creditScore: toNumberOrZero(
      user.creditScore,
      user.reputationScore,
      user.reputation,
      user.credit,
    ),
    commission: toNumberOrZero(
      user.commission,
      user.todayCommission,
      user.todayProfit,
      user.todayIncome,
      user.todayEarnings,
    ),
    balance,
    frozenBalance,
    dealCount: user.taskProgress ?? user.dealCount ?? 0,
    cardNumber: user.workLimit ?? user.cardNumber ?? memberLevel.orderCount,
    totalBalance: user.totalBalance ?? balance + frozenBalance,
  };
};

const normalizeGoods = (goods = {}) => {
  const product = goods.product || goods.goods || {};
  const productPrice = firstDefined(
    goods.price,
    goods.unitPrice,
    product.price,
    product.unitPrice,
    product.amount,
  );
  const totalAmount = firstDefined(
    goods.totalAmount,
    goods.orderAmount,
    goods.amount,
    goods.payAmount,
    productPrice,
  );
  const totalCommission = firstDefined(
    goods.totalCommission,
    goods.commissionAmount,
    goods.commission,
    goods.rebate,
    product.commission,
    product.rebate,
  );
  const rating = firstDefined(
    goods.rating,
    goods.score,
    goods.starRating,
    goods.ratingScore,
    goods.productRating,
    goods.rate,
    goods.stars,
    goods.star,
    product.rating,
    product.score,
    product.starRating,
    product.rate,
    product.stars,
    product.star,
  );
  return {
    ...product,
    ...goods,
    goodsName:
      goods.productTitle ??
      goods.title ??
      goods.goodsName ??
      product.productTitle ??
      product.title ??
      product.goodsName ??
      product.name,
    coverUrl:
      goods.productImage ??
      goods.image ??
      goods.coverUrl ??
      product.productImage ??
      product.image ??
      product.coverUrl,
    commission: toNumberOrZero(totalCommission),
    totalCommission: toNumberOrZero(totalCommission),
    price: toNumberOrZero(productPrice, totalAmount),
    totalAmount: toNumberOrZero(totalAmount),
    orderNo: goods.orderNumber ?? goods.orderNo ?? goods.briefNo ?? goods.id,
    createTime:
      goods.createTime ??
      goods.createdAt ??
      goods.createTimestamp ??
      goods.timestamp,
    orderCount: goods.orderCount ?? 0,
    rating: rating === undefined ? null : Number(rating),
  };
};


const normalizeTradeConfig = (payload = {}) => {
  const candidate =
    (Array.isArray(payload) ? payload[0] : null) ||
    payload?.records?.[0] ||
    payload?.rows?.[0] ||
    payload?.list?.[0] ||
    payload || {};
  const raw = candidate || {};
  const source = raw.tradeConfig || raw.config || raw.trade || raw;
  const hours =
    source.workHours ||
    source.workingHours ||
    source.businessHours ||
    source.serviceHours ||
    source.workTime ||
    {};

  const range = firstDefined(
    source.serviceTimeRange,
    source.service_time_range,
    source.workTimeRange,
    source.work_time_range,
    source.tradeTimeRange,
  );
  const rangeStart = Array.isArray(range)
    ? range[0]
    : firstDefined(range?.[0], range?.start, range?.startTime, range?.from);
  const rangeEnd = Array.isArray(range)
    ? range[1]
    : firstDefined(range?.[1], range?.end, range?.endTime, range?.to);

  let workTimeStart = firstDefined(
    rangeStart,
    source.workTimeStart,
    source.workStartTime,
    source.workingTimeStart,
    source.startWorkingTime,
    source.businessStartTime,
    source.businessOpenTime,
    source.serviceStartTime,
    source.openTime,
    source.startTime,
    source.work_time_start,
    source.work_start_time,
    source.business_start_time,
    source.service_start_time,
    source.start_time,
    hours?.start,
    hours?.startTime,
    hours?.workTimeStart,
  );
  let workTimeEnd = firstDefined(
    rangeEnd,
    source.workTimeEnd,
    source.workEndTime,
    source.workingTimeEnd,
    source.endWorkingTime,
    source.businessEndTime,
    source.businessCloseTime,
    source.serviceEndTime,
    source.closeTime,
    source.endTime,
    source.work_time_end,
    source.work_end_time,
    source.business_end_time,
    source.service_end_time,
    source.end_time,
    hours?.end,
    hours?.endTime,
    hours?.workTimeEnd,
  );

  const hourText = typeof hours === "string" ? hours : firstDefined(source.workHoursText, source.work_time);
  if ((!workTimeStart || !workTimeEnd) && hourText) {
    const match = String(hourText).match(/(\d{1,2}:\d{2})\s*[-~–—至]\s*(\d{1,2}:\d{2})/);
    if (match) {
      workTimeStart ||= match[1];
      workTimeEnd ||= match[2];
    }
  }

  return { ...source, workTimeStart, workTimeEnd };
};

const normalizeRows = (response, mapper = (value) => value) => {
  const rows =
    response?.rows ||
    response?.data?.rows ||
    response?.data?.records ||
    response?.data?.list ||
    (Array.isArray(response?.data) ? response.data : []);
  return {
    ...response,
    rows: rows.map(mapper),
    total:
      response?.total ??
      response?.data?.total ??
      response?.data?.totalCount ??
      rows.length,
  };
};

// User management
export const register = (params) =>
  api.post(
    "/user/register",
    {
      username: params.username,
      password: params.password,
      tradePassword: params.tradePassword,
      phoneNumber: params.phoneNumber ?? params.phone,
      gender: String(params.gender ?? params.sex ?? ""),
      inviteCode: params.inviteCode,
      email: params.email ?? "",
    },
    requestConfig({ loading: true, showMsg: true }),
  );

export const login = (params) =>
  api
    .post(
      "/user/login",
      params,
      requestConfig({ loading: true, showMsg: false }),
    )
    .then((response) => {
      const data = unwrapData(response) || {};
      return withData(response, {
        ...data,
        info: normalizeUser(data.user || data.info || {}),
      });
    });

export const reqLogout = () =>
  api.post(
    "/user/logout",
    null,
    requestConfig({ loading: true, showMsg: true }),
  );
export const editTradePassword = (params) =>
  api.post(
    "/user/editTradePassword",
    params,
    requestConfig({ loading: true, showMsg: true }),
  );
export const editPassword = (params) =>
  api.post(
    "/user/editPassword",
    params,
    requestConfig({ loading: true, showMsg: true }),
  );
export const checkTradePassword = (params) =>
  api.post(
    "/user/checkTradePassword",
    params,
    requestConfig({ loading: true, showMsg: true }),
  );
export const userGetInfo = (params) =>
  api
    .get("/user/getInfo", requestConfig({ params }))
    .then((response) =>
      withData(response, normalizeUser(unwrapData(response) || {})),
    );

export const updateAvatar = (file) => {
  const uploadFile = file?.file || file;
  if (!(uploadFile instanceof Blob)) {
    return Promise.reject(new TypeError("A valid image file is required"));
  }
  const form = new FormData();
  form.append("file", uploadFile, uploadFile.name || "avatar.jpg");
  return api.post(
    "/user/avatar",
    form,
    requestConfig({
      loading: true,
      showMsg: true,
    }),
  );
};
export const uploadAvatar = updateAvatar;

// Order management
export const getGoodsList = (params) =>
  api
    .get("/goods/getGoodsList", requestConfig({ params }))
    .then((response) =>
      withData(response, (unwrapData(response) || []).map(normalizeGoods)),
    );

export const getOrderInfos = (params) =>
  api
    .get("/order", requestConfig({ params: pageParams(params) }))
    .then((response) => normalizeRows(response, normalizeGoods));

export const getOrderInfo = async (id) => {
  try {
    const response = await api.get(`/order/${id}`, requestConfig());
    return withData(response, normalizeGoods(unwrapData(response) || {}));
  } catch (detailError) {
    const response = await api.get(
      "/order",
      requestConfig({ params: pageParams({ pageNum: 1, pageSize: 100 }) }),
    );
    const normalized = normalizeRows(response, normalizeGoods);
    const match = normalized.rows.find(
      (item) => String(item.id ?? item.orderNo) === String(id),
    );
    if (!match) throw detailError;
    return withData(response, match);
  }
};

export const createOrder = () =>
  api
    .post(
      "/order",
      null,
      requestConfig({ headers: { "Idempotency-Key": createRequestId() } }),
    )
    .then((response) => ({
      ...response,
      ...parseCreateOrderResponse(response, normalizeGoods),
    }));

export const submitOrder = (id) =>
  api.post(`/order/${id}/submit`, null, requestConfig({ showMsg: true }));

// Account and withdrawal management
export const getDeposit = (params) =>
  api
    .get("/account/deposits", requestConfig({ params: pageParams(params) }))
    .then((response) => normalizeRows(response));
export const getTransactions = (params) =>
  api
    .get("/account/transactions", requestConfig({ params: pageParams(params) }))
    .then((response) => normalizeRows(response));
export const getWithdrawals = (params) =>
  api
    .get("/account/withdrawals", requestConfig({ params: pageParams(params) }))
    .then((response) => normalizeRows(response));
export const withdrawal = (params) =>
  api.post(
    "/account/withdrawals",
    {
      requestId: params.requestId || createRequestId(),
      amount: params.amount,
      tradePassword: params.tradePassword,
      withdrawalAccountId:
        params.withdrawalAccountId ?? params.accountId ?? params.id,
    },
    requestConfig({ loading: true, showMsg: true }),
  );

export const getWithdrawalAccounts = () =>
  api.get("/account/withdrawal-accounts", requestConfig());
export const getWithdrawalAccount = (id, token) =>
  api.get(
    `/account/withdrawal-accounts/${id}`,
    requestConfig({ params: { token } }),
  );
export const addWithdrawalMethod = (params) => {
  const { token, ...body } = params;
  return api.post(
    "/account/withdrawal-accounts",
    body,
    requestConfig({ params: { token }, loading: true, showMsg: true }),
  );
};
export const updateWithdrawalMethod = (id, params) => {
  const { token, ...body } = params;
  return api.put(
    `/account/withdrawal-accounts/${id}`,
    body,
    requestConfig({ params: { token }, loading: true, showMsg: true }),
  );
};
export const deleteWithdrawalMethod = (id, token) =>
  api.delete(
    `/account/withdrawal-accounts/${id}`,
    requestConfig({ params: { token }, loading: true, showMsg: true }),
  );
export const getWithdrawalTypes = () =>
  api.get("/account/withdrawal-types", requestConfig());

export const upload = (params) =>
  api.post(
    "/config/upload",
    params instanceof FormData
      ? params
      : (() => {
          const form = new FormData();
          Object.entries(params || {}).forEach(([key, value]) =>
            form.append(key, value),
          );
          return form;
        })(),
    requestConfig({
      loading: true,
      showMsg: true,
    }),
  );

// Messages
export const getNoticeList = (params) =>
  api
    .get("/messages", requestConfig({ params: pageParams(params) }))
    .then((response) =>
      normalizeRows(response, (item) => ({
        ...item,
        id: item.noticeId ?? item.id,
      })),
    );
export const getNotice = (params) =>
  api.get(
    `/messages/${params.id}`,
    requestConfig({ params: { lang: params.lang } }),
  );

// Public configuration
export const getWebsiteConfig = (params) =>
  api.get("/config/website", requestConfig({ params }));
export const getTradeConfig = (params) =>
  api
    .get("/config/trade", requestConfig({ params }))
    .then((response) =>
      withData(response, normalizeTradeConfig(unwrapData(response) || {})),
    );
export const reqGetTradeConfig = getTradeConfig;
export const getZoneActive = (params) =>
  api.get("/config/time-zone", requestConfig({ params }));
export const getLevel = (params) =>
  api
    .get("/config/member-levels", requestConfig({ params }))
    .then((response) =>
      withData(
        response,
        (unwrapData(response) || []).map(normalizeMemberLevel),
      ),
    );
export const getErrorMessages = (params) =>
  api.get("/config/error-messages", requestConfig({ params }));
export const getCustomerService = (params) =>
  api
    .get("/config/customer-services", requestConfig({ params }))
    .then((response) =>
      withData(
        response,
        (unwrapData(response) || []).map((item) => ({
          ...item,
          linkUrl: item.link ?? item.linkUrl,
        })),
      ),
    );
export const getContentConfig = (params) =>
  api.get("/config/content", requestConfig({ params }));
export const getGlobalConfig = (params) =>
  Promise.all([getWebsiteConfig(params), getContentConfig(params)]).then(
    ([websiteResponse, contentResponse]) => {
      const website = unwrapData(websiteResponse) || {};
      const content = unwrapData(contentResponse) || {};
      return withData(contentResponse, {
        ...website,
        ...content,
        termsEn: content.termsContent,
        protocolEn: content.protocolContent,
        registerProtocolEn: content.protocolContent,
        aboutUsEn: content.aboutContent,
        certificateEn: content.certificateContent,
        helpEn: content.helpContent,
        faqEn: content.helpContent,
        latestEventEn: content.eventContent,
        incomeGuideEn:
          content.usageDescription ||
          content.orderDescription ||
          content.transactionDescription,
      });
    },
  );
