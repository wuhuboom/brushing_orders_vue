<template>
  <main class="das-page method-page">
    <DasPageHeader
      title-key="das.page.paymentMethods"
      back-to="/my"
      :back-handler="handlePageBack"
    />

    <section v-if="!isFormOpen" class="method-list-page">
      <div v-if="accounts.length" class="method-list">
        <article
          v-for="item in accounts"
          :key="item.id"
          class="method-item"
          role="button"
          tabindex="0"
          @click="openEdit(item.id)"
          @keydown.enter="openEdit(item.id)"
        >
          <div class="method-item__copy">
            <strong>{{ accountName(item) }}</strong>
            <span>{{ accountAddress(item) }}</span>
            <small v-if="item.isDefault">{{ $t("das.form.default") }}</small>
          </div>
          <button
            type="button"
            :aria-label="$t('das.common.close')"
            @click.stop="remove(item.id)"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 7h14M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" />
            </svg>
          </button>
        </article>
      </div>
      <div v-else class="method-empty">
        <span>{{ $t("das.form.noMoreData").split(" ")[0] }}</span>
        <span>{{ $t("das.form.noMoreData").split(" ").slice(1).join(" ") }}</span>
      </div>
      <button class="method-primary" type="button" @click="openCreate">
        <span aria-hidden="true">＋</span>{{ $t("das.form.create") }}
      </button>
      <p class="method-copyright">{{ $t("das.common.copyright") }}</p>
    </section>

    <form v-else class="method-form-page" novalidate @submit.prevent="save">
      <section class="method-card method-type-card">
        <label>{{ $t("das.form.withdrawalType") }}</label>
        <div class="method-type-select">
          <DasSelect
            v-model="form.withdrawalTypeId"
            :options="types"
            label-key="typeName"
            value-key="id"
            string-value
            :aria-label="$t('das.form.withdrawalType')"
            :placeholder="$t('das.form.withdrawalType')"
          />
        </div>
        <div class="method-divider"></div>
        <label class="method-default">
          <span>{{ $t("das.form.default") }}</span>
          <input v-model="form.isDefault" type="checkbox" />
          <i aria-hidden="true"></i>
        </label>
      </section>

      <template v-if="isBank">
        <label class="method-card method-field-card">
          <span>{{ $t("das.form.bankName") }}</span>
          <input v-model.trim="form.bankName" :placeholder="$t('das.form.bankName')" />
        </label>
        <label class="method-card method-field-card method-field-card--large">
          <span>{{ $t("das.form.bankAccount") }}</span>
          <input v-model.trim="form.bankAccount" :placeholder="$t('das.form.bankAccount')" />
        </label>
        <label class="method-card method-field-card">
          <span>{{ $t("das.form.accountHolder") }}</span>
          <input v-model.trim="form.accountHolder" :placeholder="$t('das.form.accountHolder')" />
        </label>
      </template>
      <template v-else>
        <label class="method-card method-field-card">
          <span>{{ $t("das.form.walletName") }}</span>
          <input v-model.trim="form.walletName" :placeholder="$t('das.form.walletName')" />
        </label>
        <label class="method-card method-field-card method-field-card--large">
          <span>{{ $t("das.form.walletAddress") }}</span>
          <textarea
            v-model.trim="form.walletAddress"
            rows="2"
            :placeholder="$t('das.form.walletAddress')"
          ></textarea>
        </label>
      </template>

      <section class="method-card method-upload-card">
        <strong>{{ $t("das.form.qrUpload") }}</strong>
        <van-uploader
          v-model="attachmentFiles"
          :after-read="uploadAttachment"
          :max-count="1"
          :deletable="true"
          accept="image/*"
          @delete="form.attachment = ''"
        >
          <div class="method-upload">
            <span aria-hidden="true">＋</span>
            <small>{{ $t("das.form.upload") }}</small>
          </div>
        </van-uploader>
      </section>

      <button class="method-primary method-submit" type="submit" :disabled="saving">
        {{ $t("das.common.submit") }}
      </button>
      <p class="method-copyright">{{ $t("das.common.copyright") }}</p>
    </form>

    <WithdrawalPasswordDialog
      ref="withdrawalPasswordDialog"
      @verified="handleCredentialVerified"
      @cancel="handleCredentialCancel"
    />
  </main>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import {
  addWithdrawalMethod,
  deleteWithdrawalMethod,
  getWithdrawalAccount,
  getWithdrawalAccounts,
  getWithdrawalTypes,
  updateWithdrawalMethod,
  upload,
} from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import DasSelect from "@/components/DasSelect.vue";
import WithdrawalPasswordDialog from "@/components/WithdrawalPasswordDialog.vue";
import {
  clearWithdrawalCredential,
  getWithdrawalCredential,
  setWithdrawalCredential,
} from "@/utils/withdrawalCredential";
import { safeBack, safeReplace } from "@/utils/navigation";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const accounts = ref([]);
const types = ref([]);
const attachmentFiles = ref([]);
const saving = ref(false);
const loadingDetail = ref(false);
const credential = ref(getWithdrawalCredential());
const withdrawalPasswordDialog = ref(null);
const pendingAction = ref(null);
const form = reactive({
  withdrawalTypeId: "",
  isDefault: false,
  bankName: "",
  bankAccount: "",
  accountHolder: "",
  walletName: "",
  walletAddress: "",
  attachment: "",
  depositType: "",
  branchCode: "",
  branchName: "",
  accountName: "",
});

