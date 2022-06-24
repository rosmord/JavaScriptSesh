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
        external: [], // visibility of the libraries used by the system
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
