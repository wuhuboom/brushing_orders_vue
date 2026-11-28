<template>
  <DmkPcAccountShell breadcrumb-key="das.dmk.myWallet">
    <div class="w-full h-full dmk-payment-methods-scope" :class="{ 'nsg-wallet-editing': isFormOpen }">
      <h1 class="nsg-wallet-title">{{ $t(isFormOpen ? "das.nsg.walletInformation" : "das.page.paymentMethods") }}</h1>
      <p v-if="isFormOpen" class="nsg-wallet-intro">{{ $t("das.nsg.walletIntro") }}</p>
      <div class="nsg-wallet-content w-[90%] lg:w-[60%] mx-auto">
        <div v-if="!isFormOpen" class="dmk-wallet-list-view">
          <div v-if="accounts.length" class="dmk-wallet-list">
            <article
              v-for="item in accounts"
              :key="item.id"
              class="dmk-wallet-card"
              role="button"
              tabindex="0"
              @click="openEdit(item.id)"
              @keydown.enter="openEdit(item.id)"
            >
              <img class="dmk-wallet-card__icon" src="/nsg16/wallet-platform-mobile.png" alt="" />
              <div class="dmk-wallet-card__copy nsg-wallet-card-copy">
                <strong>{{ accountName(item) }}</strong>
                <span>{{ accountAddress(item) }}</span>
                <small v-if="item.isDefault">{{ $t("das.form.default") }}</small>
              </div>
              <button
                class="dmk-wallet-card__delete"
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
          <div v-else class="dmk-wallet-empty">{{ $t("das.form.noMoreData") }}</div>
          <button class="dmk-wallet-create" type="button" @click="openBankEditor">
            <span aria-hidden="true">＋</span>{{ $t("das.form.create") }}
          </button>
        </div>
        <form v-else class="nsg-wallet-form w-full box-border flex flex-col" novalidate @submit.prevent="save">
          <div class="w-full flex flex-col">
            <div class="w-full flex flex-col mb-3">
              <div class="nsg-wallet-field-label text-[#fff] text-base">
                <picture><source media="(max-width: 1023px)" srcset="/nsg16/wallet-platform-mobile.png" /><img src="/nsg16/wallet-platform-pc.png" alt="" /></picture>
                <div><strong>{{ $t("das.form.accountHolder") }}</strong><small>{{ $t("das.nsg.walletNameHint") }}</small></div>
              </div>
              <div class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939]">
                <div class="van-cell van-field">
                  <div class="van-cell__value van-field__value">
                    <div class="van-field__body">
                      <input v-model.trim="form.accountHolder" class="van-field__control" :aria-label="$t('das.form.accountHolder')" :placeholder="$t('das.nsg.walletNameHint')" type="text" maxlength="100" autocomplete="name" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full flex flex-col mb-3">
              <div class="nsg-wallet-field-label text-[#fff] text-base">
                <picture><source media="(max-width: 1023px)" srcset="/nsg16/wallet-platform-mobile.png" /><img src="/nsg16/wallet-platform-pc.png" alt="" /></picture>
                <div><strong>{{ $t("das.form.bankAccount") }}</strong><small>{{ $t("das.nsg.walletAddressHint") }}</small></div>
              </div>
              <div class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939]">
                <div class="van-cell van-field">
                  <div class="van-cell__value van-field__value">
                    <div class="van-field__body">
                      <input v-model.trim="form.bankAccount" class="van-field__control" :aria-label="$t('das.form.bankAccount')" :placeholder="$t('das.nsg.walletAddressHint')" type="text" maxlength="100" inputmode="numeric" autocomplete="off" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full flex flex-col mb-3">
              <div class="nsg-wallet-field-label text-[#fff] text-base">
                <picture><source media="(max-width: 1023px)" srcset="/nsg16/wallet-platform-mobile.png" /><img src="/nsg16/wallet-platform-pc.png" alt="" /></picture>
                <div><strong>{{ $t("das.form.bankName") }}</strong><small>{{ $t("das.nsg.walletPlatformHint") }}</small></div>
              </div>
              <div class="nsg-wallet-select w-full mt-2 bg-[#1a1a1a] border border-[#393939]"
                @focusout="closePcPickerOnBlur" @keydown.esc="pcPickerOpen = false">
                <div ref="pcBankControl" role="combobox" :aria-expanded="pcPickerOpen" aria-controls="nsg-bank-options" aria-haspopup="listbox" @click="pcPickerOpen ? pcPickerOpen = false : openPcBankPicker()" @keydown.enter.prevent="pcPickerOpen ? confirmPcBank() : openPcBankPicker()" @keydown.space.prevent="openPcBankPicker()" @keydown.down.prevent="movePcSelection(1)" @keydown.up.prevent="movePcSelection(-1)" class="van-cell van-cell--clickable van-field" :aria-label="$t('das.form.bankName')" tabindex="0">
                  <div class="van-cell__value van-field__value">
                    <div class="van-field__body">
                      <input :value="form.bankName" class="van-field__control" :placeholder="$t('das.nsg.walletPlatformHint')" readonly tabindex="-1" type="text" />
                    </div>
                  </div>
                  <img src="/nsg16/profile-chevron.png" class="nsg-wallet-chevron" alt="" />
                </div>
                <div v-if="pcPickerOpen" ref="pcBankOptions" id="nsg-bank-options" class="nsg-wallet-select__options" role="listbox" :aria-label="$t('das.form.bankName')">
                  <button v-for="(option, index) in bankOptions" :key="option.id" type="button" role="option" :aria-selected="pcPickerIndex === index" :class="{ 'is-selected': pcPickerIndex === index }" @click="selectPcBank(index)">
                    <span>{{ option.label }}</span><span v-if="pcPickerIndex === index" aria-hidden="true">✓</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="w-full flex flex-col mb-3">
              <div class="nsg-wallet-field-label text-[#fff] text-base">
                <picture><source media="(max-width: 1023px)" srcset="/nsg16/wallet-platform-mobile.png" /><img src="/nsg16/wallet-platform-pc.png" alt="" /></picture>
                <div><strong>{{ $t("das.form.branchName") }}</strong><small>{{ $t("das.auth.optional") }}</small></div>
              </div>
              <div class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939]">
                <div class="van-cell van-field">
                  <div class="van-cell__value van-field__value">
                    <div class="van-field__body">
                      <input v-model.trim="form.branchName" class="van-field__control" :aria-label="$t('das.form.branchName')" :placeholder="$t('das.form.branchName')" type="text" maxlength="100" autocomplete="off" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full mt-3">
              <button class="van-button van-button--default van-button--large" type="submit" :disabled="saving || typesLoading">
                <div class="van-button__content"><span class="van-button__text">{{ $t("das.common.save") }}</span></div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </DmkPcAccountShell>
  <DmkH5Layout class="dmk-mobile-current">
    <div class="w-full dmk-payment-methods-scope" :class="{ 'nsg-wallet-editing': isFormOpen }">
      <div class="nsg-mobile-section-bar nsg-wallet-mobile-title">
        <NsgBackButton type="button" :aria-label="$t('das.common.back')" @click="safeBack(router, '/my')" />
        <strong>{{ $t("das.dmk.myWallet") }}</strong>
        <i aria-hidden="true"></i>
      </div>
      <div class="w-[90%] mx-auto text-3xl text-white nsg-wallet-mobile-heading">
        {{ $t(isFormOpen ? "das.nsg.walletInformation" : "das.page.paymentMethods") }}
      </div>
      <p v-if="isFormOpen" class="nsg-wallet-intro">{{ $t("das.nsg.walletIntro") }}</p>
      <div class="nsg-wallet-content w-[90%] mx-auto">
        <div v-if="!isFormOpen" class="dmk-wallet-list-view">
          <div v-if="accounts.length" class="dmk-wallet-list">
            <article
              v-for="item in accounts"
              :key="item.id"
              class="dmk-wallet-card"
              role="button"
              tabindex="0"
              @click="openEdit(item.id)"
              @keydown.enter="openEdit(item.id)"
            >
              <img class="dmk-wallet-card__icon" src="/nsg16/wallet-platform-mobile.png" alt="" />
              <div class="dmk-wallet-card__copy nsg-wallet-card-copy">
                <strong>{{ accountName(item) }}</strong>
                <span>{{ accountAddress(item) }}</span>
                <small v-if="item.isDefault">{{ $t("das.form.default") }}</small>
              </div>
              <button
                class="dmk-wallet-card__delete"
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
          <div v-else class="dmk-wallet-empty">{{ $t("das.form.noMoreData") }}</div>
          <button class="dmk-wallet-create" type="button" @click="openBankEditor">
            <span aria-hidden="true">＋</span>{{ $t("das.form.create") }}
          </button>
        </div>
        <form v-else class="nsg-wallet-form w-full box-border flex flex-col" novalidate @submit.prevent="save">
          <div class="w-full flex flex-col">
            <div class="w-full flex flex-col mb-3">
              <div class="nsg-wallet-field-label text-[#fff] text-base">
                <picture><source media="(max-width: 1023px)" srcset="/nsg16/wallet-platform-mobile.png" /><img src="/nsg16/wallet-platform-pc.png" alt="" /></picture>
                <div><strong>{{ $t("das.form.accountHolder") }}</strong><small>{{ $t("das.nsg.walletNameHint") }}</small></div>
              </div>
              <div class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939]">
                <div class="van-cell van-field">
                  <div class="van-cell__value van-field__value">
                    <div class="van-field__body">
                      <input v-model.trim="form.accountHolder" class="van-field__control" :aria-label="$t('das.form.accountHolder')" :placeholder="$t('das.nsg.walletNameHint')" type="text" maxlength="100" autocomplete="name" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full flex flex-col mb-3">
              <div class="nsg-wallet-field-label text-[#fff] text-base">
                <picture><source media="(max-width: 1023px)" srcset="/nsg16/wallet-platform-mobile.png" /><img src="/nsg16/wallet-platform-pc.png" alt="" /></picture>
                <div><strong>{{ $t("das.form.bankAccount") }}</strong><small>{{ $t("das.nsg.walletAddressHint") }}</small></div>
              </div>
              <div class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939]">
                <div class="van-cell van-field">
                  <div class="van-cell__value van-field__value">
                    <div class="van-field__body">
                      <input v-model.trim="form.bankAccount" class="van-field__control" :aria-label="$t('das.form.bankAccount')" :placeholder="$t('das.nsg.walletAddressHint')" type="text" maxlength="100" inputmode="numeric" autocomplete="off" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full flex flex-col mb-3">
              <div class="nsg-wallet-field-label text-[#fff] text-base">
                <picture><source media="(max-width: 1023px)" srcset="/nsg16/wallet-platform-mobile.png" /><img src="/nsg16/wallet-platform-pc.png" alt="" /></picture>
                <div><strong>{{ $t("das.form.bankName") }}</strong><small>{{ $t("das.nsg.walletPlatformHint") }}</small></div>
              </div>
              <div class="nsg-wallet-select w-full mt-2 bg-[#1a1a1a] border border-[#393939]">
                <div role="button" :aria-expanded="h5PickerOpen" aria-haspopup="dialog" @click="openH5Picker()" @keydown.enter.prevent="openH5Picker()" @keydown.space.prevent="openH5Picker()" class="van-cell van-cell--clickable van-field" :aria-label="$t('das.form.bankName')" tabindex="0">
                  <div class="van-cell__value van-field__value">
                    <div class="van-field__body">
                      <input :value="form.bankName" class="van-field__control" :placeholder="$t('das.nsg.walletPlatformHint')" readonly tabindex="-1" type="text" />
                    </div>
                  </div>
                  <img src="/nsg16/profile-chevron.png" class="nsg-wallet-chevron" alt="" />
                </div>
              </div>
            </div>
            <div class="w-full flex flex-col mb-3">
              <div class="nsg-wallet-field-label text-[#fff] text-base">
                <picture><source media="(max-width: 1023px)" srcset="/nsg16/wallet-platform-mobile.png" /><img src="/nsg16/wallet-platform-pc.png" alt="" /></picture>
                <div><strong>{{ $t("das.form.branchName") }}</strong><small>{{ $t("das.auth.optional") }}</small></div>
              </div>
              <div class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939]">
                <div class="van-cell van-field">
                  <div class="van-cell__value van-field__value">
                    <div class="van-field__body">
                      <input v-model.trim="form.branchName" class="van-field__control" :aria-label="$t('das.form.branchName')" :placeholder="$t('das.form.branchName')" type="text" maxlength="100" autocomplete="off" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full mt-3">
              <button class="van-button van-button--default van-button--large" type="submit" :disabled="saving || typesLoading">
                <div class="van-button__content"><span class="van-button__text">{{ $t("das.common.save") }}</span></div>
              </button>
            </div>
          </div>
        </form>
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
              @click="confirmH5Bank"
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
                  transform: `translate3d(0px, ${110 - h5PickerPosition}px, 0px)`,
                  transitionDuration: h5PickerDragging ? '0ms' : '240ms',
                  transitionProperty: 'transform',
                  transitionTimingFunction: 'cubic-bezier(.2,.7,.2,1)',
                }"
              >
                <li
                  v-for="(option, index) in bankOptions"
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
  </DmkH5Layout>
  <WithdrawalPasswordDialog
    ref="withdrawalPasswordDialog"
    @verified="handleCredentialVerified"
    @cancel="handleCredentialCancel"
  />