const isCreating = computed(() => route.query.action === "create");
const isEditing = computed(() => route.query.action === "edit" && Boolean(route.query.id));
const isFormOpen = computed(() => isCreating.value || isEditing.value);
const selectedType = computed(() =>
  types.value.find((item) => String(item.id) === String(form.withdrawalTypeId)),
);
const isBank = computed(() => {
  const code = String(selectedType.value?.type ?? "").toLowerCase();
  const name = String(selectedType.value?.typeName ?? "").toLowerCase();
  return code === "0" || code === "bank" || name.includes("bank");
});

const accountName = (item) =>
  item.accountName ||
  item.walletName ||
  item.bankName ||
  item.withdrawalTypeName ||
  "—";
const accountAddress = (item) => {
  const value = String(item.walletAddress || item.bankAccount || "");
  if (value.length <= 14) return value || "—";
  return `${value.slice(0, 7)}••••${value.slice(-5)}`;
};
const requestCredential = (action) => {
  pendingAction.value = action;
  withdrawalPasswordDialog.value?.open();
};
const openCreate = () => {
  if (!credential.value) {
    requestCredential({ type: "create" });
    return;
  }
  resetForm();
  safeReplace(router, {
    path: "/paymentMethods",
    query: { action: "create" },
  });
};
const refresh = async () => {
  const response = await getWithdrawalAccounts();
  accounts.value = Array.isArray(response.data)
    ? response.data
    : response.data?.rows || response.data?.records || [];
};
const resetForm = () => {
  Object.assign(form, {
    withdrawalTypeId: String(types.value[0]?.id || ""),
    isDefault: false,
    bankName: "",
    bankAccount: "",
    accountHolder: "",
    walletName: "",
    walletAddress: "",
    attachment: "",
    depositType: "",
    branchCode: "",
    branchName: "",
    accountName: "",
  });
  attachmentFiles.value = [];
};
const fillForm = (data = {}) => {
  Object.assign(form, {
    withdrawalTypeId: String(data.withdrawalTypeId || types.value[0]?.id || ""),
    isDefault: Boolean(data.isDefault),
    bankName: data.bankName || "",
    bankAccount: data.bankAccount || "",
    accountHolder: data.accountHolder || "",
    walletName: data.walletName || "",
    walletAddress: data.walletAddress || "",
    attachment: data.attachment || "",
    depositType: data.depositType || "",
    branchCode: data.branchCode || "",
    branchName: data.branchName || "",
    accountName: data.accountName || "",
  });
  attachmentFiles.value = form.attachment
    ? [{ url: form.attachment, status: "done" }]
    : [];
};
const credentialErrorCode = (error) =>
  Number(error?.code ?? error?.response?.data?.code ?? 0);
