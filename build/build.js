import banner from './banner'
import babel from 'rollup-plugin-babel'

export default {
  output: {
    name: 'WebupRGBPanel',
    banner
  },
  plugins: [
    babel()
  ]
}
