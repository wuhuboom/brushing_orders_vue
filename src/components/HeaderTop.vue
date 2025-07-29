<template>
    <van-sticky type="primary">
      <div
        class="w-full flex justify-between shadow-md items-center p-2 py-4 box-border bg-white"
      >
        <div class="w-[var(--header-logo-width)]">
          <img class="w-full" src="@/static/images/logo.png" alt="" />
        </div>
        <div class="flex justify-start items-center">
          <div
            class="text-white bg-[var(--main-color)] mr-2 text-xs px-3 py-1 rounded-full"
          >
            {{ $t("客服") }}
          </div>
          <img
            src="@/static/images/user2.png"
            class="w-[var(--header-me-width)]"
            alt=""
          />
        </div>
      </div>
    </van-sticky>
</template>