const handleProtectedError = (error, action) => {
  if (credentialErrorCode(error) !== 526) return false;
  clearWithdrawalCredential();
  credential.value = "";
  requestCredential(action);
  return true;
};
const loadEdit = async (id) => {
  if (!credential.value) {
    requestCredential({ type: "edit", id });
    return;
  }
  loadingDetail.value = true;
  try {
    const response = await getWithdrawalAccount(id, credential.value);
    fillForm(response.data || {});
    await safeReplace(router, {
      path: "/paymentMethods",
      query: { action: "edit", id: String(id) },
    });
  } catch (error) {
    if (!handleProtectedError(error, { type: "edit", id })) {
      showToast(error?.msg || error?.message || t("das.common.requestFailed"));
    }
  } finally {
    loadingDetail.value = false;
  }
};
const openEdit = (id) => {
  if (!loadingDetail.value) loadEdit(id);
};
const uploadAttachment = async (entry) => {
  const item = Array.isArray(entry) ? entry[0] : entry;
  const file = item?.file;
  if (!(file instanceof Blob)) return;
  item.status = "uploading";
  item.message = t("das.common.loading");
  try {
    const response = await upload({ file });
    const data = response.data || {};
    form.attachment = data.fileName || data.avatar || data.url || "";
    item.status = "done";
    item.message = "";
  } catch (error) {
    item.status = "failed";
    item.message = t("das.form.attachmentFailed");
    showToast(error?.msg || error?.message || t("das.form.attachmentFailed"));
  }
};
const save = async () => {
  if (!credential.value) {
    requestCredential({ type: "retry-save" });
    return;
  }
  if (!form.withdrawalTypeId) return showToast(t("das.auth.required"));
  const invalidBank = isBank.value && (!form.bankName || !form.bankAccount || !form.accountHolder);
  const invalidWallet = !isBank.value && (!form.walletName || !form.walletAddress);
  if (invalidBank) return showToast(t("das.auth.required"));
  if (invalidWallet) return showToast(t("das.form.walletRequired"));
  saving.value = true;
  try {
    const payload = { ...form, token: credential.value };
    if (isEditing.value) {
      await updateWithdrawalMethod(route.query.id, payload);
    } else {
      await addWithdrawalMethod(payload);
    }
    showSuccessToast(t("das.common.success"));
    resetForm();
    await refresh();
    await safeReplace(router, { path: "/paymentMethods" });
  } catch (error) {
    if (!handleProtectedError(error, { type: "retry-save" })) {
      showToast(error?.msg || error?.message || t("das.common.requestFailed"));
    }
  } finally {
    saving.value = false;
  }
};
const remove = async (id) => {
  if (!credential.value) {
    requestCredential({ type: "remove", id });
    return;
  }
  try {
    await deleteWithdrawalMethod(id, credential.value);
    await refresh();
  } catch (error) {
    if (!handleProtectedError(error, { type: "remove", id })) {
      showToast(error?.msg || error?.message || t("das.common.requestFailed"));
    }
  }
};

const runPendingAction = async () => {
  const action = pendingAction.value;
  pendingAction.value = null;
  if (!action) return;
  if (action.type === "create") openCreate();
  if (action.type === "edit") await loadEdit(action.id);
  if (action.type === "remove") await remove(action.id);
  if (action.type === "retry-save") await save();
};
const handleCredentialVerified = async (token) => {
  credential.value = setWithdrawalCredential(token);
  await runPendingAction();
};
const handleCredentialCancel = () => {
  if (!credential.value && !pendingAction.value) safeBack(router, "/my");
  pendingAction.value = null;
};

const handlePageBack = () => {
  if (isFormOpen.value) {
    resetForm();
    safeReplace(router, { path: "/paymentMethods" });
    return;
  }
  safeBack(router, "/my");
};

onMounted(async () => {
  const [accountsResult, typesResult] = await Promise.allSettled([
    getWithdrawalAccounts(),
    getWithdrawalTypes(),
  ]);
  if (accountsResult.status === "fulfilled") {
    const data = accountsResult.value.data;
    accounts.value = Array.isArray(data) ? data : data?.rows || data?.records || [];
  }
  if (typesResult.status === "fulfilled") {
    const data = typesResult.value.data;
    types.value = Array.isArray(data) ? data : data?.rows || data?.records || [];
  }
  resetForm();
  if (isEditing.value) {
    await loadEdit(route.query.id);
  }
  if (!credential.value) {
    pendingAction.value = isEditing.value
      ? { type: "edit", id: route.query.id }
      : null;
    await nextTick();
    withdrawalPasswordDialog.value?.open();
  }
});
</script>

