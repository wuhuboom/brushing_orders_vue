<template>
  <div class="pc-menu" @click.self="$emit('close')">
    <section class="pc-menu__panel">
      <div class="pc-menu__body">
        <p class="pc-menu__eyebrow">Profile</p>
        <div class="pc-menu__links">
          <button v-for="item in profileItems" :key="item.label" type="button" @click="go(item.path)">
            <span>{{ item.label }}</span><b>↗</b>
          </button>
        </div>
        <div class="pc-menu__divider"></div>
        <p class="pc-menu__eyebrow">Core Service</p>
        <div class="pc-menu__services">
          <article v-for="item in services" :key="item.title">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { safePush } from "@/utils/navigation";

const emit = defineEmits(["close"]);
const router = useRouter();
const profileItems = [
  { label: "Edit Profile", path: "/profileItem" },
  { label: "My Wallet", path: "/my" },
  { label: "Withdraw", path: "/withdraw" },
  { label: "Deposit History", path: "/rechargeHistory" },
  { label: "VIP Level", path: "/vips" },
  { label: "Salary", path: "/salary" },
  { label: "FAQs", path: "/faqs" },
  { label: "T & C", path: "/tc" },
  { label: "Customer Support", path: "/contact" },
  { label: "Logout", path: "/account/logout" },
];
const services = [
  { title: "SEO", description: "Build visibility and sustainable organic growth." },
  { title: "PPC", description: "Reach the right audience with efficient paid search." },
  { title: "Web Design & Dev", description: "Create fast, modern experiences that convert." },
];
const go = async (path) => {
  emit("close");
  await safePush(router, path);
};
</script>

<style scoped>
.pc-menu {
  position: absolute;
  z-index: 35;
  inset: 76px 0 auto;
  min-height: calc(100vh - 76px);
  background: rgba(0, 0, 0, 0.7);
}
.pc-menu__panel {
  border-top: 1px solid #242424;
  background: #111;
  color: #fff;
}
.pc-menu__body {
  width: min(100%, 1200px);
  margin: auto;
  padding: 38px 0 42px;
}
.pc-menu__eyebrow {
  margin: 0 0 22px;
  color: #777;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}
.pc-menu__links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 46px;
}
.pc-menu__links button {
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  border-bottom: 1px solid #2d2d2d;
  background: transparent;
  color: #fff;
  text-align: left;
}
.pc-menu__links b {
  color: #d4ff4f;
  font-weight: 400;
}
.pc-menu__divider {
  height: 1px;
  margin: 34px 0;
  background: #292929;
}
.pc-menu__services {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 54px;
}
.pc-menu__services h3 {
  margin: 0 0 9px;
  font-size: 17px;
}
.pc-menu__services p {
  margin: 0;
  color: #888;
  font-size: 13px;
  line-height: 1.6;
}
</style>
