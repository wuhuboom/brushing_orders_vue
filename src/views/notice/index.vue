<template>
  <div class="container w-full bg-[#ecf4ff] min-h-[100vh]" @scroll="handleScroll">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('通知')"
	    fixed
	    left-arrow
	    @click-left="onClickLeft"
	  >
		<template #left>
	  	  <img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	    </template>
	  </van-nav-bar>
	</van-sticky>
	<HeaderTop></HeaderTop>
	<van-nav-bar
	  class="pos"
	  :title="$t('通知')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	  <template #left>
		<img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	  </template>
	</van-nav-bar>
    <div class="pl-3 pr-3  pt-5">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('没有更多了')"
          @load="onLoad"
        >
          <van-cell v-for="item in list" :key="item" :title="item">
            <div
              class="w-full mb-4 border-b-[1px] border-[#000] flex flex-col p-3  item"
              @click="goDetail(item)"
            >
              <div class="flex justify-between">
                <div class="text-base font-bold text-[#333]">{{item.noticeTitle}}</div>
              </div>
              <div
                class="flex text-sm text-[#000] items-center mt-1"
                v-html="item.noticeContent"
              >
               
              </div>
              <div class="flex items-center  mt-4">
				 <!-- <van-icon name="clock-o"/> -->
				 <img class="w-3.5" src="@/static/images/base/icon-26.png"/>
                <div class="text-sm font-normal text-[#999999] ml-1.5">{{ formatWithTimezone(item.createTime,userStore.zoneActive.tzName)  }}</div>
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
import {formatWithTimezone}  from '../../util/utils'
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "../../store/modules/common";
const userStore = useUserStore();
const commonStore = useCommonStore();
const router = useRouter();
const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const navBarShow = ref(false);
const query = reactive({
  dto: {
  	  pageNum: 1,
  	  pageSize: 10,
  },
  lang: commonStore.clientLang
});
const onRefresh = async () => {
  refreshing.value = true;
  finished.value = false;
  query.dto.pageNum = 1;
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
    if (data.length < query.dto.pageSize) {
      finished.value = true;
    } else {
      query.dto.pageNum++;
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

function handleScroll(e) { 
  const scrollTop = e.target.scrollTop
  if(scrollTop> 90){
	  navBarShow.value = true
  }else{
	  navBarShow.value = false
  }
}
onMounted(() => {
  //   getgetNoticeList();
  onLoad();
});
const onClickLeft = () => history.back();
</script>
<style scoped>
	.item {
	  position: relative;
	  padding-left: 60px; /* 给黑点留出左侧空间 */
	}
	/* 左侧实心大圆黑点 */
	.item::before {
	  content: '';
	  position: absolute;
	  left: 22px;
	  top: 50%;
	  transform: translateY(-50%);
	  width: 10px;   /* 黑点大小 */
	  height: 10px;
	  background: #000;
	  border-radius: 50%; /* 圆形 */
	}
</style>