</template>

<script setup>
import NsgBackButton from "@/components/dmk/NsgBackButton.vue";
import DmkPcAccountShell from "@/components/dmkPc/DmkPcAccountShell.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import WithdrawalPasswordDialog from "@/components/WithdrawalPasswordDialog.vue";
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
} from "@/api/apis";
import {
  clearWithdrawalCredential,
  getWithdrawalCredential,
  setWithdrawalCredential,
} from "@/utils/withdrawalCredential";
import { safeBack, safeReplace } from "@/utils/navigation";
import { MEXICO_BANKS } from "@/config/mexicoBanks";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const accounts = ref([]);
const types = ref([]);
const typesLoading = ref(true);
const saving = ref(false);
const loadingDetail = ref(false);
const credential = ref(getWithdrawalCredential());
const withdrawalPasswordDialog = ref(null);
const pendingCredentialAction = ref(null);
const pcPickerOpen = ref(false);
const pcBankControl = ref(null);
const pcBankOptions = ref(null);
const h5PickerOpen = ref(false);
const h5PickerIndex = ref(0);
const h5PickerDragging = ref(false);
const pcPickerIndex = ref(0);
let h5DragPointerId;
let h5DragStartY = 0;
const h5PickerPosition = ref(0);
let h5DragStartPosition = 0;
let h5LastPointerY = 0;
let h5LastPointerAt = 0;
let h5Velocity = 0;
let h5DragMoved = false;
let h5SuppressClick = false;
let h5LastWheelAt = 0;
const form = reactive({
  withdrawalTypeId: "",
  isDefault: false,
  bankAccount: "",
  accountHolder: "",
  bankName: "",
  branchName: "",
});

