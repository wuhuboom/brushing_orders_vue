<template>
  <DasPasswordForm
    section-key="das.page.fundPassword"
    old-key="das.page.fundPassword"
    new-key="das.form.newFundPassword"
    confirm-key="das.form.confirmNewFundPassword"
    note-key="das.form.loginPasswordNote"
    old-field="oldTradePassword"
    new-field="newTradePassword"
    :old-required="false"
    :submitter="editTradePassword"
  />
</template>
<script setup>
import { editTradePassword } from "@/api/apis";
import DasPasswordForm from "@/components/DasPasswordForm.vue";
</script>
