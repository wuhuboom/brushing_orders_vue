<template>
    <div class="team-page w-full min-h-[100vh] bg-[#F9FAFB] mb-[10px]">
        <PageTopBar :title="$t('team')" show-back @click-left="onClickLeft" />
        <div
            class="team-page__hero bg-gradient-to-r from-[#a04149] to-[#6a4d52] px-[15px] mt-[-2px] pb-[10px]"
        >
            <!-- <div class="text-[14px] text-[#fff] pt-[10px]">{{$t('team_amount')}}</div>
        <div class="text-[28px] text-[#fff] pt-[20px]">000</div> -->
            <div class="flex items-center justify-center w-[100%]">
                <div
                    class="flex flex-col w-[125px] items-center justify-center"
                >
                    <div
                        class="text-white text-[12px] text-center whitespace-nowrap opacity-60"
                    >
                        {{ $t("team.info.total.money.text") }}
                    </div>

                    <div class="text-[12px] text-white mb-[10px] text-center">
                        {{
                            TeamInfo?.rebateStats?.totalSubordinateBalance || 0
                        }}
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-center py-[30px] w-[100%]">
                <div
                    class="flex flex-col w-[125px] items-center justify-center"
                >
                    <div class="text-[12px] text-white mb-[10px] text-center">
                        {{ TeamInfo?.rebateStats?.userId || 0 }}
                    </div>
                    <div
                        class="text-white text-[12px] text-center whitespace-nowrap opacity-60"
                    >
                        {{ $t("user_id") }}
                    </div>
                </div>
                <div class="w-[1px] h-[20px] bg-white opacity-60"></div>
                <div
                    class="flex flex-col w-[125px] items-center justify-center"
                >
                    <div class="text-[12px] text-white mb-[10px] text-center">
                        {{ TeamInfo?.rebateStats?.username || 0 }}
                    </div>
                    <div
                        class="text-white text-[12px] text-center whitespace-nowrap opacity-60"
                    >
                        {{ $t("username") }}
                    </div>
                </div>
                <div class="w-[1px] h-[20px] bg-white opacity-60"></div>
                <div
                    class="flex flex-col w-[125px] items-center justify-center"
                >
                    <div class="text-[12px] text-white mb-[10px] text-center">
                        {{ TeamInfo?.rebateStats?.inviteCode || 0 }}
                    </div>
                    <div
                        class="text-white text-[12px] text-center whitespace-nowrap opacity-60"
                    >
                        {{ $t("invitation_code") }}
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-center my-[30px] w-[100%]">
                <div
                    class="flex flex-col w-[125px] items-center justify-center"
                >
                    <div class="text-[12px] text-white mb-[10px] text-center">
                        {{ TeamInfo?.rebateStats?.rebateToday || 0 }}
                    </div>
                    <div
                        class="text-white text-[12px] text-center whitespace-nowrap opacity-60"
                    >
                        {{ $t("today") }}
                    </div>
                </div>
                <div class="w-[1px] h-[20px] bg-white opacity-60"></div>
                <div
                    class="flex flex-col w-[125px] items-center justify-center"
                >
                    <div class="text-[12px] text-white mb-[10px] text-center">
                        {{ TeamInfo?.rebateStats?.rebateYesterday || 0 }}
                    </div>
                    <div
                        class="text-white text-[12px] text-center whitespace-nowrap opacity-60"
                    >
                        {{ $t("yesterday") }}
                    </div>
                </div>
                <div class="w-[1px] h-[20px] bg-white opacity-60"></div>
                <div
                    class="flex flex-col w-[125px] items-center justify-center"
                >
                    <div class="text-[12px] text-white mb-[10px] text-center">
                        {{ TeamInfo?.rebateStats?.rebateTotal || 0 }}
                    </div>
                    <div
                        class="text-white text-[12px] text-center whitespace-nowrap opacity-60"
                    >
                        {{ $t("total") }}
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-center my-[30px] w-[100%]">
                <div
                    class="flex flex-col w-[125px] items-center justify-center"
                >
                    <div class="text-[12px] text-white mb-[10px] text-center">
                        {{ TeamInfo?.rebateStats?.subordinatesCount || 0 }}
                    </div>
                    <div
                        class="text-white text-[12px] text-center whitespace-nowrap opacity-60"
                    >
                        {{ $t("subordinates") }}
                    </div>
                </div>
                <div class="w-[1px] h-[20px] bg-white opacity-60"></div>
                <div
                    class="flex flex-col w-[125px] items-center justify-center"
                >
                    <div class="text-[12px] text-white mb-[10px] text-center">
                        {{ TeamInfo?.rebateStats?.totalTradingUsers || 0 }}
                    </div>
                    <div
                        class="text-white text-[12px] text-center whitespace-nowrap opacity-60"
                    >
                        {{ $t("traders") }}
                    </div>
                </div>
                <div class="w-[1px] h-[20px] bg-white opacity-60"></div>
                <div
                    class="flex flex-col w-[125px] items-center justify-center"
                >
                    <div class="text-[12px] text-white mb-[10px] text-center">
                        {{ TeamInfo?.rebateStats?.todayTradingUsers || 0 }}
                    </div>
                    <div
                        class="text-white text-[12px] text-center whitespace-nowrap opacity-60"
                    >
                        {{ $t("today_traders") }}
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full">
            <!-- 顶部导航 -->
            <div
                class="team-page__tabs flex justify-between items-center px-[16px] bg-white sticky top-0 z-10"
            >
                <div
                    v-for="(tab, index) in tabs"
                    :key="index"
                    class="px-4 py-2 cursor-pointer border-b-4 text-[14px] py-[16px]"
                    :class="
                        activeTab === index
                            ? 'text-[#D4AF36] font-bold border-yellow-500'
                            : 'text-gray-500 border-transparent'
                    "
                    @click="scrollTo(index)"
                >
                    {{ tab }}
                </div>
            </div>
        </div>
        <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('no_more')"
          @load="onLoad"
        >
          <van-cell v-for="item in list" :key="item" :title="item"> -->
        <div class="team-page__member-card bg-[#fff] px-[15px] pb-[15px]" v-for="item in levelUsers">
            <div
                class="flex justify-between py-[15px]"
                style="border-bottom: 0.02667rem solid rgb(246, 246, 246)"
            >
                <div class="flex">
                    <img
                        class="w-[20px] h-[20px] mr-[10px]"
                        src="../../static/images/logos.jpg"
                        alt=""
                    />
                    <span class="text-[14px] text-[rgb(51, 51, 51)]">{{
                        formatWithTimezone(
                            item.createTime,
                            userStore.zoneActive.tzName,
                        )
                    }}</span>
                </div>
                <div class="text-[#f78a0a]">
                    {{
                        item.level == 1
                            ? $t("level_1")
                            : item.level == 2
                              ? $t("level_2")
                              : $t("level_3")
                    }}
                </div>
            </div>
            <div class="flex justify-between text-[12px] pt-[10px]">
                <div class="text-[#6a4d52]">
                    {{ $t("username") }}
                </div>
                <div class="">{{ item.username }}</div>
            </div>
            <div class="flex justify-between text-[12px] pt-[10px]">
                <div class="text-[#6a4d52]">
                    {{ $t("total_deposits") }}
                </div>
                <div class="text-[#999]">{{ item.rechargeAmount }}</div>
            </div>
            <div class="flex justify-between text-[12px] pt-[10px]">
                <div class="text-[#6a4d52]">
                    {{ $t("total_withdrawals") }}
                </div>
                <div class="text-[#999]">{{ item.withdrawAmount }}</div>
            </div>
        </div>
        <!-- </van-cell>
        </van-list>
      </van-pull-refresh> -->
        <ContactUs ref="ContactUsRef"></ContactUs>
    </div>
