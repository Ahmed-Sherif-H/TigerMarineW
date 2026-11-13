import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const glbDir = path.resolve(__dirname, '..', '_glb-test')

function serveGlbTest() {
  return {
    name: 'serve-glb-test',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/glb-test/')) return next()
        const name = decodeURIComponent(req.url.split('?')[0].replace('/glb-test/', ''))
        const file = path.resolve(glbDir, name)
        if (!file.startsWith(glbDir) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
          res.statusCode = 404
          res.end('GLB not ready')
          return
        }
        res.setHeader('Content-Type', 'model/gltf-binary')
        res.setHeader('Cache-Control', 'no-cache')
        fs.createReadStream(file).pipe(res)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), serveGlbTest()],
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },
})
