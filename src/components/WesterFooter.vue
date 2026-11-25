<template>
  <footer class="wester-footer">
    <p>{{ $t(['/vips','/faqs','/clause','/tc'].includes($route.path) ? 'das.design.psgCopyright' : 'das.common.copyright') }}</p>
    <span class="wester-footer__signature">{{ $t('das.design.signature') }}</span>
  </footer>
</template>
