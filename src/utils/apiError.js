export const normalizeHttpError = (error) => {
  const payload = error?.response?.data;
  if (!payload || typeof payload !== "object" || payload.code === undefined) {
    return error;
  }

  return {
    ...payload,
    httpStatus: error.response.status,
  };
};
