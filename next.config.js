const nextTranslate = require('next-translate')

module.exports = nextTranslate({
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        },
      ],
    });
    return config;
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