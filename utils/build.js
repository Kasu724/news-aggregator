const esbuild = require('esbuild');

// Build your Lambda function bundle
esbuild.build({
  entryPoints: ['scripts/index.js'], // Adjust if your Lambda function's entry point has a different name or location
  bundle: true,              // Bundle all dependencies into one file
  minify: true,              // Minify the output to reduce file size
  platform: 'node',          // For Node.js environment
  target: ['node22'],        // Use appropriate Node target; adjust if needed (e.g., node14, node16)
  outfile: 'index.js',      // Output file name for the bundled code
}).catch(() => process.exit(1));