const isCreating = computed(() => route.query.action === "create");
const isEditing = computed(
  () => route.query.action === "edit" && Boolean(route.query.id),
);
const isFormOpen = computed(() => isCreating.value || isEditing.value);
const bankWithdrawalTypeId = computed(() => {
  const bank = types.value.find((item) =>
    String(item.typeName || item.name || "").trim().toLowerCase() === "bank",
  ) || types.value.find((item) => String(item.type) === "0");
  return bank?.id == null ? "" : bank.id;
});
const accountName = (item) =>
  item.accountName ||
  item.walletName ||
  item.bankName ||
  item.branchName ||
  item.withdrawalTypeName ||
  "—";
const accountAddress = (item) => {
  const value = String(item.walletAddress || item.bankAccount || "");
  if (value.length <= 14) return value || "—";
  return `${value.slice(0, 7)}••••${value.slice(-5)}`;
};
const bankOptions = MEXICO_BANKS.map((name) => ({ id: name, label: name }));
const pcSelectedBank = computed(
  () => bankOptions[pcPickerIndex.value] || bankOptions[0],
);
const setPcPickerIndex = (index) => {
  const lastIndex = bankOptions.length - 1;
  if (lastIndex < 0) return;
  pcPickerIndex.value = Math.max(0, Math.min(lastIndex, index));
};
const selectPcBank = (index) => {
  setPcPickerIndex(index);
  confirmPcBank();
};
const movePcSelection = async (direction) => {
  if (!pcPickerOpen.value) {
    await openPcBankPicker();
    return;
  }
  setPcPickerIndex(pcPickerIndex.value + direction);
  await nextTick();
  pcBankOptions.value?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
};
const closePcPickerOnBlur = (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) pcPickerOpen.value = false;
};
const requestCredential = (action) => {
  credential.value = getWithdrawalCredential();
  if (credential.value) return true;
  pendingCredentialAction.value = action;
  withdrawalPasswordDialog.value?.open();
  return false;
};
const openPcBankPicker = async () => {
  if (!requestCredential({ type: "picker", picker: "pc" })) return;
  if (!isFormOpen.value) await openCreate();
  const selectedIndex = bankOptions.findIndex(
    (option) => option.id === form.bankName,
  );
  pcPickerIndex.value = Math.max(0, selectedIndex);
  pcPickerOpen.value = true;
  await nextTick();
  pcBankControl.value?.focus({ preventScroll: true });
  pcBankOptions.value?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
};
const confirmPcBank = () => {
  if (pcSelectedBank.value) form.bankName = pcSelectedBank.value.label;
  pcPickerOpen.value = false;
};
const openH5Picker = async () => {
  if (!requestCredential({ type: "picker", picker: "h5" })) return;
  if (!isFormOpen.value) await openCreate();
  const selectedIndex = bankOptions.findIndex(
    (option) => option.id === form.bankName,
  );
  setH5PickerIndex(selectedIndex >= 0 ? selectedIndex : 0);
  h5PickerOpen.value = true;
};
const handleCredentialVerified = async (token) => {
  credential.value = setWithdrawalCredential(token);
  const action = pendingCredentialAction.value;
  pendingCredentialAction.value = null;
  if (action?.type === "picker" && action.picker === "pc") {
    await openPcBankPicker();
  }
  if (action?.type === "picker" && action.picker === "h5") {
    await openH5Picker();
  }
  if (action?.type === "create") await openBankEditor();
  if (action?.type === "edit") await loadEdit(action.id);
  if (action?.type === "remove") await remove(action.id);
};
const handleCredentialCancel = () => {
  pendingCredentialAction.value = null;
};
const confirmH5Bank = () => {
  const option = bankOptions[h5PickerIndex.value];
  if (option) form.bankName = option.label;
  h5PickerOpen.value = false;
};
const setH5PickerIndex = (index) => {
  const lastIndex = bankOptions.length - 1;
  if (lastIndex < 0) return;
  h5PickerIndex.value = Math.max(0, Math.min(lastIndex, index));
  h5PickerPosition.value = h5PickerIndex.value * 44;
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
  h5DragStartPosition = h5PickerPosition.value;
  h5LastPointerY = event.clientY;
  h5LastPointerAt = performance.now();
  h5Velocity = 0;
  h5DragMoved = false;
  h5PickerDragging.value = true;
};
const moveH5PickerDrag = (event) => {
  if (!h5PickerDragging.value || event.pointerId !== h5DragPointerId) return;
  const offset = h5DragStartY - event.clientY;
  if (!h5DragMoved && Math.abs(offset) > 4) {
    h5DragMoved = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  const now = performance.now();
  const elapsed = now - h5LastPointerAt;
  if (elapsed > 0) h5Velocity = (h5LastPointerY - event.clientY) / elapsed;
  h5LastPointerY = event.clientY;
  h5LastPointerAt = now;
  const maxPosition = Math.max(0, (bankOptions.length - 1) * 44);
  h5PickerPosition.value = Math.max(0, Math.min(maxPosition, h5DragStartPosition + offset));
  h5PickerIndex.value = Math.round(h5PickerPosition.value / 44);
};
const endH5PickerDrag = (event) => {
  if (!h5PickerDragging.value || event.pointerId !== h5DragPointerId) return;
  try {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  } catch (_) {}
  h5PickerDragging.value = false;
  h5DragPointerId = undefined;
  const momentum = event.type !== "pointercancel" && performance.now() - h5LastPointerAt < 80
    ? Math.max(-2, Math.min(2, h5Velocity)) * 130
    : 0;
  setH5PickerIndex(Math.round((h5PickerPosition.value + momentum) / 44));
  if (h5DragMoved) {
    h5SuppressClick = true;
    setTimeout(() => {
      h5SuppressClick = false;
    }, 0);
  }
};
const openBankEditor = async () => {
  if (!requestCredential({ type: "create" })) return;
  await openCreate();
};
const openCreate = async () => {
  resetForm();
  await safeReplace(router, {
    path: "/paymentMethods",
    query: { action: "create" },
  });
};
const normalizeAccounts = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.rows)) return data.rows;
  if (Array.isArray(data?.records)) return data.records;
  return data?.id == null ? [] : [data];
};
const refresh = async () => {
  const response = await getWithdrawalAccounts();
  accounts.value = normalizeAccounts(response.data);
};
const resetForm = () => {
  Object.assign(form, {
    withdrawalTypeId: bankWithdrawalTypeId.value,
    isDefault: false,
    bankAccount: "",
    accountHolder: "",
    bankName: "",
    branchName: "",
  });
  pcPickerOpen.value = false;
  h5PickerOpen.value = false;
};
const fillForm = (data = {}) => {
  Object.assign(form, {
    withdrawalTypeId: bankWithdrawalTypeId.value,
    isDefault: Boolean(data.isDefault),
    bankAccount: data.bankAccount || "",
    accountHolder: data.accountHolder || "",
    bankName: data.bankName || "",
    branchName: data.branchName || "",
  });
};
const credentialErrorCode = (error) =>
  Number(error?.code ?? error?.response?.data?.code ?? 0);
