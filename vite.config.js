import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import NutUIResolver from '@nutui/auto-import-resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(),NutUIResolver()],
    }),
    ElementPlus({
      // 对unplugin-element-plus的配置
      // 指定需要导入的样式，可以是'css'或'sass'
      useSource: true
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 使用 resolve 来设置 '@' 别名指向 src 目录
    },
  },
  server: {
    watch: {
      usePolling: true,   // 修复HMR热更新失效
    },
}
})
