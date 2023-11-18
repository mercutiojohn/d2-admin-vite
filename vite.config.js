import vue from '@vitejs/plugin-vue2'
import vueJsx from '@vitejs/plugin-vue2-jsx'
import createSvgSpritePlugin from 'vite-plugin-svg-sprite'
import Markdown from 'vite-plugin-md'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'

const baseApi = process.env.VITE_APP_BASE_API

export default {
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueJsx({
      // options are passed on to @vue/babel-preset-jsx
    }),
    createSvgSpritePlugin({
      include: 'src/assets/svg-icons/icons/*.svg',
      symbolId: 'd2-[name]',
    }),
    Markdown(),
    UnoCSS()
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  define: {
    'process.env': process.env,
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/style/public.scss" as *;`
      },
      less: {
        modifyVars: {
          'blue': '#2262AB'
        },
        javascriptEnabled: true
      }
    }
  },

  // assetsInclude: ['**/*.md'],

  base: process.env.VITE_APP_PUBLIC_PATH || '/',
  server: {
    proxy: {
      [baseApi]: {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp('^' + baseApi), ''),
      },
    },
    hmr: {
      protocol: 'ws',
      host: '0.0.0.0',
    //   host: mode === 'development' ? 'localhost' : undefined,
    },
    // disableHostCheck: mode === 'development',
  },
}
