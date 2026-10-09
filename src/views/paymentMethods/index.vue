<template>
  <main class="das-page method-page payment-account-page">
    <DasPageHeader
      title-key="das.page.paymentMethods"
      back-to="/my"
      :back-handler="handlePageBack"
    />
    <section v-if="!isFormOpen" class="method-list-page payment-account-card">
      <button
        class="payment-account-card__add-btn"
        type="button"
        @click="openCreate"
      >
        {{ $t("das.form.addAccount") }}
      </button>
      <div v-if="accounts.length" class="payment-account-wallet-list">
        <article
          v-for="item in accounts"
          :key="item.id"
          class="pa-wallet-card"
          role="button"
          tabindex="0"
          @click="openEdit(item.id)"
          @keydown.enter="openEdit(item.id)"
        >
          <div class="method-item__head">
            <small
              v-if="item.isDefault"
              class="pa-wallet-card__status pa-wallet-card__status--approved"
              >{{ $t("das.form.default") }}</small
            >
            <div class="method-item__actions">
              <button
                type="button"
                :aria-label="accountName(item)"
                @click.stop="openEdit(item.id)"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m16 3 5 5L8 21H3v-5L16 3Zm-2 2 5 5" />
                </svg>
              </button>
              <button
                type="button"
                :aria-label="$t('das.common.close')"
                @click.stop="remove(item.id)"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 7h14M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" />
                </svg>
              </button>
            </div>
          </div>
          <div class="pa-wallet-card__main">
            <span class="pa-wallet-card__icon"
              ><span class="pa-wallet-card__icon-fallback">{{
                accountName(item).slice(0, 1).toUpperCase()
              }}</span></span
            >
            <div class="pa-wallet-card__meta">
              <div class="pa-wallet-card__title-row">
                <strong class="pa-wallet-card__symbol">{{
                  accountName(item)
                }}</strong
                ><span
                  v-if="item.withdrawalTypeName"
                  class="pa-wallet-card__chain-badge"
                  >{{ item.withdrawalTypeName }}</span
                >
              </div>
              <p
                v-if="item.walletName && item.walletName !== accountName(item)"
                class="pa-wallet-card__subtitle"
              >
                {{ item.walletName }}
              </p>
            </div>
          </div>
          <p class="pa-wallet-card__account">{{ accountAddress(item) }}</p>
        </article>
      </div>
      <div v-else class="payment-account-empty">
        <p>{{ $t("das.form.noMoreData") }}</p>
      </div>
      <p v-if="accounts.length" class="payment-account-list-end">
        {{ $t("das.form.noMoreData") }}
      </p>
      <p class="method-copyright">{{ $t("das.common.copyright") }}</p>
    </section>
    <form
      v-else
      class="method-form-page payment-account-card payment-account-form"
      novalidate
      @submit.prevent="save"
    >
      <div class="payment-account-form__head">
        <button
          class="payment-account-form__ghost-btn"
          type="button"
          @click="handlePageBack"
        >
          {{ $t("das.common.back") }}
        </button>
        <span class="payment-account-form__chip">{{
          selectedType?.typeName || $t("das.form.withdrawalType")
        }}</span>
      </div>
      <section class="payment-account-crypto">
        <label class="payment-account-crypto__label"
          >{{ $t("das.form.withdrawalType") }} <em>*</em></label
        >
        <div class="payment-account-crypto__box">
          <DasSelect
            v-model="form.withdrawalTypeId"
            :options="types"
            label-key="typeName"
            value-key="id"
            string-value
            :aria-label="$t('das.form.withdrawalType')"
            :placeholder="$t('das.form.withdrawalType')"
          >
            <template #selected="{ option, label }">
              <WithdrawalTypeLabel v-if="option" :option="option" />
              <span v-else class="das-select__label is-placeholder">{{ label }}</span>
            </template>
            <template #option="{ option }">
              <WithdrawalTypeLabel :option="option" />
            </template>
          </DasSelect>
        </div>
      </section>
      <label class="method-default"
        ><span>{{ $t("das.form.default") }}</span
        ><input v-model="form.isDefault" type="checkbox" /><i
          aria-hidden="true"
        ></i
      ></label>
      <template v-if="isBank">
        <label class="payment-account-form__field"
          ><span>{{ $t("das.form.bankName") }} <em>*</em></span
          ><input
            v-model.trim="form.bankName"
            :placeholder="$t('das.form.bankName')"
        /></label>
        <label class="payment-account-form__field"
          ><span>{{ $t("das.form.bankAccount") }} <em>*</em></span
          ><input
            v-model.trim="form.bankAccount"
            :placeholder="$t('das.form.bankAccount')"
        /></label>
        <label class="payment-account-form__field"
          ><span>{{ $t("das.form.accountHolder") }} <em>*</em></span
          ><input
            v-model.trim="form.accountHolder"
            :placeholder="$t('das.form.accountHolder')"
        /></label>
      </template>
      <template v-else>
        <label class="payment-account-form__field"
          ><span>{{ $t("das.form.walletName") }} <em>*</em></span
          ><input
            v-model.trim="form.walletName"
            :placeholder="$t('das.form.walletName')"
        /></label>
        <label class="payment-account-form__field"
          ><span>{{ $t("das.form.walletAddress") }} <em>*</em></span
          ><textarea
            v-model.trim="form.walletAddress"
            rows="2"
            :placeholder="$t('das.form.walletAddress')"
          ></textarea>
        </label>
      </template>
      <section class="payment-account-form__field method-upload-card">
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
            <span aria-hidden="true">＋</span
            ><small>{{ $t("das.form.upload") }}</small>
          </div>
        </van-uploader>
      </section>
      <button
        class="payment-account-form__submit"
        type="submit"
        :disabled="saving"
      >
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
import WithdrawalTypeLabel from "@/components/WithdrawalTypeLabel.vue";
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
const accountAddress = (item) =>
  String(item.walletAddress || item.bankAccount || "") || "—";
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
  color: #000;
  line-height: normal;
}
.method-list-page,
.method-form-page {
  padding: 0 23px 56px;
  margin: 0;
}
.method-item__head {
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.method-item__actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.method-item__actions button {
  width: 32px;
  height: 28px;
  padding: 5px;
  border: 1px solid #6e817d;
  border-radius: 8px;
  background: #fff;
  color: #6e817d;
}
.method-item__actions svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.pa-wallet-card {
  cursor: pointer;
}
.pa-wallet-card:focus-visible {
  outline: 2px solid #6e817d;
  outline-offset: 3px;
}
.payment-account-form__chip {
  max-width: 65%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.method-default {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  min-height: 54px;
  margin-top: 18px;
  padding: 12px 22px;
  border: 1px solid #222;
  border-radius: 10px;
  background: #fff;
  font-size: 17px;
  font-weight: 800;
}
.method-default input {
  position: absolute;
  right: 22px;
  width: 48px;
  height: 28px;
  opacity: 0;
  z-index: 2;
}
.method-default i {
  position: relative;
  width: 48px;
  height: 28px;
  border-radius: 999px;
  background: #d1d5db;
}
.method-default i::after {
  content: "";
  position: absolute;
  left: 3px;
  top: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  transition: transform 180ms ease;
}
.method-default input:checked + i {
  background: #6e817d;
}
.method-default input:checked + i::after {
  transform: translateX(20px);
}
.payment-account-form__field textarea {
  width: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #555;
  font-size: 16px;
  line-height: 1.35;
  resize: none;
}
.method-upload-card > strong {
  display: block;
  margin-bottom: 12px;
  font-size: 17px;
  line-height: 1.2;
}
.method-upload {
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px dashed #9ba59e;
  border-radius: 10px;
  color: #6e817d;
}
.method-upload span {
  font-size: 28px;
  font-weight: 200;
}
.method-upload small {
  font-size: 12px;
}
.method-upload-card :deep(.van-uploader__preview-image) {
  width: 100px;
  height: 100px;
  border-radius: 10px;
}
.method-copyright {
  margin: 28px 0 0;
  color: #8a8f98;
  font-size: 12px;
  text-align: center;
}
.payment-account-crypto__box :deep(.das-select__trigger) {
  min-height: 64px;
  height: auto;
  padding: 0;
  border: 0 !important;
  border-radius: 0;
  font-size: 16px;
  box-shadow: none;
}
.payment-account-crypto__box :deep(.das-select__menu) {
  position: static;
  margin-top: 8px;
  padding: 0 !important;
  max-height: 260px;
  border: 0;
  border-top: 1px solid #d7d7d7;
  border-radius: 0 !important;
  box-shadow: none;
}
.payment-account-crypto__box :deep(.das-select__menu > button) {
  display: flex;
  padding: 12px 4px !important;
  min-height: 64px !important;
  border: 0 !important;
  border-radius: 0 !important;
  font-size: 16px !important;
  color: #000 !important;
  background: transparent !important;
}
.payment-account-crypto__box :deep(.das-select__menu > button > svg) {
  display: none;
}
.payment-account-crypto__box :deep(.das-select__menu > button + button) {
  border-top: 1px solid #e5e5e5 !important;
}
@media (max-width: 430px) {
  .method-list-page,
  .method-form-page {
    padding: 0 16px 44px;
  }
}
</style>
