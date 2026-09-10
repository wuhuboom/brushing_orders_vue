<template>
  <DmkPcLayout :footer="false">
    <main class="pc-language-page">
      <button
        type="button"
        class="pc-language-back"
        @click="safeBack(router, '/my')"
      >
        <van-icon name="arrow-left" />
        {{ $t("das.common.back") }}
      </button>
      <section class="pc-language-panel" aria-labelledby="pc-language-title">
        <div class="pc-language-heading">
          <img src="/dmk/assets/language.png" alt="" />
          <h1 id="pc-language-title">{{ $t("das.page.language") }}</h1>
        </div>
        <div class="pc-language-grid">
          <button
            v-for="item in visibleLanguages"
            :key="item.code"
            type="button"
            class="pc-language-option"
            :class="{ active: selected === item.code }"
            :aria-pressed="selected === item.code"
            @click="selected = item.code"
          >
            <span class="pc-language-code" aria-hidden="true">{{ item.code.toUpperCase() }}</span>
            <span>{{ item.name }}</span>
            <van-icon v-if="selected === item.code" name="success" />
          </button>
        </div>
        <div class="pc-language-actions">
          <button type="button" class="pc-language-confirm" @click="confirm">
            {{ $t("das.common.confirm") }}
            <van-icon name="arrow" />
          </button>
        </div>
      </section>
    </main>
  </DmkPcLayout>

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
import DmkPcLayout from "@/components/dmkPc/DmkPcLayout.vue";
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
.pc-language-page {
  width: min(100% - 64px, 1000px);
  margin: 48px auto 80px;
  color: #fff;
}
.pc-language-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  color: #aaa;
  font-size: 14px;
}
.pc-language-back:hover {
  color: var(--main-color);
}
.pc-language-panel {
  padding: 36px;
  border: 1px solid #303030;
  border-radius: 20px;
  background: linear-gradient(145deg, #171717, #0b0b0b);
  box-shadow: 0 24px 64px #0006;
}
.pc-language-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 30px;
}
.pc-language-heading img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}
.pc-language-heading h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 600;
  line-height: 1.25;
}
.pc-language-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.pc-language-option {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 64px;
  padding: 12px 16px;
  border: 1px solid #353535;
  border-radius: 10px;
  background: #181818;
  color: #e6e6e6;
  text-align: left;
  font-size: 15px;
  transition: background 0.2s, border-color 0.2s;
}
.pc-language-option:hover {
  border-color: #747474;
  background: #232323;
}
.pc-language-option.active {
  border-color: var(--main-color);
  background: #252b13;
  color: var(--main-color);
}
.pc-language-code {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 7px;
  background: #ffffff0a;
  color: #999;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.pc-language-option.active .pc-language-code {
  background: #daff451a;
  color: var(--main-color);
}
.pc-language-option .van-icon {
  margin-left: auto;
  font-size: 18px;
}
.pc-language-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px solid #2c2c2c;
}
.pc-language-confirm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-width: 180px;
  min-height: 46px;
  padding: 10px 24px;
  border-radius: 10px;
  background: var(--main-color);
  color: #101207;
  font-size: 15px;
  font-weight: 700;
}
.pc-language-confirm:hover {
  filter: brightness(1.08);
}
.pc-language-page button {
  cursor: pointer;
}
.pc-language-page button:focus-visible {
  outline: 2px solid var(--main-color);
  outline-offset: 3px;
}
</style>
