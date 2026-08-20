<template>
  <DasPasswordForm
    section-key="das.page.loginPassword"
    old-key="das.form.oldLoginPassword"
    new-key="das.form.newLoginPassword"
    confirm-key="das.form.confirmNewLoginPassword"
    note-key="das.form.loginPasswordNote"
    old-field="oldPassword"
    new-field="newPassword"
    :submitter="editPassword"
  />
</template>
<script setup>
import { editPassword } from "@/api/apis";
import DasPasswordForm from "@/components/DasPasswordForm.vue";
</script>
