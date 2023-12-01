'use strict'

const path = require('node:path')

const URL_PREFIX = 'docs'

module.exports.register = function () {
  this.once('contentClassified', ({ contentCatalog }) => {
    contentCatalog.getComponents().filter(({ name }) => name !== 'ROOT').forEach(({ versions }) => {
      versions.forEach((version) => {
        version.url = `/${URL_PREFIX}${version.url}`
      })
    })
    contentCatalog.getFiles().filter((file) => file.out && file.src.component !== 'ROOT').forEach(({ out, pub }) => {
      out.path = path.join((out.dirname = path.join(URL_PREFIX, out.dirname)), out.basename)
      out.rootPath = path.join('..', out.rootPath)
      pub.url = `/${URL_PREFIX}${pub.url}`
      pub.rootPath = path.join('..', pub.rootPath)
    })
  })
}
