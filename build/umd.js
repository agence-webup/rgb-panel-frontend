import build from './build'

export default Object.assign(build, {
  input: 'src/webup-rgb-panel.js',
  output: Object.assign(build.output, {
    file: 'dist/webup-rgb-panel.js',
    format: 'umd'
  })
})
