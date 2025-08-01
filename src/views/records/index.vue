<template>
  <div>
    <HeaderTop></HeaderTop>
    <van-tabs color="#007513" v-model:active="active">
      <van-tab title="全部"></van-tab>
      <van-tab title="待办"></van-tab>
      <van-tab title="完成"></van-tab>
    </van-tabs>
    <div class="h-[80vh] overflow-y-scroll">
        <div class="w-full px-2 pt-6 box-border flex flex-col">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                >
                    <van-cell v-for="item in list" :key="item" :title="item">
                        <div class="w-full flex flex-col mb-6 bg-[#f1f4eb] border-[1px] border-[#eee] p-3 box-border rounded-xl">
                                <div class="w-full flex">
                                    <div class="mr-2 w-[20%]" style="width: 4rem;">
                                        <img src="https://bigwnew.oss-ap-northeast-1.aliyuncs.com/nextleft/202501246635286893376348160.png" alt="">
                                    </div>
                                    <div class="w-[80%] flex flex-col h-[3rem] justify-between">
                                        <div>
                                            <div class="text-[#000] text-sm font-semibold whitespace-nowrap  text-ellipsis overflow-hidden">
                                            商务休闲修身西装男士三件套英伦帅气西服正装SJT823-S280
                                        </div>
                                        <div class="grid grid-cols-4 mt-2">
                                            <div class="col-span-2 flex flex-col">
                                                <div class="text-xs text-[#666] font-medium">
                                                    总金额
                                                </div>
                                                <div class="mt-1 text-sm text-[var(--main-color)] font-semibold">
                                                    4460.54 美元
                                                </div>
                                            </div>
                                            <div class="col-span-2 flex flex-col">
                                                <div class="text-xs text-[#666] font-medium">
                                                    委员会
                                                </div>
                                                <div class="mt-1 text-sm text-[var(--main-color)] font-semibold">
                                                    4460.54 美元
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-full h-[1px] my-4" style="border-bottom: 1px dashed rgb(255, 255, 255);"></div>
                                <div class="w-full flex justify-between items-center">
                                    <div class="text-[#666] text-sm font-medium">
                                        2025年7月27日 14:34:10
                                    </div>
                                    <div class="text-white text-xs p-1 bg-[#666] font-medium rounded">
                                        待办的
                                    </div>
                                </div>
                                <div class="flex justify-end items-center mt-2">
                                    <van-button color="#007513" size="small">提交</van-button>
                                </div>
                        </div>
                    </van-cell>
                </van-list>
            </van-pull-refresh>
        </div>
        
    </div>
    <Footer name="/records"></Footer>

    <van-dialog v-model:show="show" title="标题" :show-confirm-button="false">
        <div class="w-[5rem] mx-auto" style="width: 6rem; z-index: 999;">
            <img src="https://bigwnew.oss-ap-northeast-1.aliyuncs.com/nextleft/202501246635286893376348160.png" alt="">
        </div>
        <div class="w-full mt-[-3rem] pt-[4rem] text-[#000] p-4 rounded-lg">
            <div class="w-[100%] mx-auto text-center text-sm font-semibold">
                休闲
            </div>
            <div class="flex w-full items-center pt-4 pb-4 mt-4">
                <div class="w-[50%] mr-2 flex flex-col py-4 bg-[#d8d8d8] justify-center items-center">
                    <div class="text-[#000] font-semibold">总金额</div>
                    <div class="text-xs text-[#000] mt-1">5美元</div>
                </div>
                <div class="w-[50%] mr-2 flex flex-col py-4 bg-[#d8d8d8] justify-center items-center">
                    <div class="text-[#000] font-semibold">总金额</div>
                    <div class="text-xs text-[#000] mt-1">5美元</div>
                </div>
            </div>
            <div class="bg-[#d8d8d8] p-4">
                <div class="flex justify-between items-center box-border">
                    <div class="text-[#000] text-sm">创建</div>
                    <div class="text-[#000] text-sm font-bold">2025年</div>
                </div>
                <div class="flex justify-between items-center box-border">
                    <div class="text-[#000] text-sm">创建</div>
                    <div class="text-[#000] text-sm font-bold">2025年</div>
                </div>
            </div>
            <div class="w-full mt-4">
                <van-button color="#007513" class="w-full">提交</van-button>
            </div>
        </div>
    </van-dialog>
  </div>
</template>

<script setup>
import HeaderTop from "@/components/HeaderTop.vue";
import { onMounted, ref } from "vue";
const active = ref(0);
const list =  5;
const show = ref(false)
</script>
