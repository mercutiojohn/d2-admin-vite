import vue from '@vitejs/plugin-vue2'
import vueJsx from '@vitejs/plugin-vue2-jsx'
import createSvgSpritePlugin from 'vite-plugin-svg-sprite'
import Markdown from 'vite-plugin-md'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'

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
    // port: 1024,
    host: true,
    open: true,
    proxy: {
      // https://cn.vitejs.dev/config/#server-proxy
      '/dev-api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/dev-api/, '')
      },
    },
    hmr: {
      protocol: 'ws',
      // host: '0.0.0.0',
      // host: mode === 'development' ? 'localhost' : undefined,
    },
    // disableHostCheck: mode === 'development',
  },
}
