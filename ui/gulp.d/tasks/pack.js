'use strict'

const path = require('path')
const vfs = require('vinyl-fs')
const zip = require('@vscode/gulp-vinyl-zip')

module.exports = (src, dest, bundleName, onFinish) => () =>
  vfs
    .src('**/*', { base: src, cwd: src, dot: true })
    .pipe(zip.dest(path.join(dest, `${bundleName}-bundle.zip`)))
    .on('finish', () => onFinish && onFinish(path.resolve(dest, `${bundleName}-bundle.zip`)))
