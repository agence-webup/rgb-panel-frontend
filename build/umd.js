import build from './build'

export default Object.assign(build, {
  input: 'src/webup-rgb-pannel.js',
  output: Object.assign(build.output, {
    file: 'dist/webup-rgb-pannel.js',
    format: 'umd'
  })
})
