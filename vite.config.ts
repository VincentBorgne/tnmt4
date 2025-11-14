import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: '0.0.0.0',
    allowedHosts: [
	  'regmgr.ydev.thescorehub.com',
	  'regmgr.xdev.thescorehub.com',
	  'regmgr.thescorehub.com',
      'aims.ydev.thescorehub.com',
      'aims.xdev.thescorehub.com',
      'localhost',
      '127.0.0.1'
    ],
  },
})