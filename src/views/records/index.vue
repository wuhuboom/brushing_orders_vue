<template>
  <div>
    <HeaderTop></HeaderTop>
    <van-tabs color="#007513"  @change="swichTab" v-model:active="active">
      <van-tab :title="$t('全部')"></van-tab>
      <van-tab :title="$t('待办')"></van-tab>
      <van-tab :title="$t('完成')"></van-tab>
    </van-tabs>
    <div class="h-[80vh] overflow-y-scroll">
        <div class="w-full px-2 pt-6 box-border flex flex-col">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    :finished-text="$t('没有更多了')"
                    @load="onLoad"
                >
                    <van-cell v-for="item in list" :key="item" :title="item">
                        <div class="w-full flex flex-col mb-6 bg-[#f1f4eb] border-[1px] border-[#eee] p-3 box-border rounded-xl">
                                <div class="w-full flex">
                                    <div class="mr-2 w-[20%]" style="width: 4rem;">
                                        <img :src="VITE_API_IMG_URL+item.coverUrl" alt="">
                                    </div>
                                    <div class="w-[80%] flex flex-col h-[3rem] justify-between">
                                        <div>
                                            <div class="text-[#000] text-sm font-semibold whitespace-nowrap  text-ellipsis overflow-hidden">
                                            {{item.goodsName}}
                                        </div>
                                        <div class="grid grid-cols-4 mt-2">
                                            <div class="col-span-2 flex flex-col">
                                                <div class="text-xs text-[#666] font-medium">
                                                    {{$t('总金额')}}
                                                </div>
                                                <div class="mt-1 text-sm text-[var(--main-color)] font-semibold">
                                                    {{item.price}} {{$t('美元')}}
                                                </div>
                                            </div>
                                            <div class="col-span-2 flex flex-col">
                                                <div class="text-xs text-[#666] font-medium">
                                                    {{$t("佣金")}}
                                                </div>
                                                <div class="mt-1 text-sm text-[var(--main-color)] font-semibold">
                                                    {{item.commission}} {{$t('美元')}}
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-full h-[1px] my-4" style="border-bottom: 1px dashed rgb(255, 255, 255);"></div>
                                <div class="w-full flex justify-between items-center">
                                    <div class="text-[#666] text-sm font-medium">
                                        {{item.createTime}}
                                    </div>
                                    <div class="text-white text-xs p-1  font-medium rounded" :class="item.status == '2'?'bg-[var(--main-color)]':item.status == '1'?'bg-[#F56C6C]':'bg-[var(--main-color)]'">
                                        {{item.status=='0'? $t('已完成'): item.status == '1'?$t('冻结'): $t('待提交')}}
                                    </div>
                                </div>
                                <div class="flex justify-end items-center mt-2" v-if="item.status == '2'">
                                    <van-button color="#007513" @click="submit(item)" size="small">{{$t("提交")}}</van-button>
                                </div>
                        </div>
                    </van-cell>
                </van-list>
            </van-pull-refresh>
        </div>
        
    </div>
    <Footer name="/records"></Footer>

    <van-dialog v-model:show="show" closeable :title="''" :show-confirm-button="false">
        <div class="w-[5rem] mx-auto pt-10" style="width: 6rem; z-index: 999;">
            <img :src="VITE_API_IMG_URL+goodsData.coverUrl" alt="">
        </div>
        <div class="w-full mt-[-3rem] pt-[4rem] text-[#000] p-4 rounded-lg">
            <div class="w-[100%] mx-auto text-center text-sm font-semibold">
                {{goodsData.goodsName}}
            </div>
            <div class="flex w-full items-center pt-4 pb-4 mt-4">
                <div class="w-[50%] mr-2 flex flex-col py-4 bg-[#d8d8d8] justify-center items-center">
                    <div class="text-[#000] font-semibold">{{$t('总金额')}}</div>
                    <div class="text-xs text-[#000] mt-1">{{goodsData.price}}{{$t('美元')}}</div>
                </div>
                <div class="w-[50%] mr-2 flex flex-col py-4 bg-[#d8d8d8] justify-center items-center">
                    <div class="text-[#000] font-semibold">{{$t('佣金')}}</div>
                    <div class="text-xs text-[#000] mt-1">{{goodsData.commission}}{{$t('美元')}}</div>
                </div>
            </div>
            <div class="bg-[#d8d8d8] p-4">
                <div class="flex justify-between items-center box-border">
                    <div class="text-[#000] text-sm">{{$t('创建时间')}}</div>
                    <div class="text-[#000] text-sm font-bold">{{ formatWithTimezone(item.createTime,userStore.zoneActive.tzName)  }}</div>
                </div>
                <div class="flex justify-between items-center box-border">
                    <div class="text-[#000] text-sm">{{$t('编号')}}</div>
                    <div class="text-[#000] text-sm font-bold">{{goodsData.createTime}}</div>
                </div>
            </div>
            <div class="w-full mt-4">
                <van-button color="#007513" class="w-full" @click="submitVal">{{$t('提交')}}</van-button>
            </div>
        </div>
    </van-dialog>
  </div>
</template>

<script setup>
import HeaderTop from "@/components/HeaderTop.vue";
import { onMounted, ref ,reactive} from "vue";
import {getOrderInfos,submitOrder} from "../../api/apis";
import { showLoadingToast,closeToast,showFailToast,showSuccessToast   } from 'vant';
import { useI18n } from "vue-i18n";
import {formatWithTimezone}  from '../../util/utils'
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();
const VITE_API_IMG_URL = import.meta.env.VITE_API_IMG_URL;
const { t } = useI18n();
const active = ref(0);
const list =  ref([]);
const show = ref(false);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const goodsData =  ref({})
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  status:''
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
    let res = await getOrderInfos(query);
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
const submit = (item) => {
    goodsData.value = item;
    show.value = true
}

const submitVal = () =>{
    submitOrder(goodsData.value.id).then((res)=>{
        showSuccessToast(t("提交成功"));
        onRefresh()
        if(res.code == 201) {
            goodsData.value =  res.data
        }else {
            show.value = false;
        }
    })

}

const swichTab = () =>{
    console.log(active.value)
    if(active.value == 0) {
        query.status = ''
    } else if (active.value == 1) {
        query.status = 2
    } else {
        query.status = 0
    }
    onRefresh()
   

}
onMounted(() =>{
    onLoad()
})
</script>
<style scoped></style>
