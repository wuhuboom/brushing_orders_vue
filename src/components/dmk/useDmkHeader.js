import { computed, ref, watch } from "vue";
import { defaultAvatarForUser, hasUserAvatar } from "@/utils/avatar";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { safePush } from "@/utils/navigation";
import { CUSTOMER_SERVICE_ENABLED, openCustomerServiceDialog } from "@/utils/customerServiceDialog";

export const profileItems = [
  { labelKey: "das.dmk.editProfile", path: "/profile", iconName: "user-o" },
  { labelKey: "das.dmk.myWallet", path: "/paymentMethods", iconName: "balance-o" },
  { labelKey: "das.page.withdraw", path: "/withdraw", iconName: "cash-back-record" },
  { labelKey: "das.dmk.depositHistory", path: "/deposit", iconName: "clock-o" },
  { labelKey: "das.page.vip", path: "/vips", iconName: "award-o", hidden: true },
  { labelKey: "das.dmk.salary", path: "/salary", iconName: "balance-list-o", hidden: true },
  { labelKey: "das.home.faqs", path: "/faqs", iconName: "question-o", hidden: true },
  { labelKey: "das.home.terms", path: "/clause", iconName: "records-o", hidden: true },
  { labelKey: "das.dmk.customerSupport", action: "support", iconName: "service-o", hidden: !CUSTOMER_SERVICE_ENABLED },
  { labelKey: "das.profile.logout", action: "logout", red: true, iconName: "revoke" },
  { labelKey: "das.dmk.tax", path: "/tax", iconName: "records-o" },
];

const visibleProfileItems = profileItems.filter((item) => !item.hidden);

export const services = [
  { nameKey: "das.dmk.seo", path: "/", copyKey: "das.dmk.seoCopy" },
  { nameKey: "das.dmk.ppc", path: "/ppc", copyKey: "das.dmk.ppcCopy", disabled: true },
  { nameKey: "das.dmk.webDesign", path: "/web", copyKey: "das.dmk.webCopy", disabled: true },
];

export const useDmkHeader = (props, closeOverlay = () => {}) => {
  const router = useRouter();
  const store = useUserStore();
  const avatarFailed = ref(false);
  const isAuthenticated = computed(
    () => props.authenticated ?? Boolean(store.token),
  );
  const userInfo = computed(() => store.userInfo || {});
  const imageBase =
    window.g?.VITE_API_IMG_URL || import.meta.env.VITE_API_IMG_URL || "";
  const avatar = computed(() => {
    const path = String(userInfo.value.avatar || "").trim();
    if (!hasUserAvatar(path) || avatarFailed.value) return defaultAvatarForUser(userInfo.value);
    return /^https?:/i.test(path) ? path : imageBase + path;
  });
  watch(() => userInfo.value.avatar, () => { avatarFailed.value = false; });
  const displayName = computed(() => userInfo.value.username || "—");
  const levelName = computed(() => {
    const configured =
      userInfo.value.userLevel?.name ??
      userInfo.value.memberLevel?.name ??
      userInfo.value.levelName ??
      userInfo.value.vipName;
    if (configured) return String(configured);
    const level = Math.min(
      4,
      Math.max(1, Number(userInfo.value.levelId || userInfo.value.vipId || 1)),
    );
    return `VIP${level}`;
  });
  const creditPercent = computed(() => {
    const value = Number(userInfo.value.creditScore ?? 0);
    return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  });
  const pendingAmount = computed(
    () => userInfo.value.balance ?? 0,
  );
  const anniversaryBonus = computed(
    () => userInfo.value.luckyBonus,
  );
  const money = (value) =>
    Number(value || 0).toLocaleString("es-MX", {
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  const openPath = (path) => {
    closeOverlay();
    safePush(router, path);
  };
  const openItem = async (item) => {
    closeOverlay();
    if (item.action === "logout") {
      await store.logout();
      return;
    }
    if (item.action === "support") {
      openCustomerServiceDialog();
      return;
    }
    if (item.path) safePush(router, item.path);
  };

  return {
    profileItems: visibleProfileItems,
    services,
    avatarFailed,
    isAuthenticated,
    userInfo,
    avatar,
    displayName,
    levelName,
    creditPercent,
    pendingAmount,
    anniversaryBonus,
    money,
    openPath,
    openItem,
  };
};
