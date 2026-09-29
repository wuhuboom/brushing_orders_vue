const firstPresent = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

export const customerServiceVisitor = (user = {}) => ({
  id: firstPresent(user.id, user.userId, user.memberId),
  name: firstPresent(user.username, user.userName, user.name),
});

export const buildCustomerServiceUrl = (
  url,
  { isLoggedIn = false, user = {} } = {},
) => {
  const target = String(url ?? "").trim();
  if (
    !target ||
    !isLoggedIn ||
    !target.includes("chatIndex") ||
    !target.includes("ent_id")
  ) {
    return target;
  }

  const visitor = customerServiceVisitor(user);
  if (visitor.id === undefined || !visitor.name) return target;

  const hashIndex = target.indexOf("#");
  const base = hashIndex === -1 ? target : target.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : target.slice(hashIndex);
  const separator = base.includes("?") ? "&" : "?";

  return `${base}${separator}visitor_id=${encodeURIComponent(visitor.id)}&visitor_name=${encodeURIComponent(visitor.name)}${hash}`;
};
