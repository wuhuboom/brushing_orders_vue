<template>
  <div>
    <Header
      view="market"
      :label="$t('添加银行卡')"
      :rightType="type"
      @rightClick="handleDelete"
    ></Header>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
      class="w-full mt-8"
    >
      <el-form-item :label="$t('收款人姓名')" prop="email" label-position="top">
        <el-input
          v-model="ruleForm.bankCardName"
          type="text"
          autocomplete="off"
          size="large"
          :disabled="type"
        />
      </el-form-item>
      <el-form-item :label="$t('银行名称')" prop="email" label-position="top">
        <el-input
          v-model="ruleForm.bankName"
          type="text"
          autocomplete="off"
          size="large"
          :disabled="type"
        />
      </el-form-item>
      <el-form-item :label="$t('银行卡号')" prop="email" label-position="top">
        <el-input
          v-model="ruleForm.bankCardNumber"
          type="text"
          autocomplete="off"
          size="large"
          :disabled="type"
        />
      </el-form-item>
      <el-form-item
        :label="$t('银行地址')"
        prop="accountOpeningAddress"
        label-position="top"
      >
        <el-input
          v-model="ruleForm.accountOpeningAddress"
          type="text"
          autocomplete="off"
          size="large"
          :disabled="type"
        />
      </el-form-item>
      <el-form-item
        :label="$t('银行国际程式码')"
        prop="swiftCode"
        label-position="top"
      >
        <el-input
          v-model="ruleForm.swiftCode"
          type="text"
          autocomplete="off"
          size="large"
          :disabled="type"
        />
      </el-form-item>
    </el-form>
    <div
      @click="submitForm"
      class="w-full relative -right-5"
      size="large"
      round
      v-if="!type"
    >
      <div
        class="text-base mt-12 bg-blue px-5 flex items-center h-12 rounded-l-2.5 text-white button-bg"
      >
        <div>{{ $t("完成") }}</div>
        <el-icon class="ml-auto" size="20"><Select /></el-icon>
      </div>
    </div>
    <Delete ref="deleteRef" @confirm="confirmDelete" type="bank"></Delete>
  </div>
</template>
<script setup>
import Header from "@/components/Header.vue";
import Delete from "./components/Delete.vue";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { reqBindBank, reqDeleteBind, reqGetBindDetail } from "../../api/apis";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const type = ref(route.query.type);
const deleteRef = ref(null);
const id = ref(route.query.id);
const ruleForm = reactive({
  bankCardNumber: route.query.bankCardNumber,
  bankName: route.query.bankName,
  accountOpeningAddress: route.query.accountOpeningAddress, //
  bankCardName: route.query.bankCardName,
  swiftCode: route.query.swiftCode,
  country: "USD",
  lang: "",
  type: "BANK_CARD",
});
const rules = computed(() => {
  return {};
});

onMounted(() => {
  if (id.value) {
    getBankCardDetail();
  }
});

function getBankCardDetail() {
  reqGetBindDetail({ bindCardId: id.value }).then((res) => {
    ruleForm.bankCardName = res.data.bankCardName;
    ruleForm.bankName = res.data.bankName;
    ruleForm.bankCardNumber = res.data.bankCardNumber;
    ruleForm.accountOpeningAddress = res.data.accountOpeningAddress;
    ruleForm.swiftCode = res.data.swiftCode;
  });
}

function handleDelete() {
  deleteRef.value.open();
}

function confirmDelete() {
  reqDeleteBind(id.value).then((res) => {
    deleteRef.value.close();
    ElMessage({ message: t("删除成功"), type: "success" });
    router.back();
  });
}
const requiredFields = [
  { key: "bankCardName", label: t("请输入收款人姓名") },
  { key: "bankName", label: t("请输入银行名称") },
  { key: "bankCardNumber", label: t("请输入银行卡号") },
  { key: "accountOpeningAddress", label: t("请输入银行地址") },
  { key: "swiftCode", label: t("请输入银行国际程式码") },
];

function submitForm() {
  for (const field of requiredFields) {
    if (!ruleForm[field.key]) {
      ElMessage({ message: field.label, type: "error" });
      return;
    }
  }
  reqBindBank(ruleForm)
    .then((res) => {
      ElMessage({ message: t("添加成功"), type: "success" });
      router.back();
    })
    .then((err) => {
      console.log("添加失败");
    });
}
</script>

<style scoped></style>
