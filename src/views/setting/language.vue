<template>
  <main class="das-page language-page dmk-pc-only">
    <DasPageHeader title-key="das.page.language" />
    <section class="language-body">
      <button
        v-for="item in visibleLanguages"
        :key="item.code"
        :class="{ active: selected === item.code }"
        @click="selected = item.code"
      >
        <span class="language-option">
          <span class="language-flag" aria-hidden="true">{{ item.flag }}</span>
          <span>{{ item.name }}</span>
        </span></button
      ><button class="confirm" @click="confirm">
        {{ $t("das.common.confirm") }}
      </button>
    </section>
    <p class="das-page-copyright">{{ $t("das.common.copyright") }}</p>
  </main>

  <div
    class="dmk-h5-only dmk-mobile-current w-full relative bg-black text-white min-h-[100vh] dmk-login-scope"
  >
    <div class="w-full h-[30vh] overflow-hidden">
      <div
        class="w-full px-4 py-2 flex justify-between items-center"
      >
        <div class="w-[var(--logo-width)]">
          <img
            class="w-full"
            src="/dmk/assets/logo.png"
            alt=""
          />
        </div>
        <img
          class="w-6"
          src="/dmk/assets/language.png"
          alt=""
        />
      </div>
      <div class="w-[92%] mx-auto p-4">
        <div class="text-4xl text-center">
          <p>{{ $t("das.dmk.readyToStart") }}</p>
          <p>{{ $t("das.dmk.loginAccessCopy") }}</p>
        </div>
      </div>
    </div>
    <div class="login-input">
      <div class="box">
        <div
          class="text-white text-lg text-center py-3 mt-4"
        >
          {{ $t("das.dmk.enterLoginInformation") }}
        </div>
        <div class="mt-4 w-[90%] mx-auto">
          <div class="van-cell van-field">
            <div class="van-cell__value van-field__value">
              <div class="van-field__body">
                <input
                  class="van-field__control"
                  :placeholder="$t('das.auth.usernamePhone')"
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6 w-[90%] mx-auto">
          <div class="van-cell van-field">
            <div class="van-cell__value van-field__value">
              <div class="van-field__body">
                <input
                  class="van-field__control"
                  :placeholder="$t('das.auth.password')"
                  type="password"
                />
                <div class="van-field__button">
                  <img
                    src="/dmk/assets/eye-off.png"
                    class="w-6"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="mt-4 px-4 text-right text-white text-base"
        >
          {{ $t("das.dmk.forgotPassword") }}
        </div>
        <div class="mt-6 px-4">
          <button
            class="van-button van-button--default van-button--large van-button--block"
            style="
              color: white;
              background: var(--main-color);
              border-color: var(--main-color);
            "
            type="button"
          >
            <div class="van-button__content">
              <span class="van-button__text"
                ><span
                  class="text-black font-semibold text-base"
                  >{{ $t("das.dmk.login") }}</span
                ></span
              >
            </div>
          </button>
        </div>
        <div class="mt-20 text-center">
          {{ $t("das.dmk.noAccount") }}<span
            class="text-[var(--main-color)] ml-2"
            >{{ $t("das.dmk.signUp") }}</span
          >
        </div>
      </div>
    </div>

    <div class="dmk-language-scope">
      <div
        class="van-overlay"
        role="button"
        tabindex="0"
        style="z-index: 2005"
        @click="safeBack(router, '/account/login')"
      ></div>
      <div
        class="van-popup van-popup--right"
        role="dialog"
        tabindex="0"
        style="z-index: 2005; width: 50vw; height: 100%"
      >
        <div
          class="w-full h-full flex flex-col pt-14 box-border overflow-y-auto"
        >
          <button
            v-for="item in h5Languages"
            :key="item.code"
            type="button"
            class="w-full h-16 flex shrink-0 items-center justify-center text-white text-2xl uppercase"
            @click="
              selected = item.code;
              confirm();
            "
          >
            {{ item.name }}
          </button>
        </div>
        <i
          class="van-badge__wrapper van-icon van-icon-cross van-popup__close-icon van-popup__close-icon--top-right van-haptics-feedback"
          role="button"
          tabindex="0"
          @click="safeBack(router, '/account/login')"
        ></i>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { LANGS } from "@/config/lang";
import { useCommonStore } from "@/store/modules/common";
import { useLocale } from "@/util/useLocale";
import DasPageHeader from "@/components/DasPageHeader.vue";
import { safeBack } from "@/utils/navigation";
const commonStore = useCommonStore(),
  router = useRouter(),
  { locale } = useI18n(),
  { setLocale } = useLocale(),
  selected = ref(commonStore.clientLang || "en"),
  visibleLanguages = LANGS,
  h5Languages = LANGS,
  confirm = () => {
    commonStore.updateLang(selected.value);
    locale.value = selected.value;
    setLocale(selected.value);
    safeBack(router, "/my");
  };
</script>
<style scoped>
.language-page {
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.language-body {
  max-width: 760px;
  margin: auto;
  padding: 22px 30px 36px;
}
.language-body button {
  width: 100%;
  height: 58px;
  margin-bottom: 13px;
  border: 1px solid #d8dad4;
  border-radius: 16px;
  background: #fff;
  color: #17382d;
  font-weight: 800;
}
.language-option {
  display: inline-flex;
  align-items: center;
  gap: 11px;
}
.language-flag {
  font-size: 21px;
  line-height: 1;
}
.language-body button.active,
.language-body .confirm {
  border-color: #14392c;
  background: #14392c;
  color: #fff;
}
.language-body .confirm {
  margin-top: 13px;
  border-radius: 999px;
}
</style>
