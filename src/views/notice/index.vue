<template>
  <div class="container w-full bg-[#f5f5f5] min-h-[100vh]">
    <van-nav-bar
      :title="$t('通知')"
      fixed
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="mt-10 pt-5">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('没有更多了')"
          @load="onLoad"
        >
          <van-cell v-for="item in list" :key="item" :title="item">
            <div
              class="w-full mb-4 bg-[#fff] flex flex-col p-3  border-l-4 border-[#206645]"
              @click="goDetail(item)"
            >
              <div class="flex justify-between">
                <div class="text-base font-semibold text-[#206645]">{{item.noticeTitle}}</div>
              </div>
              <div
                class="flex text-sm text-[#206645] items-center mt-3"
                v-html="item.noticeContent"
              >
               
              </div>
              <div class="flex justify-between mt-3">
                <div class="text-sm font-normal text-[#333333]">{{ item.createTime }}</div>
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
import { getNoticeList } from "../../api/apis";
import { useRouter } from "vue-router";
const router = useRouter();
const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const query = reactive({
  pageNum: 1,
  pageSize: 10,
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
    const res = await getNoticeList(query); // 你自己的接口
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
