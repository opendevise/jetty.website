'use strict'

const fsp = require('node:fs/promises')
const path = require('node:path')

module.exports.register = function () {
  this.once('siteMapped', async ({ playbook, siteCatalog }) => {
    const { origin: siteBaseUrl, pathname: sitePath } = new URL(playbook.site.url)
    if (sitePath === '/') return
    const sitemap = siteCatalog.getFiles().find((file) => file.out && file.out.path === 'sitemap.xml')
    if (!sitemap) return
    sitemap.out.path = path.join('..', sitemap.out.path)
    const expandPath = this.require('@antora/expand-path-helper')
    const outputAbsDir = expandPath(playbook.output.dir, { dot: playbook.dir })
    const homeOutputAbsDir = sitePath.slice(1).split('/').reduce((d) => path.dirname(d), outputAbsDir)
    const homeSitemapAbsPath = path.join(homeOutputAbsDir, 'sitemap.xml')
    const homeSitemap = await fsp.readFile(homeSitemapAbsPath, 'utf8').catch(() => undefined)
    if (!homeSitemap) {
      return
    } else if (homeSitemap.includes('<sitemapindex ')) {
      const newEntries = sitemap.contents.toString().match(/<sitemap>.*?<\/sitemap>/g).join('\n')
      await fs.writeFile(homeSitemapAbsPath, homeSitemap.replace('</sitemapindex>', `${newEntries}\n</sitemapindex>`))
      delete sitemap.out
    } else {
      await fsp.rename(homeSitemapAbsPath, homeSitemapAbsPath.replace(/\.xml$/, '-ROOT.xml'))
      const newEntry = ['<sitemap>', `<loc>${siteBaseUrl}/sitemap-ROOT.xml</loc>`, '</sitemap>'].join('\n')
      sitemap.contents = Buffer.from(sitemap.contents.toString().replace('<sitemap>', `${newEntry}\n<sitemap>`))
    }
  })
}
