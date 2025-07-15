import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    viteMockServe({
      mockPath: 'mock', // mock 文件目录
      localEnabled: true
    })
  ]
});
