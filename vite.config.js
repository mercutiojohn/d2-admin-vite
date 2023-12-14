import vue from '@vitejs/plugin-vue2'
import vueJsx from '@vitejs/plugin-vue2-jsx'
import createSvgSpritePlugin from 'vite-plugin-svg-sprite'
import Markdown from 'vite-plugin-md'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'
// import pathResolve from 'vite-plugin-path-resolve'

// function getPath(dir) {
//   return path.resolve(path.dirname(fileURLToPath(import.meta.url)), dir)
// }

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
    UnoCSS(),
    // pathResolve({ src: getPath('src') }),
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      // ElTable生产环境不显示解决，ref: https://github.com/ElemeFE/element/issues/21968#issuecomment-1537071209
      vue$: 'vue/dist/vue.esm.js',
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
    // hmr: {
    //   host: mode === 'development' ? 'localhost' : undefined,
    // },
    // disableHostCheck: mode === 'development',
  },
}