</template>
<script setup>
import PageTopBar from "@/components/PageTopBar.vue";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { getTeamInfo } from "../../api/apis";
import { useUserStore } from "../../store/modules/user";
import ContactUs from "@/components/ContactUs.vue";
import { formatWithTimezone } from "../../util/utils";
import { showToast } from "@/util/message";
import { useI18n } from "vue-i18n";
const userStore = useUserStore();
const ContactUsRef = ref(null);
const { t } = useI18n();
const more = new URL("@/static/images/more10.png", import.meta.url).href;
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const TeamInfo = ref([]);
const levelUsers = ref([]);
const getGetTeamInfo = async () => {
    let res = await getTeamInfo();
    TeamInfo.value = res.data;
    levelUsers.value = res.data.levelUsers;
};

const tabs = ref([]);
const activeTab = ref(0);
const sectionRefs = ref([]);

// 点击 tab 滚动到对应区域
const scrollTo = (index) => {
    activeTab.value = index;
};
const onRefresh = async () => {
    refreshing.value = true;
    finished.value = false;
    query.pageNum = 1;
    list.value = [];
    await loadData();
    refreshing.value = false;
};
const onLoad = async () => {
    if (finished.value || loading.value) return;
    loading.value = true;
    await loadData();
    loading.value = false;
};

onMounted(() => {
    userStore.getUserInfo();
    getGetTeamInfo();
});
const onClickLeft = () => history.back();
</script>
<style>
.small-dot {
    font-size: 8px; /* 调整大小 */
    line-height: 1;
    vertical-align: middle;
    display: inline-block; /* 保证可以控制尺寸/对齐 */
    /* 如需更细微缩放也可用 transform: scale(0.8); */
}
.custom-html p {
    line-height: 20px;
    padding-bottom: 5px;
    font-family: Inter, Inter;
    font-weight: 400;
    font-size: 14px;
    color: #4b5563;
}

.custom-html li {
    line-height: 20px;
    padding-bottom: 5px;
    font-family: Inter, Inter;
    font-weight: 400;
    font-size: 12px;
    color: #4b5563;
}
</style>
