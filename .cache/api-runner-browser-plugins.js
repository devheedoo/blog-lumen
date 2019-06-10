module.exports = [{
      plugin: require('/Users/heedo/blog-lumen/node_modules/gatsby-remark-images/gatsby-browser.js'),
      options: {"plugins":[],"maxWidth":960},
    },{
      plugin: require('/Users/heedo/blog-lumen/node_modules/gatsby-remark-autolink-headers/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/heedo/blog-lumen/node_modules/gatsby-plugin-netlify-cms/gatsby-browser.js'),
      options: {"plugins":[],"modulePath":"/Users/heedo/blog-lumen/src/cms/index.js"},
    },{
      plugin: require('/Users/heedo/blog-lumen/node_modules/gatsby-plugin-google-gtag/gatsby-browser.js'),
      options: {"plugins":[],"trackingIds":["UA-73379983-2"],"pluginConfig":{"head":true}},
    },{
      plugin: require('/Users/heedo/blog-lumen/node_modules/gatsby-plugin-offline/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/heedo/blog-lumen/node_modules/gatsby-plugin-catch-links/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/heedo/blog-lumen/gatsby-browser.js'),
      options: {"plugins":[]},
    }]
