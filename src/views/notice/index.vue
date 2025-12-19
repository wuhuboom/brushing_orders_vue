<template>
  <div class="container w-full bg-[#fff] min-h-[100vh]">
    <van-nav-bar
      :title="$t('通知')"
      fixed
      left-arrow
      class="shadow"
      @click-left="onClickLeft"
    />
    <div class="mt-[45px] pt-5 px-[20px]">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('没有更多了')"
          @load="onLoad"
        >
          <van-cell v-for="item in list" :key="item" :title="item">
            <div
              class="w-full mb-4 bg-[#fff] border border-[#F3F4F6] flex flex-col p-3 "
              @click="goDetail(item)"
            >
              <div class="flex justify-between">
                <div class="text-base font-semibold text-[#000]">{{item.noticeTitle}}</div>
              </div>
              <div
                class="flex text-sm text-[#4B5563] items-center mt-3"
                v-html="item.noticeContent"
              >
               
              </div>
              <div class="flex justify-between mt-3">
                <div class="text-sm font-normal text-[#9CA3AF]">{{ formatWithTimezone(item.createTime,userStore.zoneActive.tzName)  }}</div>
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { getNoticeList,getNoticeListByLang } from "../../api/apis";
import { useRouter } from "vue-router";
import {formatWithTimezone} from "../../util/utils"
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const router = useRouter();
const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
import { useCommonStore } from '@/store/modules/common';
const commonStore = useCommonStore();

// 把 store 的 lang（如 'zhTW'）映射成真正传给后端的语言码（如 'zh_tw'）
const parLang = computed(() => {
  // 假设你的 store 里实现了 getter：getValueByKey(key) => value|null
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang; // 映射不到就用原值兜底
});
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  lang: parLang.value
});
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
const loadData = async () => {
  try {
    const res = await getNoticeListByLang(query); // 你自己的接口
    console.log(res);
    const data = res.rows;
    if (data.length < query.pageSize) {
      finished.value = true;
    } else {
      query.pageNum++;
    }

    list.value.push(...data);
  } catch (error) {
    console.error("加载失败", error);
    finished.value = true; // 避免无限加载
  }
};

const goDetail = (item) =>{
  router.push({
    path:'/noticeDetail',
    query:{
      id:item.noticeId
    }
  })
}
onMounted(() => {
  //   getgetNoticeList();
  onLoad();
});
const onClickLeft = () => history.back();
</script>
