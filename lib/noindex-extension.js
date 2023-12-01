'use strict'

module.exports.register = function () {
  this.once('pagesComposed', ({ contentCatalog }) => {
    contentCatalog.getPages(({ asciidoc, out }) => out && 'noindex' in asciidoc.attributes).forEach((page) => delete page.out)
  })
}
