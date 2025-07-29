<template>
    <div class="flex items-center bg-gray h-[50px] rounded-full p-1 text-base">
      <div v-for="item in menus" class="flex-1 flex items-center justify-center h-full rounded-full"
        :class="selectMenu === item.value ? 'text-blue bg-[#FBFCFD]' : ' opacity-30'"
        @click="handleChangeMenu(item.value)">
        <p>{{ item.label }}</p>
      </div>
    </div>
</template>

<script setup>

const props = defineProps({
    menus: {
        type: Array,
        default: () => []
    },
    selectMenu: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['change'])
function handleChangeMenu(value) {
    emit('change', value)
}
</script>