<template>
  <DasPasswordForm
    section-key="das.page.fundPassword"
    old-key="das.form.oldFundPassword"
    new-key="das.form.newFundPassword"
    confirm-key="das.form.confirmNewFundPassword"
    note-key="das.form.fundPasswordNote"
    old-field="oldTradePassword"
    new-field="newTradePassword"
    :submitter="editTradePassword"
  />
</template>
<script setup>
import { editTradePassword } from "@/api/apis";
import DasPasswordForm from "@/components/DasPasswordForm.vue";
</script>