const refreshCredential = () => {
  credential.value = getWithdrawalCredential();
  if (credential.value) return true;
  showToast(t("das.form.credentialMissing"));
  return false;
};
const clearInvalidCredential = (error) => {
  if (credentialErrorCode(error) !== 526) return;
  clearWithdrawalCredential();
  credential.value = "";
};
const loadEdit = async (id) => {
  if (!refreshCredential()) return;
  loadingDetail.value = true;
  try {
    const response = await getWithdrawalAccount(id, credential.value);
    fillForm(response.data || {});
    await safeReplace(router, {
      path: "/paymentMethods",
      query: { action: "edit", id: String(id) },
    });
  } catch (error) {
    clearInvalidCredential(error);
    showToast(error?.msg || error?.message || t("das.common.requestFailed"));
  } finally {
    loadingDetail.value = false;
  }
};
const openEdit = (id) => {
  if (loadingDetail.value) return;
  if (!requestCredential({ type: "edit", id })) return;
  loadEdit(id);
};
const save = async () => {
  if (saving.value || typesLoading.value) return;
  if (!refreshCredential()) return;
  if (bankWithdrawalTypeId.value === "") return showToast(t("das.common.requestFailed"));
  if (!form.bankName.trim() || !form.bankAccount.trim() || !form.accountHolder.trim()) {
    return showToast(t("das.auth.required"));
  }
  saving.value = true;
  try {
    const payload = {
      withdrawalTypeId: bankWithdrawalTypeId.value,
      isDefault: form.isDefault,
      accountHolder: form.accountHolder,
      bankAccount: form.bankAccount,
      bankName: form.bankName,
      ...(form.branchName.trim() ? { branchName: form.branchName.trim() } : {}),
      token: credential.value,
    };
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
    clearInvalidCredential(error);
    showToast(error?.msg || error?.message || t("das.common.requestFailed"));
  } finally {
    saving.value = false;
  }
};
const remove = async (id) => {
  if (!requestCredential({ type: "remove", id })) return;
  try {
    await deleteWithdrawalMethod(id, credential.value);
    await refresh();
  } catch (error) {
    clearInvalidCredential(error);
    showToast(error?.msg || error?.message || t("das.common.requestFailed"));
  }
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
    getWithdrawalAccounts(), getWithdrawalTypes(),
  ]);
  if (accountsResult.status === "fulfilled") accounts.value = normalizeAccounts(accountsResult.value.data);
  if (typesResult.status === "fulfilled") {
    const data = typesResult.value.data;
    types.value = Array.isArray(data) ? data : data?.rows || data?.records || [];
    form.withdrawalTypeId = bankWithdrawalTypeId.value;
  } else {
    const error = typesResult.reason;
    showToast(error?.msg || error?.message || t("das.common.requestFailed"));
  }
  typesLoading.value = false;
  if (isEditing.value) {
    openEdit(route.query.id);
  }
});
</script>

