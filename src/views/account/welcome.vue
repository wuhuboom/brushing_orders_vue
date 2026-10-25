<template>
  <DmkPcLayout :authenticated="false">
    <DmkPcHomeContent />
  </DmkPcLayout>
  <DmkH5Layout class="dmk-mobile-current" :authenticated="false">
    <DmkH5HomeContent />
  </DmkH5Layout>
</template>
<script setup>
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import DmkH5HomeContent from "@/components/dmkH5/DmkH5HomeContent.vue";
import DmkPcLayout from "@/components/dmkPc/DmkPcLayout.vue";
import DmkPcHomeContent from "@/components/dmkPc/DmkPcHomeContent.vue";
import { useRouter } from "vue-router";
const router = useRouter();
</script>
<style scoped>
.welcome-page {
  min-height: 100%;
  padding: 70px clamp(34px, 8vw, 78px) 38px;
  display: flex;
  flex-direction: column;
  background: #14392c;
  color: #f7f5ec;
}
.welcome-logo {
  width: 45px;
  height: 70px;
  object-fit: contain;
}
.welcome-copy {
  margin: auto 0;
}
.welcome-copy h1 {
  max-width: 620px;
  margin: 0;
  font-size: clamp(38px, 8vw, 66px);
  line-height: 1.03;
  letter-spacing: -0.045em;
  font-weight: 400;
}
.welcome-copy h1 span,
.welcome-copy h1 em {
  display: block;
}
.welcome-copy h1 em {
  color: #ed9b87;
  font-style: normal;
}
.welcome-copy p {
  max-width: 560px;
  margin: 28px 0 0;
  color: rgba(247, 245, 236, 0.58);
  font-size: clamp(14px, 2.4vw, 18px);
  line-height: 1.6;
}
.welcome-actions {
  display: grid;
  gap: 13px;
}
.welcome-actions button {
  width: 100%;
  height: 61px;
  border-radius: 999px;
  font-weight: 700;
}
.welcome-primary {
  border: 0;
  background: #f7f5ec;
  color: #17382d;
}
.welcome-secondary {
  border: 1px solid rgba(247, 245, 236, 0.32);
  background: transparent;
  color: #f7f5ec;
}
.welcome-copyright {
  margin: 23px 0 0;
  text-align: center;
  color: rgba(247, 245, 236, 0.35);
  font-size: 10px;
}
@media (min-width: 760px) {
  .welcome-page {
    min-height: 900px;
  }
  .welcome-actions {
    grid-template-columns: 1fr 1fr;
  }
  .welcome-copy {
    margin: 170px 0;
  }
}
</style>
