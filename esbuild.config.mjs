import esbuildServe from 'esbuild-serve';

esbuildServe(
    {
        entryPoints: ['src/main.ts'], // your main TS entry
        bundle: true,                  // bundle all dependencies
        outfile: 'out/bundle.js',     // output file
        minify: false,                 // optional
        sourcemap: true,               // optional
        target: ['es2020'],            // modern JS output
        loader: { '.ts': 'ts' },       // ensure TS files are handled
    },
    {
        // serve options (optional)
        port: 7000,
        root: 'out'
    }
);