<style scoped>
.dmk-payment-methods-scope .dmk-wallet-list-view { min-height: 0; display: flex; flex-direction: column; gap: 24px; padding: 12px 0 24px; }
.dmk-wallet-list { display: grid; gap: 18px; }
.dmk-payment-methods-scope .dmk-wallet-card {
  position: relative; min-height: 162px; padding: 28px; display: flex; align-items: center; gap: 20px;
  overflow: hidden; border: 1px solid #3c4b70; border-radius: 20px;
  background: radial-gradient(ellipse at 100% 0, #52408b55, transparent 60%), linear-gradient(120deg, #172b43, #182037);
  color: #f1f5ff; box-shadow: 0 16px 35px #050b171f; cursor: pointer;
  transition: border-color 160ms ease, transform 160ms ease;
}
.dmk-wallet-card::before { content: ""; position: absolute; top: 0; left: 28px; right: 28px; height: 2px; background: linear-gradient(90deg, #55caf3, #9a68eb, transparent); }
.dmk-wallet-card:hover { border-color: #6987bf; }
.dmk-wallet-card:active { transform: scale(.99); }
.dmk-wallet-card:focus-visible { outline: 2px solid #89bdff; outline-offset: 3px; }
.dmk-wallet-card__icon { width: 54px; height: 54px; object-fit: contain; flex: 0 0 auto; }
.dmk-wallet-card__copy { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.dmk-wallet-card__copy strong { color: #f1f5ff; font-size: 22px; font-weight: 600; overflow-wrap: anywhere; }
.dmk-payment-methods-scope .dmk-wallet-card__copy span { color: #a4b7d6; font: 14px/1.6 "DM Sans", Arial, sans-serif; overflow-wrap: anywhere; }
.dmk-wallet-card__copy small { display: flex; align-items: center; gap: 6px; width: max-content; padding: 4px 10px; border: 1px solid #5bd8c32e; border-radius: 6px; color: #69dfcc; background: #41c6af12; font-size: 11px; font-weight: 600; }
.dmk-wallet-card__copy small::before { content: ""; width: 5px; height: 5px; border-radius: 50%; background: #69dfcc; }
.dmk-payment-methods-scope .dmk-wallet-card__delete { align-self: flex-start; display: grid; place-items: center; width: 36px; height: 36px; padding: 9px; flex: 0 0 auto; border: 1px solid #ffffff12; border-radius: 10px; background: #10182b66; color: #a7b7d1; }
.dmk-wallet-card__delete:hover { color: #ffa6b8; background: #e259791a; }
.dmk-wallet-card__delete svg { width: 100%; height: 100%; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.dmk-wallet-empty { min-height: 180px; display: grid; place-items: center; border: 1px dashed #3a4968; border-radius: 20px; color: #92a3c0; text-align: center; }
.dmk-payment-methods-scope .dmk-wallet-create { width: 100%; min-height: 54px; margin: 0; border: 1px solid #516587; border-radius: 12px; background: linear-gradient(100deg, #49b5e6, #8640d9); color: #fff; font-size: 15px; font-weight: 600; }
.dmk-wallet-create span { margin-right: 8px; font-size: 22px; font-weight: 400; vertical-align: -1px; }
@media (max-width: 1023px) {
  .dmk-payment-methods-scope .dmk-wallet-card { min-height: 154px; padding: 24px 18px; gap: 14px; }
  .dmk-wallet-card__icon { width: 42px; height: 42px; }
  .dmk-wallet-card__copy strong { font-size: 20px; }
  .dmk-payment-methods-scope .dmk-wallet-card__copy span { font-size: 13px; }
  .dmk-payment-methods-scope .dmk-wallet-card__delete { width: 32px; height: 32px; padding: 7px; }
}

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

.dmk-h5-picker-columns {
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.dmk-h5-picker-columns.is-dragging {
  cursor: grabbing;
}

.nsg-wallet-select {
  position: relative;
  overflow: visible !important;
}
.nsg-wallet-select__options {
  position: absolute;
  z-index: 20;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  max-height: 280px;
  overflow-y: auto;
  scrollbar-color: #525c75 #141d30;
  padding: 6px;
  border: 1px solid #35415c;
  border-radius: 12px;
  background: #141d30;
  box-shadow: 0 16px 38px #0006;
}
.nsg-wallet-select__options button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 46px;
  padding: 10px 16px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: #cbd5e7;
  text-align: left;
  cursor: pointer;
}
.nsg-wallet-select__options button:hover,
.nsg-wallet-select__options button:focus-visible,
.nsg-wallet-select__options button.is-selected {
  border-color: #8664ca80;
  background: #262d45;
  color: #fff;
}
.nsg-wallet-select__options button span + span { color: #bd8cfa; }
.dmk-h5-picker-columns .van-picker-column__wrapper { will-change: transform; }

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
