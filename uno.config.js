import { defineConfig } from 'unocss'
import { presetUno } from 'unocss'
import { presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({ /* options */ }),
  ],
  pipeline: {
    include: [
      // the default
      /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
      // include js/ts files
      'src/**/*.{js,ts}',
    ],
    // exclude files
    // exclude: []
  }
})