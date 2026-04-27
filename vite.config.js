import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import ElementPlus from "unplugin-element-plus/vite";
import NutUIResolver from "@nutui/auto-import-resolver";
const timestamp = new Date().getTime(); // 当前时间戳
import { viteStaticCopy } from "vite-plugin-static-copy";
import fs from "fs";
import path from "path";

// function removeConfigJs() {
//   let resolvedOutDir = "dist";
//   return {
//     name: "remove-config-js",
//     configResolved(cfg) {
//       resolvedOutDir = cfg.build?.outDir || resolvedOutDir;
//     },
//     closeBundle() {
//       const target = path.resolve(resolvedOutDir, "config.js"); 
//       try {
//         if (fs.existsSync(target)) {
//           fs.unlinkSync(target);
//           console.log("[remove-config-js] 移除", target);
//         } else {
//           console.log("[remove-config-js] 跳过/没有发现:", target);
//         }
//       } catch (e) {
//         console.warn("[remove-config-js] 错误:", e);
//       }
//     },
//   };
// }

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(), NutUIResolver()],
    }),
    ElementPlus({
      // 对unplugin-element-plus的配置
      // 指定需要导入的样式，可以是'css'或'sass'
      useSource: true,
    }),
    // removeConfigJs(),

    ...(command === "build"
      ? [
          viteStaticCopy({
            targets: [
              { src: ["public/*", "!public/config.js"], dest: "." },
              { src: ["public/**/*", "!public/config.js"], dest: "." },
            ],
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // 使用 resolve 来设置 '@' 别名指向 src 目录
    },
  },
  server: {
    watch: {
      usePolling: true, // 修复HMR热更新失效
    },
  },
  build: {
    copyPublicDir: false,
    rollupOptions: {
      output: {
        // 给 js、css、assets 加时间戳
        entryFileNames: `assets/js/[name].[hash].${timestamp}.js`,
        chunkFileNames: `assets/js/[name].[hash].${timestamp}.js`,
        assetFileNames: `assets/[ext]/[name].[hash].${timestamp}.[ext]`,
      },
    },
  },
}));
