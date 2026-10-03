import { onMounted, ref } from "vue";
import { userGetInfo } from "@/api/apis";
import { getMemberLevelMetrics } from "@/utils/memberLevel";

export const useProfitRate = () => {
  const profitRate = ref("—");

  onMounted(async () => {
    try {
      const { data } = await userGetInfo();
      profitRate.value = getMemberLevelMetrics(
        data?.memberLevel || data?.userLevel || {},
      ).profitPerTransaction;
    } catch (_) {}
  });

  return profitRate;
};
