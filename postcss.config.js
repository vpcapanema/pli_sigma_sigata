module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-custom-properties'),
    require('postcss-calc'),
    require('autoprefixer'),
    require('cssnano')({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true
          },
          normalizeWhitespace: true,
          mergeLonghand: true,
          mergeRules: true
        }
      ]
    })
  ]
};
