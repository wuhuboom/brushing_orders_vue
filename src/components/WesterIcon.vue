<template>
<img
    :src="name === 'back'
      ? '/westermedia/back.png'
      : ['deposit', 'withdraw'].includes(name)
        ? `/westermedia/${name}.png`
        : `/westermedia/nav-${name}${active ? '-active' : ''}.png`"
    alt=""
    aria-hidden="true"
    draggable="false"
  />
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  active: Boolean,
});
</script>
