<template>
  <DmkPcAccountShell>
    <div class="w-full h-full dmk-payment-methods-scope">
      <div class="w-[90%] lg:w-[60%] mx-auto">
        <div class="w-full box-border flex flex-col">
          <div class="w-full flex flex-col">
            <div class="w-full flex flex-col mb-3">
              <div class="text-[#fff] text-base">
                {{ $t("das.form.walletName") }}
              </div>
              <div
                class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939] lg:bg-[#fff] lg:border-[#fff]"
              >
                <div
                  class="van-cell van-cell--clickable van-field"
                  role="button"
                  tabindex="0"
                  @click="pcOpenWalletEditor"
                >
                  <div class="van-cell__value van-field__value">
                    <div class="van-field__body">
                      <input
                        v-if="!isFormOpen"
                        :value="pcWalletName"
                        class="van-field__control"
                        :placeholder="$t('das.form.walletName')"
                        readonly
                        type="text"
                      />
                      <select
                        v-else
                        v-model="form.withdrawalTypeId"
                        class="van-field__control dmk-wallet-select"
                      >
                        <option value="" disabled>{{ $t("das.form.walletName") }}</option>
                        <option
                          v-for="type in types"
                          :key="type.id"
                          :value="String(type.id)"
                        >
                          {{ type.typeName || type.name || type.id }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <i
                    class="van-badge__wrapper van-icon van-icon-arrow van-cell__right-icon"
                  ></i>
                </div>
              </div>
            </div>
            <div class="w-full flex flex-col mb-3">
              <div class="text-[#fff] text-base">
                {{ $t("das.form.walletAddress") }}
              </div>
              <div
                class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939] lg:bg-[#fff] lg:border-[#fff]"
              >
                <div class="van-cell van-field">
                  <div class="van-cell__value van-field__value">
                    <div class="van-field__body">
                      <input
                        v-if="!isFormOpen"
                        :value="pcWalletAddress"
                        class="van-field__control"
                        :placeholder="$t('das.form.walletAddress')"
                        readonly
                        type="text"
                      />
                      <input
                        v-else-if="!isBank"
                        v-model.trim="form.walletAddress"
                        class="van-field__control"
                        :placeholder="$t('das.form.walletAddress')"
                        type="text"
                      />
                      <input
                        v-else
                        v-model.trim="form.bankAccount"
                        class="van-field__control"
                        :placeholder="$t('das.form.walletAddress')"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template v-if="isFormOpen && isBank">
              <div class="w-full flex flex-col mb-3">
                <div class="text-[#fff] text-base">{{ $t("das.form.bankName") }}</div>
                <div class="w-full mt-2 bg-white">
                  <div class="van-cell van-field">
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body">
                        <input
                          v-model.trim="form.bankName"
                          class="van-field__control"
                          :placeholder="$t('das.form.bankName')"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full flex flex-col mb-3">
                <div class="text-[#fff] text-base">{{ $t("das.form.accountHolder") }}</div>
                <div class="w-full mt-2 bg-white">
                  <div class="van-cell van-field">
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body">
                        <input
                          v-model.trim="form.accountHolder"
                          class="van-field__control"
                          :placeholder="$t('das.form.accountHolder')"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div class="w-full mt-3">
              <button
                v-if="!isFormOpen"
                class="van-button van-button--default van-button--large"
                style="
                  color: white;
                  background: var(--main-color);
                  border-color: var(--main-color);
                "
                type="button"
                @click="openCustomerServiceDialog"
              >
                <div class="van-button__content">
                  <span class="van-button__text"
                    ><span class="text-black"
                      >{{ $t("das.dmk.contactCustomerService") }}</span
                    ></span
                  >
                </div>
              </button>
              <button
                v-else
                class="van-button van-button--default van-button--large"
                style="
                  color: white;
                  background: var(--main-color);
                  border-color: var(--main-color);
                "
                type="button"
                :disabled="saving"
                @click="save"
              >
                <div class="van-button__content">
                  <span class="van-button__text"
                    ><span class="text-black"
                      >{{ $t("das.common.submit") }}</span
                    ></span
                  >
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="pcPickerOpen"
        class="van-overlay"
        role="button"
        tabindex="0"
        style="z-index: 2061"
        @click="pcPickerOpen = false"
      ></div>
      <div
        v-if="pcPickerOpen"
        class="van-popup van-popup--bottom"
        role="dialog"
        tabindex="0"
        style="z-index: 2061"
      >
        <div class="van-picker">
          <div class="van-picker__toolbar">
            <button
              class="van-picker__cancel van-haptics-feedback"
              type="button"
              @click="pcPickerOpen = false"
            >
              {{ $t("das.common.cancel") }}
            </button>
            <button
              class="van-picker__confirm van-haptics-feedback"
              type="button"
              @click="confirmPcWalletType"
            >
              {{ $t("das.common.confirm") }}
            </button>
          </div>
          <div
            class="van-picker__columns dmk-pc-picker-columns"
            :class="{ 'is-dragging': pcPickerDragging }"
            style="height: 264px"
            @wheel.prevent="onPcPickerWheel"
            @pointerdown="startPcPickerDrag"
            @pointermove="movePcPickerDrag"
            @pointerup="endPcPickerDrag"
            @pointercancel="endPcPickerDrag"
          >
            <div class="van-picker-column">
              <ul
                class="van-picker-column__wrapper"
                :style="{
                  transform: `translate3d(0px, ${110 - pcPickerIndex * 44}px, 0px)`,
                  transitionDuration: pcPickerDragging ? '0ms' : '180ms',
                  transitionProperty: 'transform',
                }"
              >
                <li
                  v-for="(option, index) in pcWalletOptions"
                  :key="option.id"
                  class="van-picker-column__item"
                  :class="{
                    'van-picker-column__item--selected':
                      pcPickerIndex === index,
                  }"
                  role="button"
                  tabindex="0"
                  style="height: 44px"
                  @click="selectPcPickerIndex(index)"
                >
                  <div class="van-ellipsis">{{ option.label }}</div>
                </li>
              </ul>
            </div>
            <div
              class="van-picker__mask"
              style="background-size: 100% 110px"
            ></div>
            <div
              class="van-hairline-unset--top-bottom van-picker__frame"
              style="height: 44px"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </DmkPcAccountShell>
  <DmkH5Layout class="dmk-mobile-current">
    <div class="w-full dmk-payment-methods-scope">
      <div class="w-[90%] mx-auto text-3xl text-white">
        {{ $t("das.page.paymentMethods") }}
      </div>
      <div class="w-[90%] mx-auto">
        <div class="w-full box-border flex flex-col">
          <div class="w-full flex flex-col">
            <div class="w-full flex flex-col mb-3">
              <div class="text-[#fff] text-base">
                {{ $t("das.form.walletName") }}
              </div>
              <div
                class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939]"
              >
                <div
                  class="van-cell van-cell--clickable van-field"
                  role="button"
                  tabindex="0"
                  @click="openH5Picker"
                >
                  <div class="van-cell__value van-field__value">
                    <div class="van-field__body">
                      <input
                        :value="h5WalletName"
                        class="van-field__control"
                        :placeholder="$t('das.form.walletName')"
                        readonly
                        type="text"
                      />
                    </div>
                  </div>
                  <i
                    class="van-badge__wrapper van-icon van-icon-arrow van-cell__right-icon"
                  ></i>
                </div>
              </div>
            </div>
            <div class="w-full flex flex-col mb-3">
              <div class="text-[#fff] text-base">
                {{ $t("das.form.walletAddress") }}
              </div>
              <div
                class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939]"
              >
                <div class="van-cell van-field">
                  <div class="van-cell__value van-field__value">
                    <div class="van-field__body">
                      <input
                        v-if="!isFormOpen"
                        :value="pcWalletAddress"
                        class="van-field__control"
                        :placeholder="$t('das.form.walletAddress')"
                        readonly
                        type="text"
                      />
                      <input
                        v-else-if="!isBank"
                        v-model.trim="form.walletAddress"
                        class="van-field__control"
                        :placeholder="$t('das.form.walletAddress')"
                        type="text"
                      />
                      <input
                        v-else
                        v-model.trim="form.bankAccount"
                        class="van-field__control"
                        :placeholder="$t('das.form.walletAddress')"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template v-if="isFormOpen && isBank">
              <div class="w-full flex flex-col mb-3">
                <div class="text-[#fff] text-base">{{ $t("das.form.bankName") }}</div>
                <div
                  class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939]"
                >
                  <div class="van-cell van-field">
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body">
                        <input
                          v-model.trim="form.bankName"
                          class="van-field__control"
                          :placeholder="$t('das.form.bankName')"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full flex flex-col mb-3">
                <div class="text-[#fff] text-base">{{ $t("das.form.accountHolder") }}</div>
                <div
                  class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939]"
                >
                  <div class="van-cell van-field">
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body">
                        <input
                          v-model.trim="form.accountHolder"
                          class="van-field__control"
                          :placeholder="$t('das.form.accountHolder')"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div class="w-full mt-3">
              <button
                v-if="!isFormOpen"
                class="van-button van-button--default van-button--large"
                style="
                  color: white;
                  background: var(--main-color);
                  border-color: var(--main-color);
                "
                type="button"
                @click="openCustomerServiceDialog"
              >
                <div class="van-button__content">
                  <span class="van-button__text"
                    ><span class="text-black"
                      >{{ $t("das.dmk.contactCustomerService") }}</span
                    ></span
                  >
                </div>
              </button>
              <button
                v-else
                class="van-button van-button--default van-button--large"
                style="
                  color: white;
                  background: var(--main-color);
                  border-color: var(--main-color);
                "
                type="button"
                :disabled="saving"
                @click="save"
              >
                <div class="van-button__content">
                  <span class="van-button__text"
                    ><span class="text-black"
                      >{{ $t("das.common.submit") }}</span
                    ></span
                  >
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="h5PickerOpen"
        class="van-overlay"
        role="button"
        tabindex="0"
        style="z-index: 2061"
        @click="h5PickerOpen = false"
      ></div>
      <div
        v-if="h5PickerOpen"
        class="van-popup van-popup--bottom"
        role="dialog"
        tabindex="0"
        style="z-index: 2061"
      >
        <div class="van-picker">
          <div class="van-picker__toolbar">
            <button
              class="van-picker__cancel van-haptics-feedback"
              type="button"
              @click="h5PickerOpen = false"
            >
              {{ $t("das.common.cancel") }}</button
            ><button
              class="van-picker__confirm van-haptics-feedback"
              type="button"
              @click="confirmH5WalletType"
            >
              {{ $t("das.common.confirm") }}
            </button>
          </div>
          <div
            class="van-picker__columns dmk-h5-picker-columns"
            :class="{ 'is-dragging': h5PickerDragging }"
            style="height: 264px"
            @wheel.prevent="onH5PickerWheel"
            @pointerdown="startH5PickerDrag"
            @pointermove="moveH5PickerDrag"
            @pointerup="endH5PickerDrag"
            @pointercancel="endH5PickerDrag"
          >
            <div class="van-picker-column">
              <ul
                class="van-picker-column__wrapper"
                :style="{
                  transform: `translate3d(0px, ${110 - h5PickerIndex * 44}px, 0px)`,
                  transitionDuration: h5PickerDragging ? '0ms' : '180ms',
                  transitionProperty: 'transform',
                }"
              >
                <li
                  v-for="(option, index) in pcWalletOptions"
                  :key="option.id"
                  class="van-picker-column__item"
                  :class="{
                    'van-picker-column__item--selected':
                      h5PickerIndex === index,
                  }"
                  role="button"
                  tabindex="0"
                  style="height: 44px"
                  @click="selectH5PickerIndex(index)"
                >
                  <div class="van-ellipsis">{{ option.label }}</div>
                </li>
              </ul>
            </div>
            <div
              class="van-picker__mask"
              style="background-size: 100% 110px"
            ></div>
            <div
              class="van-hairline-unset--top-bottom van-picker__frame"
              style="height: 44px"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <WithdrawalPasswordDialog
      ref="withdrawalPasswordDialog"
      @verified="handleCredentialVerified"
      @cancel="handleCredentialCancel"
    />
  </DmkH5Layout>