<style scoped>
.method-page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #f7f5ec;
  color: #17382d;
}
.method-list-page,
.method-form-page {
  width: 100%;
  min-height: calc(100vh - 164px);
  padding: 22px 30px 25px;
  display: flex;
  flex: 1;
  flex-direction: column;
}
.method-list {
  display: grid;
  gap: 12px;
}
.method-item {
  min-height: 90px;
  padding: 18px 18px 18px 22px;
  display: flex;
  align-items: center;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(20, 57, 44, 0.05);
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease;
}
.method-item:active {
  transform: scale(0.985);
}
.method-item:focus-visible {
  outline: 2px solid #4d806d;
  outline-offset: 3px;
}
.method-item__copy {
  min-width: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
}
.method-item__copy span {
  color: #89918b;
  font-size: 13px;
}
.method-item__copy small {
  width: max-content;
  padding: 3px 8px;
  border-radius: 999px;
  background: #eaf1e7;
  color: #587064;
}
.method-item > button {
  width: 38px;
  height: 38px;
  padding: 8px;
  border: 0;
  background: transparent;
}
.method-item svg {
  width: 100%;
  height: 100%;
  stroke: #7b8881;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.method-empty {
  margin: auto;
  display: flex;
  flex-direction: column;
  color: #a2a8a2;
  font-size: 15px;
  line-height: 1.65;
  text-align: center;
}
.method-primary {
  width: 100%;
  min-height: 54px;
  margin-top: auto;
  border: 0;
  border-radius: 999px;
  background: #14392c;
  color: #fff;
  font-size: 16px;
  font-weight: 750;
}
.method-primary span {
  margin-right: 9px;
  font-size: 21px;
  font-weight: 300;
  vertical-align: -1px;
}
.method-primary:disabled {
  opacity: 0.55;
}
.method-copyright {
  margin: 28px 0 0;
  color: #9ba39d;
  font-size: 10px;
  text-align: center;
}
.method-form-page {
  gap: 13px;
  padding-top: 10px;
}
.method-card {
  padding: 20px;
  border-radius: 23px;
  background: #fff;
}
.method-type-card > label:first-child,
.method-field-card > span,
.method-upload-card > strong {
  display: block;
  margin-bottom: 14px;
  font-size: 15px;
  font-weight: 750;
}
.method-type-select {
  position: relative;
  width: 100%;
}
.method-divider {
  height: 1px;
  margin: 17px 0 14px;
  background: #e5e6e0;
}
.method-default {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 750;
}
.method-default input {
  position: absolute;
  right: 0;
  width: 60px;
  height: 36px;
  opacity: 0;
  z-index: 2;
}
.method-default i {
  position: relative;
  width: 58px;
  height: 34px;
  border-radius: 999px;
  background: #d2d6d4;
  transition: background 180ms ease;
}
.method-default i::after {
  content: "";
  position: absolute;
  left: 3px;
  top: 3px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 6px rgba(20, 57, 44, 0.18);
  transition: transform 180ms ease;
}
.method-default input:checked + i {
  background: linear-gradient(100deg, #08baff, #0878ff 58%, #4e22cf);
}
.method-default input:checked + i::after {
  transform: translateX(24px);
}
.method-field-card {
  display: block;
}
.method-field-card input,
.method-field-card textarea {
  width: 100%;
  min-height: 54px;
  padding: 0 18px;
  border: 1px solid #d5d5ce;
  border-radius: 14px;
  background: #f7f6ef;
  color: #17382d;
  resize: none;
}
.method-field-card textarea {
  min-height: 88px;
  padding-top: 18px;
}
.method-field-card input::placeholder,
.method-field-card textarea::placeholder {
  color: #92948f;
}
.method-upload-card {
  min-height: 198px;
}
.method-upload {
  width: 126px;
  height: 126px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px dashed #9ba59e;
  border-radius: 18px;
  color: #8f9892;
}
.method-upload span {
  font-size: 28px;
  font-weight: 200;
}
.method-upload small {
  font-size: 12px;
}
.method-upload-card :deep(.van-uploader__preview-image) {
  width: 126px;
  height: 126px;
  border-radius: 18px;
}
.method-submit {
  margin-top: 26px;
}

@media (max-width: 380px) {
  .method-list-page,
  .method-form-page {
    padding-left: 24px;
    padding-right: 24px;
  }
  .method-card {
    padding: 18px;
  }
}
</style>
