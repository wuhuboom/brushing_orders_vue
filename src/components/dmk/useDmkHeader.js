import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { safePush } from "@/utils/navigation";
import { openCustomerServiceDialog } from "@/utils/customerServiceDialog";

export const profileItems = [
  { labelKey: "das.dmk.editProfile", path: "/profile" },
  { labelKey: "das.dmk.myWallet", path: "/paymentMethods" },
  { labelKey: "das.page.withdraw", path: "/withdraw" },
  { labelKey: "das.dmk.depositHistory", path: "/deposit" },
  { labelKey: "das.page.vip", path: "/vips" },
  { labelKey: "das.dmk.salary", path: "/salary" },
  { labelKey: "das.home.faqs", path: "/faqs" },
  { labelKey: "das.home.terms", path: "/clause" },
  { labelKey: "das.dmk.customerSupport", action: "support" },
  { labelKey: "das.profile.logout", action: "logout", red: true },
];

export const services = [
  { nameKey: "das.dmk.seo", path: "/seo", copyKey: "das.dmk.seoCopy" },
  { nameKey: "das.dmk.ppc", path: "/ppc", copyKey: "das.dmk.ppcCopy" },
  { nameKey: "das.dmk.webDesign", path: "/web", copyKey: "das.dmk.webCopy" },
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
    if (!path || avatarFailed.value) return "/dmk/assets/avatar.png";
    return /^https?:/i.test(path) ? path : imageBase + path;
  });
  const displayName = computed(() => userInfo.value.username || "—");
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
    Number(value || 0).toLocaleString("en-US", {
      useGrouping: false,
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
    profileItems,
    services,
    avatarFailed,
    isAuthenticated,
    userInfo,
    avatar,
    displayName,
    creditPercent,
    pendingAmount,
    anniversaryBonus,
    money,
    openPath,
    openItem,
  };
};
