import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      plugins: [svelte()],
      base: '/ddd/',
    }
  } else {
    return {plugins: [svelte()]}
  }
})
