const nextTranslate = require('next-translate')

module.exports = nextTranslate({
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
})

// https://github.com/vinissimus/next-translate#add-next-translate-plugin

// const nextTranslate = require('next-translate')
// module.exports = nextTranslate({
//     webpack: (config, { isServer, webpack }) => {
//         return config;
//     }
// })

// https://nextjs.org/docs/basic-features/image-optimization#device-sizes

// module.exports = {
//     images: {
//         deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
//     },
// }