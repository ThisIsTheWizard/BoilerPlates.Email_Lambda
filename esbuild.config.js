const esbuild = require('esbuild')
const path = require('path')

esbuild
  .build({
    entryPoints: ['./src/index.js'], // Entry point for your Lambda function
    bundle: true, // Bundle the dependencies
    platform: 'node', // Target Node.js
    target: 'node20', // Match the Node.js runtime
    outfile: './build/index.js', // Output file
    sourcemap: true, // Optional: Generate source maps
    external: ['aws-sdk'], // Exclude AWS SDK from bundling
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    alias: {
      src: path.resolve(__dirname, 'src')
    }
  })
  .then(() => {
    console.log('Build completed!')
  })
  .catch((err) => {
    console.error('Build failed:', err)
    process.exit(1)
  })
