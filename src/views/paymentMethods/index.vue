<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5] pl-4 pr-4">
    <van-nav-bar
      :title="$t('付款方式')"
      fixed
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="text-xs text-[#333] mb-4 mt-20">
      {{
        $t(
          "尊敬的用户，请填写您的TRC-20/ERC-20地址。请勿输入您的银行账户信息和密码。"
        )
      }}
    </div>
    <div class="text-[#666] font-semibold mt-10">
      {{ $t("钱包") }}
    </div>
    <div class="w-full mt-2 overflow-hidden shadow">
      <van-field
        v-model="form.withdrawName"
        label=""
        placeholder="钱包"
        label-align="top"
      />
    </div>
    <div class="text-[#666] font-semibold mt-5">
      {{ $t("网络") }}
    </div>
    <div class="w-full mt-2 overflow-hidden shadow">
      <van-field
        v-model="form.withdrawType"
        label=""
        placeholder="网络"
        label-align="top"
      />
    </div>
    <div class="text-[#666] font-semibold mt-5">
      {{ $t("地址") }}
    </div>
    <div class="w-full mt-2 overflow-hidden shadow">
      <van-field
        v-model="form.withdrawAddress"
        label=""
        placeholder="地址"
        label-align="top"
      />
    </div>
    <div class="w-full mt-10">
      <van-button color="#007513" class="w-full" @click="submitForm">{{
        $t("更新")
      }}</van-button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref ,reactive} from "vue";
import { addWithdrawalMethod } from "../../api/apis";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const router = useRouter();
const { t } = useI18n();
const form = reactive({
  withdrawName: "",
  withdrawAddress: "",
  withdrawType: "",
});
const submitForm = async () => {
  if (!form.withdrawName) return ElMessage.error(t("请输入钱包名称"));
  if (!form.withdrawAddress) return ElMessage.error(t("请输入网络"));
  if (!form.withdrawAddress) return ElMessage.error(t("请输入地址"));
  let res = await addWithdrawalMethod(form);
  ElMessage({ message: t("添加成功"), type: "success" });
  router.push({ path: "/my" });
};

const onClickLeft = () => {
  router.push({ path: "/my" });
};
</script>
