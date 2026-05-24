<template>
    <div class="setting-page min-h-[100vh] bg-[#edf1f9]">
        <PageTopBar
            :title="$t('setting')"
            show-back
            @click-left="onClickLeft"
        />

        <div class="px-[16px] pt-[86px] pb-[24px]">
            <section class="setting-card">
                <button class="setting-row" type="button" @click="change">
                    <div class="setting-row__icon setting-row__icon--lang">
                        <van-icon name="notes-o" size="22" color="#0b9b73" />
                    </div>
                    <div class="setting-row__content">
                        <div class="setting-row__title">
                            {{ $t("change_language") }}
                        </div>
                        <div class="setting-row__desc">
                            {{ $t("choose_language") }}
                        </div>
                    </div>
                    <van-icon name="arrow" color="#2f78db" size="18px" />
                </button>
            </section>

            <button class="setting-logout" type="button" @click="logout">
                <van-icon
                    name="revoke"
                    size="20"
                    color="#f04d45"
                    class="mr-[8px]"
                />
                {{ $t("log_out") }}
            </button>
        </div>

        <Lang ref="langRef"></Lang>
    </div>
</template>

<script setup>
import PageTopBar from "@/components/PageTopBar.vue";
import Lang from "@/components/Lang.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { showConfirmDialog } from "vant";
import { ref } from "vue";

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const langRef = ref(null);

const onClickLeft = () => {
    router.replace({
        path: "/my",
    });
};

const logout = () => {
    showConfirmDialog({
        title: t("exit"),
        message: t("are_you_sure_you_want_to_logout"),
        confirmButtonColor: "var(--theme-primary)",
    })
        .then(() => {
            userStore.logout();
        })
        .catch(() => {});
};

const change = () => {
    langRef.value.open();
};
</script>

<style scoped>
.setting-card {
    overflow: hidden;
    border-radius: 22px;
    background: #ffffff;
    box-shadow: 0 10px 24px rgba(17, 28, 56, 0.06);
}

.setting-row {
    width: 100%;
    min-height: 112px;
    padding: 20px 22px;
    display: flex;
    align-items: center;
    background: #ffffff;
}

.setting-row__icon {
    width: 58px;
    height: 58px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.setting-row__icon--lang {
    background: #e7faf4;
}

.setting-row__content {
    flex: 1;
    min-width: 0;
    padding: 0 16px;
    text-align: left;
}

.setting-row__title {
    color: #121826;
    font-size: 18px;
    line-height: 24px;
    font-weight: 600;
}

.setting-row__desc {
    margin-top: 6px;
    color: #7a8396;
    font-size: 14px;
    line-height: 20px;
}

.setting-logout {
    margin-top: 18px;
    width: 100%;
    height: 58px;
    border-radius: 16px;
    background: #fff2ef;
    color: #f04d45;
    font-size: 18px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
</style>
