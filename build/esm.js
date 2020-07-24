import banner from './banner'

export default {
  input: 'src/webup-rgb-panel.js',
  output: {
    name: 'WebupRGBPanel',
    comments: '/^!/',
    file: 'dist/webup-rgb-panel.esm.js',
    format: 'es',
    banner
  }
}