</template>

<script setup>
import DmkPcAccountShell from "@/components/dmkPc/DmkPcAccountShell.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
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
import WithdrawalPasswordDialog from "@/components/WithdrawalPasswordDialog.vue";
import {
  clearWithdrawalCredential,
  getWithdrawalCredential,
  setWithdrawalCredential,
} from "@/utils/withdrawalCredential";
import { safeBack, safePush, safeReplace } from "@/utils/navigation";
import { openCustomerServiceDialog } from "@/utils/customerServiceDialog";

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
const pcPickerOpen = ref(false);
const h5PickerOpen = ref(false);
const h5PickerIndex = ref(0);
const h5PickerDragging = ref(false);
const pcPickerIndex = ref(1);
const pcPickerDragging = ref(false);
let h5DragPointerId;
let h5DragStartY = 0;
let h5DragStartIndex = 0;
let h5DragMoved = false;
let h5SuppressClick = false;
let h5LastWheelAt = 0;
let pcDragPointerId;
let pcDragStartY = 0;
let pcDragStartIndex = 0;
let pcDragMoved = false;
let pcSuppressClick = false;
let pcLastWheelAt = 0;
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
const isEditing = computed(
  () => route.query.action === "edit" && Boolean(route.query.id),
);
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
const pcPrimaryAccount = computed(
  () =>
    accounts.value.find((item) => item.isDefault) || accounts.value[0] || {},
);
const pcWalletOptions = computed(() => {
  if (types.value.length) {
    return types.value.map((item) => ({
      id: String(item.id),
      label: item.typeName || item.name || String(item.id),
    }));
  }
  return ["PAYPAL", "CASHAPP", "OTHER"].map((label, index) => ({
    id: `pc-${index}`,
    label,
  }));
});
const pcSelectedWallet = computed(
  () => pcWalletOptions.value[pcPickerIndex.value] || pcWalletOptions.value[0],
);
const setPcPickerIndex = (index) => {
  const lastIndex = pcWalletOptions.value.length - 1;
  if (lastIndex < 0) return;
  pcPickerIndex.value = Math.max(0, Math.min(lastIndex, index));
};
const selectPcPickerIndex = (index) => {
  if (pcSuppressClick) return;
  setPcPickerIndex(index);
};
const onPcPickerWheel = (event) => {
  if (!event.deltaY) return;
  const now = performance.now();
  if (now - pcLastWheelAt < 80) return;
  pcLastWheelAt = now;
  setPcPickerIndex(pcPickerIndex.value + (event.deltaY > 0 ? 1 : -1));
};
const startPcPickerDrag = (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  pcDragPointerId = event.pointerId;
  pcDragStartY = event.clientY;
  pcDragStartIndex = pcPickerIndex.value;
  pcDragMoved = false;
  pcPickerDragging.value = true;
  event.currentTarget.setPointerCapture?.(event.pointerId);
};
const movePcPickerDrag = (event) => {
  if (!pcPickerDragging.value || event.pointerId !== pcDragPointerId) return;
  const offset = pcDragStartY - event.clientY;
  if (Math.abs(offset) > 4) pcDragMoved = true;
  setPcPickerIndex(pcDragStartIndex + Math.round(offset / 44));
};
const endPcPickerDrag = (event) => {
  if (!pcPickerDragging.value || event.pointerId !== pcDragPointerId) return;
  event.currentTarget.releasePointerCapture?.(event.pointerId);
  pcPickerDragging.value = false;
  pcDragPointerId = undefined;
  if (pcDragMoved) {
    pcSuppressClick = true;
    setTimeout(() => {
      pcSuppressClick = false;
    }, 0);
  }
};
const pcWalletName = computed(() => {
  const current = accountName(pcPrimaryAccount.value);
  if (current !== "—") return current;
  return form.withdrawalTypeId ? pcSelectedWallet.value?.label || "" : "";
});
const pcWalletAddress = computed(() => {
  const item = pcPrimaryAccount.value;
  return item.walletAddress || item.bankAccount || "";
});
const pcOpenWalletEditor = () => {
  const selectedIndex = pcWalletOptions.value.findIndex(
    (option) => String(option.id) === String(form.withdrawalTypeId),
  );
  if (selectedIndex >= 0) pcPickerIndex.value = selectedIndex;
  pcPickerOpen.value = true;
};
const confirmPcWalletType = () => {
  const option = pcSelectedWallet.value;
  if (option && !String(option.id).startsWith("pc-")) {
    form.withdrawalTypeId = String(option.id);
  }
  pcPickerOpen.value = false;
};
const h5WalletName = computed(() => {
  if (isFormOpen.value) {
    return (
      pcWalletOptions.value.find(
        (option) => String(option.id) === String(form.withdrawalTypeId),
      )?.label || ""
    );
  }
  return pcWalletName.value;
});
const openH5Picker = () => {
  const selectedIndex = pcWalletOptions.value.findIndex(
    (option) => String(option.id) === String(form.withdrawalTypeId),
  );
  h5PickerIndex.value = selectedIndex >= 0 ? selectedIndex : 0;
  h5PickerOpen.value = true;
};
const confirmH5WalletType = () => {
  const option = pcWalletOptions.value[h5PickerIndex.value];
  if (option && !String(option.id).startsWith("pc-")) {
    if (!isFormOpen.value) {
      resetForm();
      safeReplace(router, {
        path: "/paymentMethods",
        query: { action: "create" },
      });
    }
    form.withdrawalTypeId = String(option.id);
  }
  h5PickerOpen.value = false;
};
const setH5PickerIndex = (index) => {
  const lastIndex = pcWalletOptions.value.length - 1;
  if (lastIndex < 0) return;
  h5PickerIndex.value = Math.max(0, Math.min(lastIndex, index));
};
const selectH5PickerIndex = (index) => {
  if (h5SuppressClick) return;
  setH5PickerIndex(index);
};
const onH5PickerWheel = (event) => {
  if (!event.deltaY) return;
  const now = performance.now();
  if (now - h5LastWheelAt < 80) return;
  h5LastWheelAt = now;
  setH5PickerIndex(h5PickerIndex.value + (event.deltaY > 0 ? 1 : -1));
};
const startH5PickerDrag = (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  h5DragPointerId = event.pointerId;
  h5DragStartY = event.clientY;
  h5DragStartIndex = h5PickerIndex.value;
  h5DragMoved = false;
  h5PickerDragging.value = true;
  try {
    event.currentTarget.setPointerCapture?.(event.pointerId);
  } catch (_) {}
};
const moveH5PickerDrag = (event) => {
  if (!h5PickerDragging.value || event.pointerId !== h5DragPointerId) return;
  const offset = h5DragStartY - event.clientY;
  if (Math.abs(offset) > 4) h5DragMoved = true;
  setH5PickerIndex(h5DragStartIndex + Math.round(offset / 44));
};
const endH5PickerDrag = (event) => {
  if (!h5PickerDragging.value || event.pointerId !== h5DragPointerId) return;
  try {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  } catch (_) {}
  h5PickerDragging.value = false;
  h5DragPointerId = undefined;
  if (h5DragMoved) {
    h5SuppressClick = true;
    setTimeout(() => {
      h5SuppressClick = false;
    }, 0);
  }
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
  const invalidBank =
    isBank.value &&
    (!form.bankName || !form.bankAccount || !form.accountHolder);
  const invalidWallet =
    !isBank.value && (!form.walletName || !form.walletAddress);
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
    accounts.value = Array.isArray(data)
      ? data
      : data?.rows || data?.records || [];
  }
  if (typesResult.status === "fulfilled") {
    const data = typesResult.value.data;
    types.value = Array.isArray(data)
      ? data
      : data?.rows || data?.records || [];
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
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
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
  background: #36715e;
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

.dmk-pc-picker-columns,
.dmk-h5-picker-columns {
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.dmk-pc-picker-columns.is-dragging,
.dmk-h5-picker-columns.is-dragging {
  cursor: grabbing;
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
