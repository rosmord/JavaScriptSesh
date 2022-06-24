import { defineConfig } from 'vite'
//const path = require('path');
// import {path} from 'path';
import * as path from 'path';

export default defineConfig({
  build: {
    // Creates a build target for libraries.
    lib: {
        entry: path.resolve(__dirname, 'js/jsesh.js'),
        name: 'jsesh-library',
        fileName: (format) => `jsesh.${format}.js`,
      },
      /*
      rollupOptions: {
        external: [], // external libraries, used by the demo and not by the Jsesh library.
        output: {
          // Provide global variables to use in the UMD build
          // Add external deps here
          globals: {            
          },
        },
      },
    },  */  
    }
})
