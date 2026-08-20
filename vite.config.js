import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import fs from "node:fs";
import path from "node:path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import ElementPlus from "unplugin-element-plus/vite";
import NutUIResolver from "@nutui/auto-import-resolver";

// Build with the same public-file strategy used by v10: do not let Vite
// copy public/ wholesale. Emit every public asset except config.js instead,
// so config.js can remain an external deployment-time configuration file.
function copyPublicWithoutConfig() {
  let publicRoot = "";

  return {
    name: "copy-public-without-config",
    apply: "build",
    configResolved(config) {
      publicRoot = path.resolve(config.root, config.publicDir);
    },
    buildStart() {
      if (!publicRoot || !fs.existsSync(publicRoot)) return;

      const emitDirectory = (directory) => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
          const sourcePath = path.join(directory, entry.name);
          const relativePath = path.relative(publicRoot, sourcePath).replaceAll("\\", "/");

          if (relativePath === "config.js") continue;
          if (entry.isDirectory()) {
            emitDirectory(sourcePath);
            continue;
          }
          if (!entry.isFile()) continue;

          this.emitFile({
            type: "asset",
            fileName: relativePath,
            source: fs.readFileSync(sourcePath),
          });
        }
      };

      emitDirectory(publicRoot);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
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
    copyPublicWithoutConfig(),
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
  },
});
