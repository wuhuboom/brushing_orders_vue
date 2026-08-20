// vite.config.js
import { defineConfig } from "file:///Users/jacpli/Desktop/yongwang/brushing_orders_vue/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/jacpli/Desktop/yongwang/brushing_orders_vue/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import fs from "fs";
import AutoImport from "file:///Users/jacpli/Desktop/yongwang/brushing_orders_vue/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///Users/jacpli/Desktop/yongwang/brushing_orders_vue/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///Users/jacpli/Desktop/yongwang/brushing_orders_vue/node_modules/unplugin-vue-components/dist/resolvers.js";
import ElementPlus from "file:///Users/jacpli/Desktop/yongwang/brushing_orders_vue/node_modules/unplugin-element-plus/dist/vite.mjs";
import NutUIResolver from "file:///Users/jacpli/Desktop/yongwang/brushing_orders_vue/node_modules/@nutui/auto-import-resolver/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/jacpli/Desktop/yongwang/brushing_orders_vue";
function removeConfigJs() {
  let resolvedOutDir = resolve(process.cwd(), "dist");
  return {
    name: "remove-config-js",
    apply: "build",
    configResolved(config) {
      resolvedOutDir = resolve(config.root, config.build?.outDir || "dist");
    },
    closeBundle() {
      const configPath = resolve(resolvedOutDir, "config.js");
      if (fs.existsSync(configPath)) {
        fs.unlinkSync(configPath);
        console.log("[remove-config-js] removed:", configPath);
      }
    }
  };
}
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver(), NutUIResolver()]
    }),
    ElementPlus({
      // 对unplugin-element-plus的配置
      // 指定需要导入的样式，可以是'css'或'sass'
      useSource: true
    }),
    removeConfigJs()
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
      // 使用 resolve 来设置 '@' 别名指向 src 目录
    }
  },
  server: {
    watch: {
      usePolling: true
      // 修复HMR热更新失效
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvamFjcGxpL0Rlc2t0b3AveW9uZ3dhbmcvYnJ1c2hpbmdfb3JkZXJzX3Z1ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2phY3BsaS9EZXNrdG9wL3lvbmd3YW5nL2JydXNoaW5nX29yZGVyc192dWUvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2phY3BsaS9EZXNrdG9wL3lvbmd3YW5nL2JydXNoaW5nX29yZGVyc192dWUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xuaW1wb3J0IEVsZW1lbnRQbHVzIGZyb20gJ3VucGx1Z2luLWVsZW1lbnQtcGx1cy92aXRlJ1xuaW1wb3J0IE51dFVJUmVzb2x2ZXIgZnJvbSAnQG51dHVpL2F1dG8taW1wb3J0LXJlc29sdmVyJ1xuXG5mdW5jdGlvbiByZW1vdmVDb25maWdKcygpIHtcbiAgbGV0IHJlc29sdmVkT3V0RGlyID0gcmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnZGlzdCcpO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3JlbW92ZS1jb25maWctanMnLFxuICAgIGFwcGx5OiAnYnVpbGQnLFxuICAgIGNvbmZpZ1Jlc29sdmVkKGNvbmZpZykge1xuICAgICAgcmVzb2x2ZWRPdXREaXIgPSByZXNvbHZlKGNvbmZpZy5yb290LCBjb25maWcuYnVpbGQ/Lm91dERpciB8fCAnZGlzdCcpO1xuICAgIH0sXG4gICAgY2xvc2VCdW5kbGUoKSB7XG4gICAgICBjb25zdCBjb25maWdQYXRoID0gcmVzb2x2ZShyZXNvbHZlZE91dERpciwgJ2NvbmZpZy5qcycpO1xuXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhjb25maWdQYXRoKSkge1xuICAgICAgICBmcy51bmxpbmtTeW5jKGNvbmZpZ1BhdGgpO1xuICAgICAgICBjb25zb2xlLmxvZygnW3JlbW92ZS1jb25maWctanNdIHJlbW92ZWQ6JywgY29uZmlnUGF0aCk7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn1cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCksTnV0VUlSZXNvbHZlcigpXSxcbiAgICB9KSxcbiAgICBFbGVtZW50UGx1cyh7XG4gICAgICAvLyBcdTVCRjl1bnBsdWdpbi1lbGVtZW50LXBsdXNcdTc2ODRcdTkxNERcdTdGNkVcbiAgICAgIC8vIFx1NjMwN1x1NUI5QVx1OTcwMFx1ODk4MVx1NUJGQ1x1NTE2NVx1NzY4NFx1NjgzN1x1NUYwRlx1RkYwQ1x1NTNFRlx1NEVFNVx1NjYyRidjc3MnXHU2MjE2J3Nhc3MnXG4gICAgICB1c2VTb3VyY2U6IHRydWVcbiAgICB9KSxcbiAgICByZW1vdmVDb25maWdKcygpLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSwgLy8gXHU0RjdGXHU3NTI4IHJlc29sdmUgXHU2NzY1XHU4QkJFXHU3RjZFICdAJyBcdTUyMkJcdTU0MERcdTYzMDdcdTU0MTEgc3JjIFx1NzZFRVx1NUY1NVxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHdhdGNoOiB7XG4gICAgICB1c2VQb2xsaW5nOiB0cnVlLCAgIC8vIFx1NEZFRVx1NTkwREhNUlx1NzBFRFx1NjZGNFx1NjVCMFx1NTkzMVx1NjU0OFxuICAgIH0sXG59XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3VSxTQUFTLG9CQUFvQjtBQUNyVyxPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sUUFBUTtBQUNmLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCO0FBQ3BDLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sbUJBQW1CO0FBUjFCLElBQU0sbUNBQW1DO0FBVXpDLFNBQVMsaUJBQWlCO0FBQ3hCLE1BQUksaUJBQWlCLFFBQVEsUUFBUSxJQUFJLEdBQUcsTUFBTTtBQUVsRCxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxlQUFlLFFBQVE7QUFDckIsdUJBQWlCLFFBQVEsT0FBTyxNQUFNLE9BQU8sT0FBTyxVQUFVLE1BQU07QUFBQSxJQUN0RTtBQUFBLElBQ0EsY0FBYztBQUNaLFlBQU0sYUFBYSxRQUFRLGdCQUFnQixXQUFXO0FBRXRELFVBQUksR0FBRyxXQUFXLFVBQVUsR0FBRztBQUM3QixXQUFHLFdBQVcsVUFBVTtBQUN4QixnQkFBUSxJQUFJLCtCQUErQixVQUFVO0FBQUEsTUFDdkQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osV0FBVztBQUFBLE1BQ1QsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsSUFDbkMsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsV0FBVyxDQUFDLG9CQUFvQixHQUFFLGNBQWMsQ0FBQztBQUFBLElBQ25ELENBQUM7QUFBQSxJQUNELFlBQVk7QUFBQTtBQUFBO0FBQUEsTUFHVixXQUFXO0FBQUEsSUFDYixDQUFDO0FBQUEsSUFDRCxlQUFlO0FBQUEsRUFDakI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUE7QUFBQSxJQUMvQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFlBQVk7QUFBQTtBQUFBLElBQ2Q7QUFBQSxFQUNKO0FBQ0EsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
